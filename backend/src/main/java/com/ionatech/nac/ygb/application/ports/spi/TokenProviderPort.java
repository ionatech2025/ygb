package com.ionatech.nac.ygb.application.ports.spi;

import com.ionatech.nac.ygb.domain.model.Role;
import java.util.Optional;
import java.util.UUID;

public interface TokenProviderPort {
    String generateToken(UUID userId, Role role);
    Optional<String> validateTokenAndGetUserId(String token);
    Optional<Role> validateTokenAndGetRole(String token);
    boolean isTokenValid(String token);
}
