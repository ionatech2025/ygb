package com.ionatech.nac.ygb.adapters.in.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ionatech.nac.ygb.adapters.in.rest.dto.CreateUserRequest;
import com.ionatech.nac.ygb.adapters.in.rest.dto.ResetPasswordRequest;
import com.ionatech.nac.ygb.adapters.in.rest.dto.ResetPasswordResponse;
import com.ionatech.nac.ygb.adapters.in.rest.dto.SubmissionPageResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.AdminSubmissionRestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.DashboardFilterRequestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.UserRestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.security.JwtAuthenticationFilter;
import com.ionatech.nac.ygb.adapters.in.rest.security.SecurityConfig;
import com.ionatech.nac.ygb.application.ports.api.CreateDataCollectorCommand;
import com.ionatech.nac.ygb.application.ports.api.CreateDataCollectorUseCase;
import com.ionatech.nac.ygb.application.ports.api.DeactivateUserUseCase;
import com.ionatech.nac.ygb.application.ports.api.GetCollectorSubmissionsQuery;
import com.ionatech.nac.ygb.application.ports.api.ListActiveDataCollectorsUseCase;
import com.ionatech.nac.ygb.application.ports.api.ReactivateUserUseCase;
import com.ionatech.nac.ygb.application.ports.api.ResetPasswordResult;
import com.ionatech.nac.ygb.application.ports.api.ResetUserPasswordCommand;
import com.ionatech.nac.ygb.application.ports.api.ResetUserPasswordUseCase;
import com.ionatech.nac.ygb.application.ports.spi.TokenProviderPort;
import com.ionatech.nac.ygb.domain.exceptions.UserAlreadyExistsException;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.model.Role;
import com.ionatech.nac.ygb.domain.model.User;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionPage;
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
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, DashboardFilterRequestMapper.class})
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CreateDataCollectorUseCase createDataCollectorUseCase;

    @MockBean
    private ListActiveDataCollectorsUseCase listActiveDataCollectorsUseCase;

    @MockBean
    private DeactivateUserUseCase deactivateUserUseCase;

    @MockBean
    private ReactivateUserUseCase reactivateUserUseCase;

    @MockBean
    private ResetUserPasswordUseCase resetUserPasswordUseCase;

    @MockBean
    private GetCollectorSubmissionsQuery getCollectorSubmissionsQuery;

    @MockBean
    private UserRestMapper userRestMapper;

    @MockBean
    private AdminSubmissionRestMapper submissionRestMapper;

    @MockBean
    private TokenProviderPort tokenProviderPort;

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldListActiveDataCollectorsWhenUserIsAdmin() throws Exception {
        UUID userId = UUID.randomUUID();
        User collector = new User(userId, "Jane Doe", "0771234567", "encoded", Role.DATA_COLLECTOR, true, LocalDateTime.now());
        com.ionatech.nac.ygb.adapters.in.rest.dto.UserResponse response =
                new com.ionatech.nac.ygb.adapters.in.rest.dto.UserResponse(userId, "Jane Doe", "0771234567", "DATA_COLLECTOR", true);

        when(listActiveDataCollectorsUseCase.listActiveDataCollectors()).thenReturn(List.of(collector));
        when(userRestMapper.toResponse(collector)).thenReturn(response);

        mockMvc.perform(get("/api/v1/admin/users/data-collectors"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(userId.toString()))
                .andExpect(jsonPath("$[0].name").value("Jane Doe"))
                .andExpect(jsonPath("$[0].phoneNumber").value("0771234567"))
                .andExpect(jsonPath("$[0].role").value("DATA_COLLECTOR"))
                .andExpect(jsonPath("$[0].isActive").value(true));
    }

    @Test
    @WithMockUser(roles = "DATA_COLLECTOR")
    void shouldReturnForbiddenWhenListingCollectorsAsNonAdmin() throws Exception {
        mockMvc.perform(get("/api/v1/admin/users/data-collectors"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldCreateDataCollectorWhenUserIsAdmin() throws Exception {
        CreateUserRequest request = new CreateUserRequest("Jane Doe", "0771234567", "password");
        CreateDataCollectorCommand command = new CreateDataCollectorCommand("Jane Doe", "0771234567", "password");

        UUID userId = UUID.randomUUID();
        User createdUser = new User(userId, "Jane Doe", "0771234567", "encoded", Role.DATA_COLLECTOR, true, LocalDateTime.now());

        when(userRestMapper.toCommand(request)).thenReturn(command);
        when(createDataCollectorUseCase.createDataCollector(command)).thenReturn(createdUser);

        com.ionatech.nac.ygb.adapters.in.rest.dto.UserResponse response =
                new com.ionatech.nac.ygb.adapters.in.rest.dto.UserResponse(userId, "Jane Doe", "0771234567", "DATA_COLLECTOR", true);
        when(userRestMapper.toResponse(createdUser)).thenReturn(response);

        mockMvc.perform(post("/api/v1/admin/users/data-collectors")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(userId.toString()));
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
    @WithMockUser(roles = "ADMIN")
    void shouldDeactivateCollector() throws Exception {
        UUID userId = UUID.randomUUID();
        User deactivated = new User(userId, "Jane Doe", "0771234567", "encoded", Role.DATA_COLLECTOR, false, LocalDateTime.now());
        when(deactivateUserUseCase.deactivate(userId)).thenReturn(deactivated);
        when(userRestMapper.toResponse(deactivated)).thenReturn(
                new com.ionatech.nac.ygb.adapters.in.rest.dto.UserResponse(userId, "Jane Doe", "0771234567", "DATA_COLLECTOR", false)
        );

        mockMvc.perform(patch("/api/v1/admin/users/{id}/deactivate", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isActive").value(false));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldReactivateCollector() throws Exception {
        UUID userId = UUID.randomUUID();
        User reactivated = new User(userId, "Jane Doe", "0771234567", "encoded", Role.DATA_COLLECTOR, true, LocalDateTime.now());
        when(reactivateUserUseCase.reactivate(userId)).thenReturn(reactivated);
        when(userRestMapper.toResponse(reactivated)).thenReturn(
                new com.ionatech.nac.ygb.adapters.in.rest.dto.UserResponse(userId, "Jane Doe", "0771234567", "DATA_COLLECTOR", true)
        );

        mockMvc.perform(patch("/api/v1/admin/users/{id}/reactivate", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isActive").value(true));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldResetPasswordAndReturnTemporaryPassword() throws Exception {
        UUID userId = UUID.randomUUID();
        when(resetUserPasswordUseCase.resetPassword(eq(userId), any(ResetUserPasswordCommand.class)))
                .thenReturn(new ResetPasswordResult("TempPass1234"));

        mockMvc.perform(post("/api/v1/admin/users/{id}/reset-password", userId)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ResetPasswordRequest("TempPass1234"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.temporaryPassword").value("TempPass1234"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldReturnCollectorSubmissions() throws Exception {
        UUID userId = UUID.randomUUID();
        SubmissionPage page = new SubmissionPage(List.of(), 0L, 0, 25);
        SubmissionPageResponseDto response = new SubmissionPageResponseDto(List.of(), 0L, 0, 25, 0);

        when(getCollectorSubmissionsQuery.getSubmissions(eq(userId), any(DashboardFilter.class), eq(PageRequest.of(0, 25))))
                .thenReturn(page);
        when(submissionRestMapper.toResponse(page)).thenReturn(response);

        mockMvc.perform(get("/api/v1/admin/users/{id}/submissions", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(0));
    }

    @Test
    @WithMockUser(roles = "DATA_COLLECTOR")
    void shouldReturnForbiddenForLifecycleEndpointsAsNonAdmin() throws Exception {
        UUID userId = UUID.randomUUID();

        mockMvc.perform(patch("/api/v1/admin/users/{id}/deactivate", userId))
                .andExpect(status().isForbidden());
        mockMvc.perform(patch("/api/v1/admin/users/{id}/reactivate", userId))
                .andExpect(status().isForbidden());
        mockMvc.perform(post("/api/v1/admin/users/{id}/reset-password", userId).with(csrf()))
                .andExpect(status().isForbidden());
        mockMvc.perform(get("/api/v1/admin/users/{id}/submissions", userId))
                .andExpect(status().isForbidden());
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
