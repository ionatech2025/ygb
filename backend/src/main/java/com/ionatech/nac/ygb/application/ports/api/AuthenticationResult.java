package com.ionatech.nac.ygb.application.ports.api;

import java.util.UUID;

public record AuthenticationResult(
    String token,
    UUID userId,
    String name,
    String phoneNumber,
    String role
) {
}
