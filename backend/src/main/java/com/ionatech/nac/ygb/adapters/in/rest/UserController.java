package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.dto.CreateUserRequest;
import com.ionatech.nac.ygb.adapters.in.rest.dto.ResetPasswordRequest;
import com.ionatech.nac.ygb.adapters.in.rest.dto.ResetPasswordResponse;
import com.ionatech.nac.ygb.adapters.in.rest.dto.SubmissionPageResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.UserResponse;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.AdminSubmissionRestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.DashboardFilterRequestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.UserRestMapper;
import com.ionatech.nac.ygb.application.ports.api.CreateDataCollectorUseCase;
import com.ionatech.nac.ygb.application.ports.api.DeactivateUserUseCase;
import com.ionatech.nac.ygb.application.ports.api.GetCollectorSubmissionsQuery;
import com.ionatech.nac.ygb.application.ports.api.ListActiveDataCollectorsUseCase;
import com.ionatech.nac.ygb.application.ports.api.ReactivateUserUseCase;
import com.ionatech.nac.ygb.application.ports.api.ResetUserPasswordCommand;
import com.ionatech.nac.ygb.application.ports.api.ResetUserPasswordUseCase;
import com.ionatech.nac.ygb.domain.exceptions.InvalidDashboardFilterException;
import com.ionatech.nac.ygb.domain.exceptions.InvalidUserOperationException;
import com.ionatech.nac.ygb.domain.exceptions.UserAlreadyExistsException;
import com.ionatech.nac.ygb.domain.exceptions.UserNotFoundException;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.model.User;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionPage;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/users")
public class UserController {

    private final CreateDataCollectorUseCase createDataCollectorUseCase;
    private final ListActiveDataCollectorsUseCase listActiveDataCollectorsUseCase;
    private final DeactivateUserUseCase deactivateUserUseCase;
    private final ReactivateUserUseCase reactivateUserUseCase;
    private final ResetUserPasswordUseCase resetUserPasswordUseCase;
    private final GetCollectorSubmissionsQuery getCollectorSubmissionsQuery;
    private final UserRestMapper userRestMapper;
    private final DashboardFilterRequestMapper filterMapper;
    private final AdminSubmissionRestMapper submissionRestMapper;

    public UserController(
            CreateDataCollectorUseCase createDataCollectorUseCase,
            ListActiveDataCollectorsUseCase listActiveDataCollectorsUseCase,
            DeactivateUserUseCase deactivateUserUseCase,
            ReactivateUserUseCase reactivateUserUseCase,
            ResetUserPasswordUseCase resetUserPasswordUseCase,
            GetCollectorSubmissionsQuery getCollectorSubmissionsQuery,
            UserRestMapper userRestMapper,
            DashboardFilterRequestMapper filterMapper,
            AdminSubmissionRestMapper submissionRestMapper
    ) {
        this.createDataCollectorUseCase = createDataCollectorUseCase;
        this.listActiveDataCollectorsUseCase = listActiveDataCollectorsUseCase;
        this.deactivateUserUseCase = deactivateUserUseCase;
        this.reactivateUserUseCase = reactivateUserUseCase;
        this.resetUserPasswordUseCase = resetUserPasswordUseCase;
        this.getCollectorSubmissionsQuery = getCollectorSubmissionsQuery;
        this.userRestMapper = userRestMapper;
        this.filterMapper = filterMapper;
        this.submissionRestMapper = submissionRestMapper;
    }

    @GetMapping("/data-collectors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> listDataCollectors() {
        List<UserResponse> collectors = listActiveDataCollectorsUseCase.listActiveDataCollectors().stream()
                .map(userRestMapper::toResponse)
                .toList();
        return ResponseEntity.ok(collectors);
    }

    @PostMapping("/data-collectors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> createDataCollector(@Valid @RequestBody CreateUserRequest request) {
        User createdUser = createDataCollectorUseCase.createDataCollector(userRestMapper.toCommand(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(userRestMapper.toResponse(createdUser));
    }

    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> deactivateUser(@PathVariable UUID id) {
        return ResponseEntity.ok(userRestMapper.toResponse(deactivateUserUseCase.deactivate(id)));
    }

    @PatchMapping("/{id}/reactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> reactivateUser(@PathVariable UUID id) {
        return ResponseEntity.ok(userRestMapper.toResponse(reactivateUserUseCase.reactivate(id)));
    }

    @PostMapping("/{id}/reset-password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResetPasswordResponse> resetPassword(
            @PathVariable UUID id,
            @RequestBody(required = false) ResetPasswordRequest request
    ) {
        String password = request != null ? request.password() : null;
        var result = resetUserPasswordUseCase.resetPassword(id, new ResetUserPasswordCommand(password));
        return ResponseEntity.ok(new ResetPasswordResponse(result.temporaryPassword()));
    }

    @GetMapping("/{id}/submissions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SubmissionPageResponseDto> getCollectorSubmissions(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size,
            @RequestParam(required = false) UUID districtId,
            @RequestParam(required = false) UUID subcountyId,
            @RequestParam(required = false) UUID parishId,
            @RequestParam(required = false) FormType formType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String ageGroup,
            @RequestParam(required = false) String financialYearPeriod
    ) {
        DashboardFilter filter = filterMapper.toFilter(
                districtId,
                subcountyId,
                parishId,
                formType,
                dateFrom,
                dateTo,
                gender,
                ageGroup,
                null,
                financialYearPeriod
        );
        SubmissionPage submissionPage = getCollectorSubmissionsQuery.getSubmissions(
                id,
                filter,
                PageRequest.of(page, size)
        );
        return ResponseEntity.ok(submissionRestMapper.toResponse(submissionPage));
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<String> handleUserAlreadyExistsException(UserAlreadyExistsException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUserNotFound(UserNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(InvalidUserOperationException.class)
    public ResponseEntity<Map<String, String>> handleInvalidUserOperation(InvalidUserOperationException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(InvalidDashboardFilterException.class)
    public ResponseEntity<Map<String, String>> handleInvalidDashboardFilter(InvalidDashboardFilterException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
    }
}
