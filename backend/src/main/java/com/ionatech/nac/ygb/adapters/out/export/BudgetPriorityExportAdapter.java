package com.ionatech.nac.ygb.adapters.out.export;

import com.ionatech.nac.ygb.application.ports.spi.BudgetPriorityExportGeneratorPort;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityAnonymisedRecord;
import com.ionatech.nac.ygb.domain.valueobjects.ExportFormat;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.OutputStream;
import java.util.function.Consumer;

@Component
public class BudgetPriorityExportAdapter implements BudgetPriorityExportGeneratorPort {

    private final BudgetPriorityCsvExportWriter csvExportWriter;
    private final BudgetPriorityExcelExportWriter excelExportWriter;

    public BudgetPriorityExportAdapter(
            BudgetPriorityCsvExportWriter csvExportWriter,
            BudgetPriorityExcelExportWriter excelExportWriter
    ) {
        this.csvExportWriter = csvExportWriter;
        this.excelExportWriter = excelExportWriter;
    }

    @Override
    public void writeExport(
            ExportFormat format,
            OutputStream output,
            Consumer<Consumer<BudgetPriorityAnonymisedRecord>> recordStream
    ) {
        try {
            switch (format) {
                case CSV -> csvExportWriter.write(output, recordStream);
                case XLSX -> excelExportWriter.write(output, recordStream);
                default -> throw new IllegalArgumentException("Budget priority export supports CSV and XLSX only.");
            }
        } catch (IOException | RuntimeException ex) {
            throw new ExportWriteException("Failed to generate budget priority " + format + " export.", ex);
        }
    }
}
