package com.ionatech.nac.ygb.adapters.in.rest.mapper;

import com.ionatech.nac.ygb.adapters.in.rest.dto.ActiveFiscalYearSettingResponseDto;
import com.ionatech.nac.ygb.application.ports.api.ActiveFiscalYearView;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ActiveFiscalYearSettingRestMapper {
    ActiveFiscalYearSettingResponseDto toResponse(ActiveFiscalYearView view);
}
