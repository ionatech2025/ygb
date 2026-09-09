package com.ionatech.nac.ygb.application.ports.spi;

import com.ionatech.nac.ygb.domain.valueobjects.ExportFormat;
import com.ionatech.nac.ygb.domain.valueobjects.ToolFieldExportRow;

import java.io.OutputStream;
import java.util.List;

/** Writes dynamic-header tool field-data rows as CSV or Excel. */
public interface ToolFieldExportGeneratorPort {

    void writeExport(ExportFormat format, OutputStream output, List<ToolFieldExportRow> rows);
}
