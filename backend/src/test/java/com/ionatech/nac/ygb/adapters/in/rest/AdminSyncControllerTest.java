package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.mapper.AdminReceiptStatusRestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.security.JwtAuthenticationFilter;
import com.ionatech.nac.ygb.adapters.in.rest.security.SecurityConfig;
import com.ionatech.nac.ygb.application.ports.api.GetAdminReceiptStatusQuery;
import com.ionatech.nac.ygb.application.ports.spi.TokenProviderPort;
import com.ionatech.nac.ygb.domain.valueobjects.AdminReceiptStatus;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorReceiptStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminSyncController.class)
@AutoConfigureMockMvc
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, AdminReceiptStatusRestMapper.class})
class AdminSyncControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GetAdminReceiptStatusQuery getAdminReceiptStatusQuery;

    @MockBean
    private TokenProviderPort tokenProviderPort;

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldReturnReceiptStatusForAdmin() throws Exception {
        UUID collectorId = UUID.randomUUID();
        when(getAdminReceiptStatusQuery.getReceiptStatus()).thenReturn(new AdminReceiptStatus(
                4L,
                1L,
                1L,
                List.of(new CollectorReceiptStatus(
                        collectorId,
                        "Collector One",
                        4L,
                        1L,
                        1L,
                        LocalDateTime.of(2026, 3, 15, 10, 0),
                        false
                ))
        ));

        mockMvc.perform(get("/api/v1/admin/sync/receipt-status"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalSynced").value(4))
                .andExpect(jsonPath("$.totalFlagged").value(1))
                .andExpect(jsonPath("$.totalDuplicate").value(1))
                .andExpect(jsonPath("$.byCollector[0].collectorId").value(collectorId.toString()))
                .andExpect(jsonPath("$.byCollector[0].fullName").value("Collector One"))
                .andExpect(jsonPath("$.byCollector[0].stale").value(false));

        verify(getAdminReceiptStatusQuery).getReceiptStatus();
    }

    @Test
    @WithMockUser(roles = "DATA_COLLECTOR")
    void shouldRejectReceiptStatusForNonAdmin() throws Exception {
        mockMvc.perform(get("/api/v1/admin/sync/receipt-status"))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldRejectUnauthenticatedReceiptStatusRequest() throws Exception {
        mockMvc.perform(get("/api/v1/admin/sync/receipt-status"))
                .andExpect(status().isForbidden());
    }
}
