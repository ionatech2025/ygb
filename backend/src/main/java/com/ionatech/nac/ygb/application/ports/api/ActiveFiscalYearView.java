package com.ionatech.nac.ygb.application.ports.api;

import java.util.List;

public record ActiveFiscalYearView(
        String fiscalYearLabel,
        String priorFiscalYearLabel,
        List<String> supportedLabels
) {}
