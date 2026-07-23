package com.ionatech.nac.ygb.application.ports.spi;

import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityAnonymisedRecord;
import com.ionatech.nac.ygb.domain.valueobjects.ExportFormat;

import java.io.OutputStream;
import java.util.function.Consumer;

public interface BudgetPriorityExportGeneratorPort {

    void writeExport(
            ExportFormat format,
            OutputStream output,
            Consumer<Consumer<BudgetPriorityAnonymisedRecord>> recordStream
    );
}
