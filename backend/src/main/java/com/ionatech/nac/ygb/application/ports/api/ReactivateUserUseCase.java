package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.model.User;

import java.util.UUID;

public interface ReactivateUserUseCase {
    User reactivate(UUID userId);
}
