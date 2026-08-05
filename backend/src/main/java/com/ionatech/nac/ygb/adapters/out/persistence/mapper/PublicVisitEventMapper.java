package com.ionatech.nac.ygb.adapters.out.persistence.mapper;

import com.ionatech.nac.ygb.adapters.out.persistence.entity.PublicVisitEventJpaEntity;
import com.ionatech.nac.ygb.domain.model.PublicVisitEvent;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PublicVisitEventMapper {

    PublicVisitEventJpaEntity toEntity(PublicVisitEvent event);

    default PublicVisitEvent toDomain(PublicVisitEventJpaEntity entity) {
        if (entity == null) {
            return null;
        }
        return PublicVisitEvent.rehydrate(
                entity.getId(),
                entity.getAnonymousSessionId(),
                entity.getRouteGroup(),
                entity.getVisitedAt()
        );
    }
}
