package com.ionatech.nac.ygb.adapters.in.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ionatech.nac.ygb.adapters.in.dto.AuthRequest;
import com.ionatech.nac.ygb.adapters.in.mappers.AuthMapper;
import com.ionatech.nac.ygb.application.ports.api.AuthenticateUserCommand;
import com.ionatech.nac.ygb.application.ports.api.AuthenticateUserUseCase;
import com.ionatech.nac.ygb.application.ports.api.AuthenticationResult;
import com.ionatech.nac.ygb.domain.exceptions.InvalidCredentialsException;
import com.ionatech.nac.ygb.application.ports.spi.TokenProviderPort;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false) // Bypass security filters for this unit test
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthenticateUserUseCase authenticateUserUseCase;

    @MockBean
    private AuthMapper authMapper;

    @MockBean
    private TokenProviderPort tokenProviderPort;

    @Test
    void shouldReturnTokenOnSuccessfulLogin() throws Exception {
        AuthRequest request = new AuthRequest("0770000000", "password");
        AuthenticateUserCommand command = new AuthenticateUserCommand("0770000000", "password");
        
        when(authMapper.toCommand(any(AuthRequest.class))).thenReturn(command);
        when(authenticateUserUseCase.authenticate(command)).thenReturn(new AuthenticationResult("jwt.token.here"));

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt.token.here"));
    }

    @Test
    void shouldReturnUnauthorizedWhenInvalidCredentials() throws Exception {
        AuthRequest request = new AuthRequest("0770000000", "wrongpassword");
        AuthenticateUserCommand command = new AuthenticateUserCommand("0770000000", "wrongpassword");

        when(authMapper.toCommand(any(AuthRequest.class))).thenReturn(command);
        when(authenticateUserUseCase.authenticate(command)).thenThrow(new InvalidCredentialsException("Invalid credentials"));

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
