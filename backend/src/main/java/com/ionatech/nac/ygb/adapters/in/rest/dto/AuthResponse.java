package com.ionatech.nac.ygb.adapters.in.rest.dto;

public record AuthResponse(
    String token,
    String id,
    String fullName,
    String phoneNumber,
    String role
) {
}
