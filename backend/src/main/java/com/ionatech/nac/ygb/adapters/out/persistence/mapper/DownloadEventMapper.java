package com.ionatech.nac.ygb.adapters.out.persistence.mapper;

import com.ionatech.nac.ygb.adapters.out.persistence.entity.DownloadEventJpaEntity;
import com.ionatech.nac.ygb.domain.model.DownloadEvent;
import com.ionatech.nac.ygb.domain.valueobjects.ExportFormat;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDownloadDataset;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DownloadEventMapper {

    @Mapping(target = "dataset", expression = "java(event.getDataset().name())")
    @Mapping(target = "format", expression = "java(event.getFormat().name())")
    DownloadEventJpaEntity toEntity(DownloadEvent event);

    default DownloadEvent toDomain(DownloadEventJpaEntity entity) {
        if (entity == null) {
            return null;
        }
        return DownloadEvent.rehydrate(
                entity.getId(),
                entity.getProfileId(),
                entity.getSessionId(),
                PublicDownloadDataset.valueOf(entity.getDataset()),
                ExportFormat.valueOf(entity.getFormat()),
                entity.getDownloadedAt(),
                entity.getFilterFingerprint()
        );
    }
}
