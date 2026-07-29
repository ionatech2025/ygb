package com.ionatech.nac.ygb.domain.valueobjects;

import com.ionatech.nac.ygb.domain.exceptions.InvalidFiscalYearSettingException;

import java.time.LocalDateTime;
import java.util.UUID;

public record ActiveFiscalYearSetting(
        String fiscalYearLabel,
        LocalDateTime effectiveFrom,
        UUID setByUserId
) {
    public ActiveFiscalYearSetting {
        if (fiscalYearLabel == null || fiscalYearLabel.isBlank()) {
            throw new IllegalArgumentException("Fiscal year label is required.");
        }
        fiscalYearLabel = fiscalYearLabel.trim();
        if (!LgoFiscalYearCatalog.isSupported(fiscalYearLabel)) {
            throw new InvalidFiscalYearSettingException("Unsupported fiscal year label: " + fiscalYearLabel);
        }
        if (effectiveFrom == null) {
            throw new IllegalArgumentException("Effective from timestamp is required.");
        }
    }
}
