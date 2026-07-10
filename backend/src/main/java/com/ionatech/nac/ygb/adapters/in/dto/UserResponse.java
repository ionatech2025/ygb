package com.ionatech.nac.ygb.adapters.in.dto;

import java.util.UUID;

public record UserResponse(
        UUID id,
        String name,
        String phoneNumber,
        String role,
        boolean isActive
) {
}
