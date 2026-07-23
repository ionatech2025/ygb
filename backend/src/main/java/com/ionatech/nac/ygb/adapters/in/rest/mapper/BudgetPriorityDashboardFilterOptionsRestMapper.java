package com.ionatech.nac.ygb.adapters.in.rest.mapper;

import com.ionatech.nac.ygb.adapters.in.rest.dto.BudgetPriorityFilterOptionsResponseDto;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityFilterOptions;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = PublicDashboardFilterOptionsRestMapper.class)
public interface BudgetPriorityDashboardFilterOptionsRestMapper {

    BudgetPriorityFilterOptionsResponseDto toResponse(BudgetPriorityFilterOptions options);
}
