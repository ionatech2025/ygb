package com.ionatech.nac.ygb.adapters.out.export;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public final class LgoBudgetAllocationExportFilenameBuilder {

    private static final DateTimeFormatter TIMESTAMP = DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss");

    private LgoBudgetAllocationExportFilenameBuilder() {
    }

    public static String build() {
        return "ygb-lgo-budget-allocation-" + TIMESTAMP.format(LocalDateTime.now()) + ".csv";
    }
}
