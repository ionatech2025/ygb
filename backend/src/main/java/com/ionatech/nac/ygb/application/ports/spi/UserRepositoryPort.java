package com.ionatech.nac.ygb.application.ports.spi;

import com.ionatech.nac.ygb.domain.model.User;

import java.util.Optional;
import java.util.UUID;

public interface UserRepositoryPort {
    Optional<User> findByPhoneNumber(String phoneNumber);
    Optional<User> findById(UUID id);
    User save(User user);
}
