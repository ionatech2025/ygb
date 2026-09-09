package com.ionatech.nac.ygb.domain.valueobjects;

/**
 * Field-data download hub datasets (one file per tool).
 * Distinct from historical analytics-only {@link PublicDownloadDataset#PDM}.
 */
public enum ToolDownloadDataset {
    BYP,
    IYP,
    PC,
    LGO,
    BUDGET_PRIORITIES,
    LGO_BUDGET_ALLOCATION
}
