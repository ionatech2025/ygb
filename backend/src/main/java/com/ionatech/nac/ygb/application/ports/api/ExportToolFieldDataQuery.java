package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.ExportFormat;
import com.ionatech.nac.ygb.domain.valueobjects.ToolDownloadDataset;
import com.ionatech.nac.ygb.domain.valueobjects.ToolFieldDataFilter;

import java.io.OutputStream;

/** Writes a hub tool field-data extract (CSV/Excel) using the shared query/projector pipeline. */
public interface ExportToolFieldDataQuery {

    void export(
            ToolDownloadDataset dataset,
            ToolFieldDataFilter filter,
            ExportFormat format,
            OutputStream output
    );
}
