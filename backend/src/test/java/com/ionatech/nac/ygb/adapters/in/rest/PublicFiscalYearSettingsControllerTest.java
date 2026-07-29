package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.mapper.ActiveFiscalYearSettingRestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.security.JwtAuthenticationFilter;
import com.ionatech.nac.ygb.adapters.in.rest.security.SecurityConfig;
import com.ionatech.nac.ygb.application.ports.api.ActiveFiscalYearView;
import com.ionatech.nac.ygb.application.ports.api.GetActiveFiscalYearUseCase;
import com.ionatech.nac.ygb.application.ports.spi.TokenProviderPort;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PublicFiscalYearSettingsController.class)
@AutoConfigureMockMvc
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class PublicFiscalYearSettingsControllerTest {

    private static final ActiveFiscalYearView ACTIVE_VIEW = new ActiveFiscalYearView(
            "2025/26",
            "2024/25",
            List.of("2025/26", "2022/23", "2023/24", "2024/25", "2026/27", "2027/28", "2028/29", "2029/30")
    );

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GetActiveFiscalYearUseCase getActiveFiscalYearUseCase;

    @MockBean
    private ActiveFiscalYearSettingRestMapper restMapper;

    @MockBean
    private TokenProviderPort tokenProviderPort;

    @Test
    void shouldReturnCurrentFiscalYearWithoutAuthentication() throws Exception {
        when(getActiveFiscalYearUseCase.getActiveFiscalYear()).thenReturn(ACTIVE_VIEW);
        when(restMapper.toResponse(ACTIVE_VIEW)).thenReturn(
                new com.ionatech.nac.ygb.adapters.in.rest.dto.ActiveFiscalYearSettingResponseDto(
                        ACTIVE_VIEW.fiscalYearLabel(),
                        ACTIVE_VIEW.priorFiscalYearLabel(),
                        ACTIVE_VIEW.supportedLabels()
                )
        );

        mockMvc.perform(get("/api/v1/public/settings/fiscal-year").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fiscalYearLabel").value("2025/26"))
                .andExpect(jsonPath("$.priorFiscalYearLabel").value("2024/25"))
                .andExpect(jsonPath("$.supportedLabels[0]").value("2025/26"));
    }
}
