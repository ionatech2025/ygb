package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.dto.FilterLocationOptionDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.PublicDashboardFilterOptionsResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.PublicDashboardFilterOptionsRestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.security.JwtAuthenticationFilter;
import com.ionatech.nac.ygb.adapters.in.rest.security.SecurityConfig;
import com.ionatech.nac.ygb.application.ports.api.GetPublicDashboardFilterOptionsQuery;
import com.ionatech.nac.ygb.application.ports.spi.TokenProviderPort;
import com.ionatech.nac.ygb.domain.service.AnonymisationProjector;
import com.ionatech.nac.ygb.domain.valueobjects.FilterLocationOption;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDashboardFilterOptions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PublicDashboardController.class)
@AutoConfigureMockMvc
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, AnonymisationProjector.class})
class PublicDashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GetPublicDashboardFilterOptionsQuery getPublicDashboardFilterOptionsQuery;

    @MockBean
    private PublicDashboardFilterOptionsRestMapper filterOptionsRestMapper;

    @MockBean
    private TokenProviderPort tokenProviderPort;

    @Test
    void shouldReturnFilterOptionsWithoutAuthentication() throws Exception {
        stubFilterOptions();

        performFilterOptionsRequest()
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.districts[0].name").value("Kampala"))
                .andExpect(jsonPath("$.formTypes[0]").value("BYP"))
                .andExpect(jsonPath("$.programmeAreas").isArray());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldReturnFilterOptionsForAuthenticatedAdmin() throws Exception {
        stubFilterOptions();

        performFilterOptionsRequest()
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.genders[0]").value("FEMALE"));
    }

    @Test
    void responseShouldNotContainPiiOrCollectorFields() throws Exception {
        stubFilterOptions();

        performFilterOptionsRequest()
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.collectors").doesNotExist())
                .andExpect(jsonPath("$.phone").doesNotExist())
                .andExpect(jsonPath("$.collectorName").doesNotExist())
                .andExpect(jsonPath("$.respondentName").doesNotExist());
    }

    private ResultActions performFilterOptionsRequest() throws Exception {
        return mockMvc.perform(get("/api/v1/public/dashboard/filters/options")
                .accept(MediaType.APPLICATION_JSON));
    }

    private void stubFilterOptions() {
        UUID districtId = UUID.randomUUID();
        PublicDashboardFilterOptions options = new PublicDashboardFilterOptions(
                List.of(new FilterLocationOption(districtId, "Kampala")),
                List.of(),
                List.of(),
                List.of("BYP", "IYP"),
                List.of("FEMALE"),
                List.of("AGE_20_24"),
                List.of("JAN_JUN_2026"),
                List.of()
        );
        PublicDashboardFilterOptionsResponseDto responseDto = new PublicDashboardFilterOptionsResponseDto(
                List.of(new FilterLocationOptionDto(districtId, "Kampala")),
                List.of(),
                List.of(),
                List.of("BYP", "IYP"),
                List.of("FEMALE"),
                List.of("AGE_20_24"),
                List.of("JAN_JUN_2026"),
                List.of()
        );

        when(getPublicDashboardFilterOptionsQuery.getOptions(isNull(), isNull())).thenReturn(options);
        when(filterOptionsRestMapper.toResponse(options)).thenReturn(responseDto);
    }
}
