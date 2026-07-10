package com.ionatech.nac.ygb.adapters.in.dto;

import jakarta.validation.constraints.NotBlank;

public record AuthRequest(
        @NotBlank(message = "Phone number is required") String phoneNumber,
        @NotBlank(message = "Password is required") String password
) {
}
