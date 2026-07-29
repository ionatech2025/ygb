package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.model.Role;
import java.util.UUID;

public record AuthenticatedUserProfile(
        UUID id,
        String fullName,
        String phoneNumber,
        Role role
) {
}
