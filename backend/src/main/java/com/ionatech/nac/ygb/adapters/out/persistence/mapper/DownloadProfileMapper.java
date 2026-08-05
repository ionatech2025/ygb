package com.ionatech.nac.ygb.adapters.out.persistence.mapper;

import com.ionatech.nac.ygb.adapters.out.persistence.entity.DownloadProfileJpaEntity;
import com.ionatech.nac.ygb.domain.model.DownloadProfile;
import com.ionatech.nac.ygb.domain.valueobjects.AgeGroup;
import com.ionatech.nac.ygb.domain.valueobjects.EmailAddress;
import com.ionatech.nac.ygb.domain.valueobjects.FieldOfOperation;
import com.ionatech.nac.ygb.domain.valueobjects.Gender;
import com.ionatech.nac.ygb.domain.valueobjects.IsoCountryCode;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DownloadProfileMapper {

    @Mapping(target = "email", expression = "java(profile.getEmail().getValue())")
    @Mapping(target = "countryCode", expression = "java(profile.getCountryCode().getValue())")
    @Mapping(target = "gender", expression = "java(profile.getGender().name())")
    @Mapping(target = "ageGroup", expression = "java(profile.getAgeGroup().name())")
    @Mapping(target = "fieldOfOperation", expression = "java(profile.getFieldOfOperation().name())")
    DownloadProfileJpaEntity toEntity(DownloadProfile profile);

    default DownloadProfile toDomain(DownloadProfileJpaEntity entity) {
        if (entity == null) {
            return null;
        }
        return DownloadProfile.rehydrate(
                entity.getId(),
                EmailAddress.of(entity.getEmail()),
                entity.getOptionalName(),
                IsoCountryCode.of(entity.getCountryCode()),
                Gender.valueOf(entity.getGender()),
                AgeGroup.valueOf(entity.getAgeGroup()),
                FieldOfOperation.valueOf(entity.getFieldOfOperation()),
                entity.getFieldOfOperationSpecify(),
                entity.isConsentGiven(),
                entity.getCreatedAt()
        );
    }
}
