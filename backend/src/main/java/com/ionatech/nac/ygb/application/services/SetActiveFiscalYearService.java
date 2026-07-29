package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.SetActiveFiscalYearCommand;
import com.ionatech.nac.ygb.application.ports.api.SetActiveFiscalYearUseCase;
import com.ionatech.nac.ygb.application.ports.spi.ActiveFiscalYearSettingRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.ActiveFiscalYearSetting;

import java.time.Clock;
import java.time.LocalDateTime;

public class SetActiveFiscalYearService implements SetActiveFiscalYearUseCase {

    private final ActiveFiscalYearSettingRepositoryPort repositoryPort;
    private final Clock clock;

    public SetActiveFiscalYearService(
            ActiveFiscalYearSettingRepositoryPort repositoryPort,
            Clock clock
    ) {
        this.repositoryPort = repositoryPort;
        this.clock = clock;
    }

    @Override
    public ActiveFiscalYearSetting setActiveFiscalYear(SetActiveFiscalYearCommand command) {
        ActiveFiscalYearSetting setting = new ActiveFiscalYearSetting(
                command.fiscalYearLabel(),
                LocalDateTime.now(clock),
                command.adminUserId()
        );
        return repositoryPort.save(setting);
    }
}
