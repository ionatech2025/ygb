package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.ToolDownloadDataset;
import com.ionatech.nac.ygb.domain.valueobjects.ToolFieldDataFilter;
import com.ionatech.nac.ygb.domain.valueobjects.ToolFieldExportRow;

import java.util.List;

/** Queries synced field-data rows for one hub dataset and projects them for CSV/Excel hubs. */
public interface QueryToolFieldDataExport {

    List<ToolFieldExportRow> query(ToolDownloadDataset dataset, ToolFieldDataFilter filter);
}
