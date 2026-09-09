package com.ionatech.nac.ygb.domain.valueobjects;

/**
 * Datasets recorded on download-usage events.
 * Hub downloads use the six tool values; {@link #PDM} remains for historical analytics only.
 */
public enum PublicDownloadDataset {
    PDM,
    BYP,
    IYP,
    PC,
    LGO,
    BUDGET_PRIORITIES,
    LGO_BUDGET_ALLOCATION
}
