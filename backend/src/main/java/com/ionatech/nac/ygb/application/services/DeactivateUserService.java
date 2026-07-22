package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.DeactivateUserUseCase;
import com.ionatech.nac.ygb.application.ports.spi.UserRepositoryPort;
import com.ionatech.nac.ygb.domain.exceptions.InvalidUserOperationException;
import com.ionatech.nac.ygb.domain.exceptions.UserNotFoundException;
import com.ionatech.nac.ygb.domain.model.Role;
import com.ionatech.nac.ygb.domain.model.User;

import java.util.UUID;

public class DeactivateUserService implements DeactivateUserUseCase {

    private final UserRepositoryPort userRepositoryPort;

    public DeactivateUserService(UserRepositoryPort userRepositoryPort) {
        this.userRepositoryPort = userRepositoryPort;
    }

    @Override
    public User deactivate(UUID userId) {
        User user = userRepositoryPort.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        if (user.getRole() != Role.DATA_COLLECTOR) {
            throw new InvalidUserOperationException("Only data collector accounts can be deactivated.");
        }
        if (!user.isActive()) {
            return user;
        }
        user.deactivate();
        return userRepositoryPort.save(user);
    }
}
