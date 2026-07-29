package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.ActiveFiscalYearView;
import com.ionatech.nac.ygb.application.ports.api.GetActiveFiscalYearUseCase;
import com.ionatech.nac.ygb.application.ports.spi.ActiveFiscalYearSettingRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.LgoFiscalYearCatalog;

public class GetActiveFiscalYearService implements GetActiveFiscalYearUseCase {

    private final ActiveFiscalYearSettingRepositoryPort repositoryPort;

    public GetActiveFiscalYearService(ActiveFiscalYearSettingRepositoryPort repositoryPort) {
        this.repositoryPort = repositoryPort;
    }

    @Override
    public ActiveFiscalYearView getActiveFiscalYear() {
        String activeLabel = repositoryPort.findCurrent()
                .map(setting -> setting.fiscalYearLabel())
                .orElse(LgoFiscalYearCatalog.DEFAULT_ACTIVE_COLLECTION_LABEL);

        return new ActiveFiscalYearView(
                activeLabel,
                LgoFiscalYearCatalog.priorLabel(activeLabel).orElse(null),
                LgoFiscalYearCatalog.orderedWithCurrentFirst(activeLabel)
        );
    }
}
