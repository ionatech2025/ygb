package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.util.List;

public record BudgetPrioritySummaryResponseDto(
        long totalSubmissions,
        List<BudgetPrioritySectionCountDto> bySection,
        List<BudgetPriorityAreaCountDto> topPriorityAreas
) {}
