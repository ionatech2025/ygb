package com.ionatech.nac.ygb.application.ports.spi;

import com.ionatech.nac.ygb.domain.valueobjects.ActiveFiscalYearSetting;

import java.util.Optional;

public interface ActiveFiscalYearSettingRepositoryPort {
    Optional<ActiveFiscalYearSetting> findCurrent();

    ActiveFiscalYearSetting save(ActiveFiscalYearSetting setting);
}
