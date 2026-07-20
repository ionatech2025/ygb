package com.ionatech.nac.ygb.adapters.in.rest.mapper;

import com.ionatech.nac.ygb.adapters.in.rest.dto.CreateUserRequest;
import com.ionatech.nac.ygb.adapters.in.rest.dto.UserResponse;
import com.ionatech.nac.ygb.application.ports.api.CreateDataCollectorCommand;
import com.ionatech.nac.ygb.domain.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserRestMapper {

    CreateDataCollectorCommand toCommand(CreateUserRequest request);

    @Mapping(target = "isActive", source = "active")
    UserResponse toResponse(User user);
}
