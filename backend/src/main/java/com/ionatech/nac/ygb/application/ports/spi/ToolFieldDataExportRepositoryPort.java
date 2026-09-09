package com.ionatech.nac.ygb.application.ports.spi;

import com.ionatech.nac.ygb.domain.valueobjects.ToolDownloadDataset;
import com.ionatech.nac.ygb.domain.valueobjects.ToolFieldDataFilter;
import com.ionatech.nac.ygb.domain.valueobjects.ToolFieldDataRecord;

import java.util.List;

/**
 * Loads synced-only field-data rows for a hub dataset.
 * Implementations must apply {@code filter} with AND semantics and exclude non-synced PDM/allocation rows.
 * Budget Priorities have no submission status — all stored BP rows are treated as downloadable.
 */
public interface ToolFieldDataExportRepositoryPort {

    List<ToolFieldDataRecord> findSyncedByDatasetAndFilter(
            ToolDownloadDataset dataset,
            ToolFieldDataFilter filter
    );
}
