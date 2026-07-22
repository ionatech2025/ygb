package com.ionatech.nac.ygb.adapters.in.rest.mapper;

import com.ionatech.nac.ygb.adapters.in.rest.dto.FilterLocationOptionDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.PublicDashboardFilterOptionsResponseDto;
import com.ionatech.nac.ygb.domain.valueobjects.FilterLocationOption;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDashboardFilterOptions;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PublicDashboardFilterOptionsRestMapper {
    PublicDashboardFilterOptionsResponseDto toResponse(PublicDashboardFilterOptions options);

    FilterLocationOptionDto toDto(FilterLocationOption option);
}
