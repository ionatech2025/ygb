package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.ReactivateUserUseCase;
import com.ionatech.nac.ygb.application.ports.spi.UserRepositoryPort;
import com.ionatech.nac.ygb.domain.exceptions.InvalidUserOperationException;
import com.ionatech.nac.ygb.domain.exceptions.UserNotFoundException;
import com.ionatech.nac.ygb.domain.model.Role;
import com.ionatech.nac.ygb.domain.model.User;

import java.util.UUID;

public class ReactivateUserService implements ReactivateUserUseCase {

    private final UserRepositoryPort userRepositoryPort;

    public ReactivateUserService(UserRepositoryPort userRepositoryPort) {
        this.userRepositoryPort = userRepositoryPort;
    }

    @Override
    public User reactivate(UUID userId) {
        User user = userRepositoryPort.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        if (user.getRole() != Role.DATA_COLLECTOR) {
            throw new InvalidUserOperationException("Only data collector accounts can be reactivated.");
        }
        if (user.isActive()) {
            return user;
        }
        user.activate();
        return userRepositoryPort.save(user);
    }
}
