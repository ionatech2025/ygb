package com.ionatech.nac.ygb.adapters.out.persistence.mapper;

import com.ionatech.nac.ygb.adapters.out.persistence.entity.ActiveFiscalYearSettingJpaEntity;
import com.ionatech.nac.ygb.domain.valueobjects.ActiveFiscalYearSetting;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ActiveFiscalYearSettingMapper {
    ActiveFiscalYearSetting toDomain(ActiveFiscalYearSettingJpaEntity entity);

    ActiveFiscalYearSettingJpaEntity toEntity(ActiveFiscalYearSetting domain);
}
