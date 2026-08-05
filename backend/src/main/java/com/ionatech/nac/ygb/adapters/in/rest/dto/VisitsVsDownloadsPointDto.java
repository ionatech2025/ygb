package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.time.LocalDate;

public record VisitsVsDownloadsPointDto(
        LocalDate bucketStart,
        long visitorCount,
        long downloaderCount
) {
}
