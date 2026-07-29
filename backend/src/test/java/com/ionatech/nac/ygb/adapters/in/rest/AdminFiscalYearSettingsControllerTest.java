package com.ionatech.nac.ygb.adapters.in.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ionatech.nac.ygb.adapters.in.rest.dto.SetActiveFiscalYearRequestDto;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.ActiveFiscalYearSettingRestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.security.JwtAuthenticationFilter;
import com.ionatech.nac.ygb.adapters.in.rest.security.SecurityConfig;
import com.ionatech.nac.ygb.application.ports.api.ActiveFiscalYearView;
import com.ionatech.nac.ygb.application.ports.api.GetActiveFiscalYearUseCase;
import com.ionatech.nac.ygb.application.ports.api.SetActiveFiscalYearCommand;
import com.ionatech.nac.ygb.application.ports.api.SetActiveFiscalYearUseCase;
import com.ionatech.nac.ygb.application.ports.spi.TokenProviderPort;
import com.ionatech.nac.ygb.domain.exceptions.InvalidFiscalYearSettingException;
import com.ionatech.nac.ygb.domain.valueobjects.ActiveFiscalYearSetting;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminFiscalYearSettingsController.class)
@AutoConfigureMockMvc
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class AdminFiscalYearSettingsControllerTest {

    private static final UUID ADMIN_ID = UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
    private static final ActiveFiscalYearView ACTIVE_VIEW = new ActiveFiscalYearView(
            "2025/26",
            "2024/25",
            List.of("2025/26", "2022/23", "2023/24", "2024/25", "2026/27", "2027/28", "2028/29", "2029/30")
    );

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private GetActiveFiscalYearUseCase getActiveFiscalYearUseCase;

    @MockBean
    private SetActiveFiscalYearUseCase setActiveFiscalYearUseCase;

    @MockBean
    private ActiveFiscalYearSettingRestMapper restMapper;

    @MockBean
    private TokenProviderPort tokenProviderPort;

    @Test
    @WithMockUser(username = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", roles = "ADMIN")
    void shouldAllowAdminToGetCurrentFiscalYear() throws Exception {
        when(getActiveFiscalYearUseCase.getActiveFiscalYear()).thenReturn(ACTIVE_VIEW);
        when(restMapper.toResponse(ACTIVE_VIEW)).thenReturn(
                new com.ionatech.nac.ygb.adapters.in.rest.dto.ActiveFiscalYearSettingResponseDto(
                        ACTIVE_VIEW.fiscalYearLabel(),
                        ACTIVE_VIEW.priorFiscalYearLabel(),
                        ACTIVE_VIEW.supportedLabels()
                )
        );

        mockMvc.perform(get("/api/v1/admin/settings/fiscal-year"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fiscalYearLabel").value("2025/26"))
                .andExpect(jsonPath("$.priorFiscalYearLabel").value("2024/25"))
                .andExpect(jsonPath("$.supportedLabels[0]").value("2025/26"));
    }

    @Test
    @WithMockUser(username = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", roles = "ADMIN")
    void shouldAllowAdminToSetCurrentFiscalYear() throws Exception {
        when(setActiveFiscalYearUseCase.setActiveFiscalYear(any(SetActiveFiscalYearCommand.class)))
                .thenReturn(new ActiveFiscalYearSetting("2024/25", LocalDateTime.now(), ADMIN_ID));
        when(getActiveFiscalYearUseCase.getActiveFiscalYear()).thenReturn(
                new ActiveFiscalYearView("2024/25", "2023/24", List.of("2024/25", "2022/23", "2023/24", "2025/26"))
        );
        when(restMapper.toResponse(any(ActiveFiscalYearView.class))).thenReturn(
                new com.ionatech.nac.ygb.adapters.in.rest.dto.ActiveFiscalYearSettingResponseDto(
                        "2024/25",
                        "2023/24",
                        List.of("2024/25", "2022/23", "2023/24", "2025/26")
                )
        );

        mockMvc.perform(put("/api/v1/admin/settings/fiscal-year")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new SetActiveFiscalYearRequestDto("2024/25"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fiscalYearLabel").value("2024/25"));

        verify(setActiveFiscalYearUseCase).setActiveFiscalYear(new SetActiveFiscalYearCommand("2024/25", ADMIN_ID));
    }

    @Test
    @WithMockUser(username = "22222222-2222-2222-2222-222222222222", roles = "DATA_COLLECTOR")
    void shouldForbidCollectorFromSettingFiscalYear() throws Exception {
        mockMvc.perform(put("/api/v1/admin/settings/fiscal-year")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new SetActiveFiscalYearRequestDto("2024/25"))))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", roles = "ADMIN")
    void shouldReturnBadRequestForInvalidFiscalYearLabel() throws Exception {
        when(setActiveFiscalYearUseCase.setActiveFiscalYear(any(SetActiveFiscalYearCommand.class)))
                .thenThrow(new InvalidFiscalYearSettingException("Unsupported fiscal year label: 2030/31"));

        mockMvc.perform(put("/api/v1/admin/settings/fiscal-year")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new SetActiveFiscalYearRequestDto("2030/31"))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Unsupported fiscal year label: 2030/31"));
    }
}
