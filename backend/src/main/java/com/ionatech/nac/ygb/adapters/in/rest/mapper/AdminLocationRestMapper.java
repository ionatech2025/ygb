package com.ionatech.nac.ygb.adapters.in.rest.mapper;

import com.ionatech.nac.ygb.adapters.in.rest.dto.AdminLocationDto;
import com.ionatech.nac.ygb.domain.valueobjects.AdminLocation;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AdminLocationRestMapper {
    AdminLocationDto toDto(AdminLocation domain);
    List<AdminLocationDto> toDtoList(List<AdminLocation> domains);
}
