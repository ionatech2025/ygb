package com.ionatech.nac.ygb.adapters.out.export;

import com.ionatech.nac.ygb.application.ports.spi.LgoBudgetAllocationExportGeneratorPort;
import com.ionatech.nac.ygb.domain.valueobjects.LgoBudgetAllocationAnonymisedRecord;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.OutputStream;
import java.util.function.Consumer;

@Component
public class LgoBudgetAllocationExportAdapter implements LgoBudgetAllocationExportGeneratorPort {

    private final LgoBudgetAllocationCsvExportWriter csvExportWriter;

    public LgoBudgetAllocationExportAdapter(LgoBudgetAllocationCsvExportWriter csvExportWriter) {
        this.csvExportWriter = csvExportWriter;
    }

    @Override
    public void writeCsvExport(
            OutputStream output,
            Consumer<Consumer<LgoBudgetAllocationAnonymisedRecord>> recordStream
    ) {
        try {
            csvExportWriter.write(output, recordStream);
        } catch (IOException | RuntimeException ex) {
            throw new ExportWriteException("Failed to generate LGO budget allocation CSV export.", ex);
        }
    }
}
