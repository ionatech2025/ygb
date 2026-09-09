package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.ExportToolFieldDataQuery;
import com.ionatech.nac.ygb.application.ports.api.QueryToolFieldDataExport;
import com.ionatech.nac.ygb.application.ports.spi.ToolFieldExportGeneratorPort;
import com.ionatech.nac.ygb.domain.service.ToolFieldDataProjector;
import com.ionatech.nac.ygb.domain.valueobjects.ExportFormat;
import com.ionatech.nac.ygb.domain.valueobjects.ToolDownloadDataset;
import com.ionatech.nac.ygb.domain.valueobjects.ToolFieldDataFilter;
import com.ionatech.nac.ygb.domain.valueobjects.ToolFieldExportRow;

import java.io.OutputStream;
import java.util.List;
import java.util.Objects;

public class ExportToolFieldDataService implements ExportToolFieldDataQuery {

    private final QueryToolFieldDataExport queryToolFieldDataExport;
    private final ToolFieldExportGeneratorPort exportGeneratorPort;
    private final ToolFieldDataProjector projector;

    public ExportToolFieldDataService(
            QueryToolFieldDataExport queryToolFieldDataExport,
            ToolFieldExportGeneratorPort exportGeneratorPort,
            ToolFieldDataProjector projector
    ) {
        this.queryToolFieldDataExport = Objects.requireNonNull(queryToolFieldDataExport);
        this.exportGeneratorPort = Objects.requireNonNull(exportGeneratorPort);
        this.projector = Objects.requireNonNull(projector);
    }

    @Override
    public void export(
            ToolDownloadDataset dataset,
            ToolFieldDataFilter filter,
            ExportFormat format,
            OutputStream output
    ) {
        if (format != ExportFormat.CSV && format != ExportFormat.XLSX) {
            throw new IllegalArgumentException("Tool field-data export supports CSV and Excel only.");
        }
        List<ToolFieldExportRow> rows = queryToolFieldDataExport.query(dataset, filter);
        if (!rows.isEmpty()) {
            projector.assertHeadersSafe(rows.getFirst().headers());
        }
        exportGeneratorPort.writeExport(format, output, rows);
    }
}
