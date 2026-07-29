package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.ActiveFiscalYearSetting;

public interface SetActiveFiscalYearUseCase {
    ActiveFiscalYearSetting setActiveFiscalYear(SetActiveFiscalYearCommand command);
}
