package com.ionatech.nac.ygb.adapters.in.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ionatech.nac.ygb.adapters.in.rest.dto.AuthRequest;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.AuthMapperImpl;
import com.ionatech.nac.ygb.application.ports.api.AuthenticateUserCommand;
import com.ionatech.nac.ygb.application.ports.api.AuthenticateUserUseCase;
import com.ionatech.nac.ygb.application.ports.api.AuthenticatedUserProfile;
import com.ionatech.nac.ygb.application.ports.api.AuthenticationResult;
import com.ionatech.nac.ygb.application.ports.spi.TokenProviderPort;
import com.ionatech.nac.ygb.domain.exceptions.InvalidCredentialsException;
import com.ionatech.nac.ygb.domain.model.Role;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(AuthMapperImpl.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthenticateUserUseCase authenticateUserUseCase;

    @MockBean
    private TokenProviderPort tokenProviderPort;

    @Test
    void shouldReturnTokenAndUserProfileOnSuccessfulLogin() throws Exception {
        UUID userId = UUID.fromString("22222222-2222-2222-2222-222222222222");
        AuthRequest request = new AuthRequest("0771111111", "password");
        AuthenticationResult result = new AuthenticationResult(
                "jwt.token.here",
                new AuthenticatedUserProfile(userId, "Default Collector", "0771111111", Role.DATA_COLLECTOR)
        );

        when(authenticateUserUseCase.authenticate(any(AuthenticateUserCommand.class))).thenReturn(result);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt.token.here"))
                .andExpect(jsonPath("$.user.id").value(userId.toString()))
                .andExpect(jsonPath("$.user.fullName").value("Default Collector"))
                .andExpect(jsonPath("$.user.phoneNumber").value("0771111111"))
                .andExpect(jsonPath("$.user.role").value("DATA_COLLECTOR"));
    }

    @Test
    void shouldReturnUnauthorizedWhenInvalidCredentials() throws Exception {
        AuthRequest request = new AuthRequest("0770000000", "wrongpassword");
        AuthenticateUserCommand command = new AuthenticateUserCommand("0770000000", "wrongpassword");

        when(authenticateUserUseCase.authenticate(any(AuthenticateUserCommand.class)))
                .thenThrow(new InvalidCredentialsException("Invalid credentials"));

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid credentials"));
    }

    @Test
    void shouldReturnBadRequestWhenMissingFields() throws Exception {
        AuthRequest request = new AuthRequest("", "");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
