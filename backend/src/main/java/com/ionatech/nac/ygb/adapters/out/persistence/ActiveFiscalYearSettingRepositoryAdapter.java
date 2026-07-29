package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.persistence.entity.ActiveFiscalYearSettingJpaEntity;
import com.ionatech.nac.ygb.adapters.out.persistence.mapper.ActiveFiscalYearSettingMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.ActiveFiscalYearSettingJpaRepository;
import com.ionatech.nac.ygb.application.ports.spi.ActiveFiscalYearSettingRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.ActiveFiscalYearSetting;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class ActiveFiscalYearSettingRepositoryAdapter implements ActiveFiscalYearSettingRepositoryPort {

    private final ActiveFiscalYearSettingJpaRepository jpaRepository;
    private final ActiveFiscalYearSettingMapper mapper;

    public ActiveFiscalYearSettingRepositoryAdapter(
            ActiveFiscalYearSettingJpaRepository jpaRepository,
            ActiveFiscalYearSettingMapper mapper
    ) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Optional<ActiveFiscalYearSetting> findCurrent() {
        return jpaRepository.findById(ActiveFiscalYearSettingJpaEntity.SINGLETON_ID)
                .map(mapper::toDomain);
    }

    @Override
    public ActiveFiscalYearSetting save(ActiveFiscalYearSetting setting) {
        ActiveFiscalYearSettingJpaEntity entity = jpaRepository
                .findById(ActiveFiscalYearSettingJpaEntity.SINGLETON_ID)
                .orElseGet(() -> new ActiveFiscalYearSettingJpaEntity(
                        setting.fiscalYearLabel(),
                        setting.effectiveFrom(),
                        setting.setByUserId()
                ));

        entity.setFiscalYearLabel(setting.fiscalYearLabel());
        entity.setEffectiveFrom(setting.effectiveFrom());
        entity.setSetByUserId(setting.setByUserId());

        return mapper.toDomain(jpaRepository.save(entity));
    }
}
