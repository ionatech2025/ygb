package com.ionatech.nac.ygb.domain.valueobjects;

import java.time.LocalDateTime;

public class FinancialYearPeriod {
    private final String period;
    private final int year;

    private FinancialYearPeriod(String period, int year) {
        this.period = period;
        this.year = year;
    }

    public static FinancialYearPeriod from(LocalDateTime dateTime) {
        if (dateTime == null) {
            throw new IllegalArgumentException("Completed timestamp cannot be null");
        }
        int month = dateTime.getMonthValue();
        int year = dateTime.getYear();
        String period = (month >= 1 && month <= 6) ? "JAN_JUN" : "JUL_DEC";
        return new FinancialYearPeriod(period, year);
    }

    public String getPeriod() {
        return period;
    }

    public int getYear() {
        return year;
    }

    @Override
    public String toString() {
        return period + "_" + year;
    }
}
