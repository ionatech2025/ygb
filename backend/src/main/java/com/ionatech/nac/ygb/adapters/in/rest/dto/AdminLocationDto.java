package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.util.UUID;

public record AdminLocationDto(
        UUID id,
        String name,
        UUID parentId,
        String level
) {}
