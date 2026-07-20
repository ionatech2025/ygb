package com.ionatech.nac.ygb.adapters.out.persistence.mapper;

import com.ionatech.nac.ygb.adapters.out.persistence.entity.AdminLocationJpaEntity;
import com.ionatech.nac.ygb.domain.valueobjects.AdminLocation;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AdminLocationMapper {
    AdminLocation toDomain(AdminLocationJpaEntity entity);
    AdminLocationJpaEntity toEntity(AdminLocation domain);
    List<AdminLocation> toDomainList(List<AdminLocationJpaEntity> entities);
}
