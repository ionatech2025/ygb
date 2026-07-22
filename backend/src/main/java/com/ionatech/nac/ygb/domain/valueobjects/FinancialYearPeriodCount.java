package com.ionatech.nac.ygb.domain.valueobjects;

public record FinancialYearPeriodCount(String financialYearPeriod, long count) {
    public FinancialYearPeriodCount {
        if (financialYearPeriod == null) {
            throw new IllegalArgumentException("FinancialYearPeriodCount financialYearPeriod must not be null.");
        }
        if (count < 0) {
            throw new IllegalArgumentException("FinancialYearPeriodCount count must not be negative.");
        }
    }
}
