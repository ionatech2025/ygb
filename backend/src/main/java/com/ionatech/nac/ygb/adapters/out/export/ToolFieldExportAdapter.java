package com.ionatech.nac.ygb.adapters.out.export;

import com.ionatech.nac.ygb.application.ports.spi.ToolFieldExportGeneratorPort;
import com.ionatech.nac.ygb.domain.valueobjects.ExportFormat;
import com.ionatech.nac.ygb.domain.valueobjects.ToolFieldExportRow;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

@Component
public class ToolFieldExportAdapter implements ToolFieldExportGeneratorPort {

    private final ToolFieldCsvExportWriter csvExportWriter;
    private final ToolFieldExcelExportWriter excelExportWriter;

    public ToolFieldExportAdapter(
            ToolFieldCsvExportWriter csvExportWriter,
            ToolFieldExcelExportWriter excelExportWriter
    ) {
        this.csvExportWriter = csvExportWriter;
        this.excelExportWriter = excelExportWriter;
    }

    @Override
    public void writeExport(ExportFormat format, OutputStream output, List<ToolFieldExportRow> rows) {
        try {
            switch (format) {
                case CSV -> csvExportWriter.write(output, rows);
                case XLSX -> excelExportWriter.write(output, rows);
                default -> throw new IllegalArgumentException("Tool field-data export supports CSV and XLSX only.");
            }
        } catch (IOException | RuntimeException ex) {
            throw new ExportWriteException("Failed to generate tool field-data " + format + " export.", ex);
        }
    }
}
