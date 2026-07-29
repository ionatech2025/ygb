package com.ionatech.nac.ygb.domain.valueobjects;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

public record FiscalYearRecord(
        String fiscalYearLabel,
        long expectedFunds,
        long actualFunds,
        int totalBeneficiaryCount,
        @JsonProperty("beneficiariesUnder30Count")
        @JsonAlias("youngPeopleCount")
        int beneficiariesUnder30Count,
        @JsonProperty("beneficiaryYoungWomenCount")
        @JsonAlias("youngWomenCount")
        int beneficiaryYoungWomenCount,
        @JsonProperty("beneficiaryYoungMenCount")
        int beneficiaryYoungMenCount,
        int totalParishesCount,
        int fundedParishesCount
) {
    public FiscalYearRecord {
        if (fiscalYearLabel == null || fiscalYearLabel.trim().isEmpty()) {
            throw new IllegalArgumentException("Fiscal year label cannot be null or blank");
        }
        fiscalYearLabel = fiscalYearLabel.trim();
        if (expectedFunds < 0 || actualFunds < 0 || totalBeneficiaryCount < 0
                || beneficiariesUnder30Count < 0 || beneficiaryYoungWomenCount < 0
                || beneficiaryYoungMenCount < 0
                || totalParishesCount < 0 || fundedParishesCount < 0) {
            throw new IllegalArgumentException("Funds and counts cannot be negative");
        }
    }
}
