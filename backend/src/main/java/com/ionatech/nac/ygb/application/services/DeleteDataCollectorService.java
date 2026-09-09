package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.DeleteDataCollectorUseCase;
import com.ionatech.nac.ygb.application.ports.spi.UserRepositoryPort;
import com.ionatech.nac.ygb.domain.exceptions.InvalidUserOperationException;
import com.ionatech.nac.ygb.domain.exceptions.UserNotFoundException;
import com.ionatech.nac.ygb.domain.model.Role;
import com.ionatech.nac.ygb.domain.model.User;

import java.util.UUID;

public class DeleteDataCollectorService implements DeleteDataCollectorUseCase {

    private final UserRepositoryPort userRepositoryPort;

    public DeleteDataCollectorService(UserRepositoryPort userRepositoryPort) {
        this.userRepositoryPort = userRepositoryPort;
    }

    @Override
    public void delete(UUID userId) {
        User user = userRepositoryPort.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        if (user.getRole() != Role.DATA_COLLECTOR) {
            throw new InvalidUserOperationException("Only data collector accounts can be deleted.");
        }
        userRepositoryPort.deleteById(userId);
    }
}
