package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.util.UUID;

public record AuthUserResponse(
        UUID id,
        String fullName,
        String phoneNumber,
        String role
) {
}
