package com.ionatech.nac.ygb.domain.service;

import com.ionatech.nac.ygb.domain.valueobjects.FinancialYearPeriod;

import java.time.LocalDateTime;

public final class FinancialYearPeriodCalculator {

    public FinancialYearPeriod fromDateTime(LocalDateTime dateTime) {
        return FinancialYearPeriod.from(dateTime);
    }
}
