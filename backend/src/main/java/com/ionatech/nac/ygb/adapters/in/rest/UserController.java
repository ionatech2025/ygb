package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.dto.CreateUserRequest;
import com.ionatech.nac.ygb.adapters.in.rest.dto.UserResponse;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.UserRestMapper;
import com.ionatech.nac.ygb.application.ports.api.CreateDataCollectorUseCase;
import com.ionatech.nac.ygb.application.ports.api.ListActiveDataCollectorsUseCase;
import com.ionatech.nac.ygb.domain.exceptions.UserAlreadyExistsException;
import com.ionatech.nac.ygb.domain.model.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/users")
public class UserController {

    private final CreateDataCollectorUseCase createDataCollectorUseCase;
    private final ListActiveDataCollectorsUseCase listActiveDataCollectorsUseCase;
    private final UserRestMapper userRestMapper;

    public UserController(
            CreateDataCollectorUseCase createDataCollectorUseCase,
            ListActiveDataCollectorsUseCase listActiveDataCollectorsUseCase,
            UserRestMapper userRestMapper
    ) {
        this.createDataCollectorUseCase = createDataCollectorUseCase;
        this.listActiveDataCollectorsUseCase = listActiveDataCollectorsUseCase;
        this.userRestMapper = userRestMapper;
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

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<String> handleUserAlreadyExistsException(UserAlreadyExistsException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }
}
