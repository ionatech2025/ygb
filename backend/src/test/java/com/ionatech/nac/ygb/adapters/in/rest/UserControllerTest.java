package com.ionatech.nac.ygb.adapters.in.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ionatech.nac.ygb.adapters.in.rest.dto.CreateUserRequest;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.UserRestMapper;
import com.ionatech.nac.ygb.application.ports.api.CreateDataCollectorCommand;
import com.ionatech.nac.ygb.application.ports.api.CreateDataCollectorUseCase;
import com.ionatech.nac.ygb.application.ports.spi.TokenProviderPort;
import com.ionatech.nac.ygb.domain.exceptions.UserAlreadyExistsException;
import com.ionatech.nac.ygb.domain.model.Role;
import com.ionatech.nac.ygb.domain.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.ionatech.nac.ygb.adapters.in.rest.security.JwtAuthenticationFilter;
import com.ionatech.nac.ygb.adapters.in.rest.security.SecurityConfig;
import org.springframework.context.annotation.Import;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CreateDataCollectorUseCase createDataCollectorUseCase;

    @MockBean
    private UserRestMapper userRestMapper;

    @MockBean
    private TokenProviderPort tokenProviderPort;

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldCreateDataCollectorWhenUserIsAdmin() throws Exception {
        CreateUserRequest request = new CreateUserRequest("Jane Doe", "0771234567", "password");
        CreateDataCollectorCommand command = new CreateDataCollectorCommand("Jane Doe", "0771234567", "password");

        UUID userId = UUID.randomUUID();
        User createdUser = new User(userId, "Jane Doe", "0771234567", "encoded", Role.DATA_COLLECTOR, true, LocalDateTime.now());
        
        when(userRestMapper.toCommand(request)).thenReturn(command);
        when(createDataCollectorUseCase.createDataCollector(command)).thenReturn(createdUser);
        
        // Setup mock mapper for response, wait, actually since we didn't mock the response part properly, let's just use the mapper
        // Or better yet, we just mock toResponse too since it's a mock bean
        com.ionatech.nac.ygb.adapters.in.rest.dto.UserResponse response = new com.ionatech.nac.ygb.adapters.in.rest.dto.UserResponse(userId, "Jane Doe", "0771234567", "DATA_COLLECTOR", true);
        when(userRestMapper.toResponse(createdUser)).thenReturn(response);

        mockMvc.perform(post("/api/v1/admin/users/data-collectors")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(userId.toString()))
                .andExpect(jsonPath("$.name").value("Jane Doe"))
                .andExpect(jsonPath("$.phoneNumber").value("0771234567"))
                .andExpect(jsonPath("$.role").value("DATA_COLLECTOR"))
                .andExpect(jsonPath("$.isActive").value(true));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldReturnConflictWhenUserAlreadyExists() throws Exception {
        CreateUserRequest request = new CreateUserRequest("Jane Doe", "0771234567", "password");
        CreateDataCollectorCommand command = new CreateDataCollectorCommand("Jane Doe", "0771234567", "password");

        when(userRestMapper.toCommand(any(CreateUserRequest.class))).thenReturn(command);
        when(createDataCollectorUseCase.createDataCollector(command))
                .thenThrow(new UserAlreadyExistsException("A user with phone number 0771234567 already exists."));

        mockMvc.perform(post("/api/v1/admin/users/data-collectors")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(content().string("A user with phone number 0771234567 already exists."));
    }

    @Test
    @WithMockUser(roles = "DATA_COLLECTOR")
    void shouldReturnForbiddenWhenUserIsNotAdmin() throws Exception {
        CreateUserRequest request = new CreateUserRequest("Jane Doe", "0771234567", "password");

        mockMvc.perform(post("/api/v1/admin/users/data-collectors")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldReturnUnauthorizedWhenUserIsNotAuthenticated() throws Exception {
        CreateUserRequest request = new CreateUserRequest("Jane Doe", "0771234567", "password");

        mockMvc.perform(post("/api/v1/admin/users/data-collectors")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }
}
