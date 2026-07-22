package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.time.LocalDate;

public record TimeSeriesPointDto(LocalDate bucketStart, long count) {}
