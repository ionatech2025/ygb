package com.ionatech.nac.ygb.application.mappers;

import com.ionatech.nac.ygb.adapters.out.persistence.entity.UserEntity;
import com.ionatech.nac.ygb.domain.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserEntity toEntity(User user);

    @Mapping(target = "isActive", source = "active")
    User toDomain(UserEntity entity);
}
