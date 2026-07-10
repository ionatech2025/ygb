package com.ionatech.nac.ygb.adapters.in.mappers;

import com.ionatech.nac.ygb.adapters.in.dto.AuthRequest;
import com.ionatech.nac.ygb.application.ports.api.AuthenticateUserCommand;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface AuthMapper {
    AuthMapper INSTANCE = Mappers.getMapper(AuthMapper.class);

    AuthenticateUserCommand toCommand(AuthRequest request);
}
