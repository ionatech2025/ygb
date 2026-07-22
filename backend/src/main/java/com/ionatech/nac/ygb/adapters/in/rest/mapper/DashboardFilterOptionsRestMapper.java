package com.ionatech.nac.ygb.adapters.in.rest.mapper;

import com.ionatech.nac.ygb.adapters.in.rest.dto.*;
import com.ionatech.nac.ygb.domain.valueobjects.*;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DashboardFilterOptionsRestMapper {
    DashboardFilterOptionsResponseDto toResponse(DashboardFilterOptions options);

    FilterLocationOptionDto toDto(FilterLocationOption option);

    FilterCollectorOptionDto toDto(FilterCollectorOption option);
}
