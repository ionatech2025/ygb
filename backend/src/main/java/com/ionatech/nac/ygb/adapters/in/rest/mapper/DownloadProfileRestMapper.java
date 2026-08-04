package com.ionatech.nac.ygb.adapters.in.rest.mapper;

import com.ionatech.nac.ygb.adapters.in.rest.dto.DownloadSessionResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.RegisterDownloadProfileRequestDto;
import com.ionatech.nac.ygb.application.ports.api.RegisterDownloadProfileCommand;
import com.ionatech.nac.ygb.application.ports.api.RegisteredDownloadSessionView;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DownloadProfileRestMapper {

    @Mapping(target = "consentGiven", expression = "java(Boolean.TRUE.equals(request.consentGiven()))")
    RegisterDownloadProfileCommand toCommand(RegisterDownloadProfileRequestDto request);

    DownloadSessionResponseDto toResponse(RegisteredDownloadSessionView view);
}
