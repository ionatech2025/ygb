package com.ionatech.nac.ygb.adapters.in.rest.mapper;

import com.ionatech.nac.ygb.adapters.in.rest.dto.AuthRequest;
import com.ionatech.nac.ygb.adapters.in.rest.dto.AuthResponse;
import com.ionatech.nac.ygb.adapters.in.rest.dto.AuthUserResponse;
import com.ionatech.nac.ygb.application.ports.api.AuthenticateUserCommand;
import com.ionatech.nac.ygb.application.ports.api.AuthenticatedUserProfile;
import com.ionatech.nac.ygb.application.ports.api.AuthenticationResult;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface AuthMapper {
    AuthMapper INSTANCE = Mappers.getMapper(AuthMapper.class);

    AuthenticateUserCommand toCommand(AuthRequest request);

    @Mapping(target = "role", expression = "java(profile.role().name())")
    AuthUserResponse toUserResponse(AuthenticatedUserProfile profile);

    default AuthResponse toResponse(AuthenticationResult result) {
        return new AuthResponse(result.token(), toUserResponse(result.user()));
    }
}
