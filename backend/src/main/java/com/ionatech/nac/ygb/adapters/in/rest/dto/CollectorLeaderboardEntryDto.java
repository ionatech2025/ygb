package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.util.UUID;

public record CollectorLeaderboardEntryDto(UUID collectorId, String fullName, long totalCount) {}
