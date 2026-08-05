package com.ionatech.nac.ygb.adapters.out.persistence.mapper;

import com.ionatech.nac.ygb.adapters.out.persistence.entity.DownloadSessionJpaEntity;
import com.ionatech.nac.ygb.domain.model.DownloadSession;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DownloadSessionMapper {

    DownloadSessionJpaEntity toEntity(DownloadSession session);

    default DownloadSession toDomain(DownloadSessionJpaEntity entity) {
        if (entity == null) {
            return null;
        }
        return DownloadSession.rehydrate(
                entity.getId(),
                entity.getProfileId(),
                entity.getToken(),
                entity.getIssuedAt(),
                entity.getExpiresAt()
        );
    }
}
