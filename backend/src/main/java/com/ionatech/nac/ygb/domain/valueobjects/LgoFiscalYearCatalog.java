package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.List;

public final class LgoFiscalYearCatalog {

    public static final List<String> SUPPORTED_LABELS = List.of(
            "2022/23",
            "2023/24",
            "2024/25",
            "2025/26",
            "2026/27",
            "2027/28",
            "2028/29",
            "2029/30"
    );

    private LgoFiscalYearCatalog() {}
}
