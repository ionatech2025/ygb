package com.ionatech.nac.ygb.adapters.out.export;

import com.ionatech.nac.ygb.application.ports.spi.PublicExportGeneratorPort;
import com.ionatech.nac.ygb.domain.valueobjects.ExportFormat;
import com.ionatech.nac.ygb.domain.valueobjects.PublicAnonymisedRecord;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.OutputStream;
import java.util.function.Consumer;

@Component
public class PublicExportAdapter implements PublicExportGeneratorPort {

    private final PublicCsvExportWriter csvExportWriter;
    private final PublicExcelExportWriter excelExportWriter;

    public PublicExportAdapter(PublicCsvExportWriter csvExportWriter, PublicExcelExportWriter excelExportWriter) {
        this.csvExportWriter = csvExportWriter;
        this.excelExportWriter = excelExportWriter;
    }

    @Override
    public void writeExport(
            ExportFormat format,
            OutputStream output,
            Consumer<Consumer<PublicAnonymisedRecord>> recordStream
    ) {
        try {
            switch (format) {
                case CSV -> csvExportWriter.write(output, recordStream);
                case XLSX -> excelExportWriter.write(output, recordStream);
                default -> throw new IllegalArgumentException("Public export supports CSV and XLSX only.");
            }
        } catch (IOException | RuntimeException ex) {
            throw new ExportWriteException("Failed to generate public " + format + " export.", ex);
        }
    }
}
