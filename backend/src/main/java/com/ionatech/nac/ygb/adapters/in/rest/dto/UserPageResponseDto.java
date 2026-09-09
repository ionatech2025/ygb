package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.util.List;

public record UserPageResponseDto(
        List<UserResponse> items,
        long totalElements,
        int page,
        int size,
        int totalPages
) {
}
