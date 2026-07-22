package com.ionatech.nac.ygb.adapters.out.export;

import com.ionatech.nac.ygb.application.ports.spi.ExportGeneratorPort;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.ExportFormat;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionSummary;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.OutputStream;
import java.util.function.Consumer;

@Component
public class SubmissionExportAdapter implements ExportGeneratorPort {

    private final CsvExportWriter csvExportWriter;
    private final ExcelExportWriter excelExportWriter;
    private final PdfExportWriter pdfExportWriter;

    public SubmissionExportAdapter(
            CsvExportWriter csvExportWriter,
            ExcelExportWriter excelExportWriter,
            PdfExportWriter pdfExportWriter
    ) {
        this.csvExportWriter = csvExportWriter;
        this.excelExportWriter = excelExportWriter;
        this.pdfExportWriter = pdfExportWriter;
    }

    @Override
    public void writeExport(
            ExportFormat format,
            DashboardFilter filter,
            DashboardAggregates aggregates,
            OutputStream output,
            Consumer<Consumer<SubmissionSummary>> summaryStream
    ) {
        try {
            switch (format) {
                case CSV -> csvExportWriter.write(output, summaryStream);
                case XLSX -> excelExportWriter.write(output, summaryStream);
                case PDF -> pdfExportWriter.write(output, filter, aggregates);
            }
        } catch (IOException | RuntimeException ex) {
            throw new ExportWriteException("Failed to generate " + format + " export.", ex);
        } catch (Exception ex) {
            throw new ExportWriteException("Failed to generate " + format + " export.", ex);
        }
    }
}
