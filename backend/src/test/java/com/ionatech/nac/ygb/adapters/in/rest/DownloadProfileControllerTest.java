package com.ionatech.nac.ygb.adapters.in.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ionatech.nac.ygb.adapters.in.rest.dto.RegisterDownloadProfileRequestDto;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.DownloadProfileRestMapperImpl;
import com.ionatech.nac.ygb.adapters.in.rest.security.JwtAuthenticationFilter;
import com.ionatech.nac.ygb.adapters.in.rest.security.SecurityConfig;
import com.ionatech.nac.ygb.application.ports.api.RegisterDownloadProfileCommand;
import com.ionatech.nac.ygb.application.ports.api.RegisterDownloadProfileUseCase;
import com.ionatech.nac.ygb.application.ports.api.RegisteredDownloadSessionView;
import com.ionatech.nac.ygb.application.ports.spi.TokenProviderPort;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DownloadProfileController.class)
@AutoConfigureMockMvc
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, DownloadProfileRestMapperImpl.class})
class DownloadProfileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private RegisterDownloadProfileUseCase registerDownloadProfileUseCase;

    @MockBean
    private TokenProviderPort tokenProviderPort;

    @Test
    void shouldRegisterWithoutAuthorizationHeader() throws Exception {
        UUID profileId = UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
        when(registerDownloadProfileUseCase.register(any(RegisterDownloadProfileCommand.class)))
                .thenReturn(new RegisteredDownloadSessionView(
                        profileId,
                        "opaque-download-token",
                        LocalDateTime.parse("2026-08-04T13:00:00")
                ));

        mockMvc.perform(post("/api/v1/public/download-profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.profileId").value(profileId.toString()))
                .andExpect(jsonPath("$.token").value("opaque-download-token"))
                .andExpect(jsonPath("$.expiresAt").value("2026-08-04T13:00:00"));
    }

    @Test
    void shouldReturnBadRequestWhenUseCaseRejectsInvalidEmail() throws Exception {
        when(registerDownloadProfileUseCase.register(any(RegisterDownloadProfileCommand.class)))
                .thenThrow(new IllegalArgumentException("Invalid email address: not-an-email"));

        mockMvc.perform(post("/api/v1/public/download-profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new RegisterDownloadProfileRequestDto(
                                        "not-an-email",
                                        null,
                                        "UG",
                                        "FEMALE",
                                        "AGE_25_29",
                                        "ACADEMIA_RESEARCH",
                                        null,
                                        true
                                )
                        )))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Invalid Download Profile"))
                .andExpect(jsonPath("$.detail").value(org.hamcrest.Matchers.containsString("Invalid email")));
    }

    private RegisterDownloadProfileRequestDto validRequest() {
        return new RegisterDownloadProfileRequestDto(
                "analyst@example.com",
                "Ada Lovelace",
                "UG",
                "FEMALE",
                "AGE_25_29",
                "ACADEMIA_RESEARCH",
                null,
                true
        );
    }
}
