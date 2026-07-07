package com.ionatech.nac.ygb.adapters.in.rest.mapper;

import com.ionatech.nac.ygb.adapters.in.rest.dto.CreateUserRequest;
import com.ionatech.nac.ygb.adapters.in.rest.dto.UserResponse;
import com.ionatech.nac.ygb.application.ports.api.CreateDataCollectorCommand;
import com.ionatech.nac.ygb.domain.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserRestMapper {

    CreateDataCollectorCommand toCommand(CreateUserRequest request);

    UserResponse toResponse(User user);
}
