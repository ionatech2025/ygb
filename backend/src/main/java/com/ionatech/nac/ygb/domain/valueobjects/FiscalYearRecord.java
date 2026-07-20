package com.ionatech.nac.ygb.domain.valueobjects;

public record FiscalYearRecord(
        String fiscalYearLabel,
        long expectedFunds,
        long actualFunds,
        int totalBeneficiaryCount,
        int youngPeopleCount,
        int youngWomenCount,
        int totalParishesCount,
        int fundedParishesCount
) {
    public FiscalYearRecord {
        if (fiscalYearLabel == null || fiscalYearLabel.trim().isEmpty()) {
            throw new IllegalArgumentException("Fiscal year label cannot be null or blank");
        }
        if (expectedFunds < 0 || actualFunds < 0 || totalBeneficiaryCount < 0 
                || youngPeopleCount < 0 || youngWomenCount < 0 
                || totalParishesCount < 0 || fundedParishesCount < 0) {
            throw new IllegalArgumentException("Funds and counts cannot be negative");
        }
    }
}
