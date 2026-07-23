package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.time.LocalDate;

public record BudgetPriorityChartDataPointDto(String label, LocalDate date, long count) {}
