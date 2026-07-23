package com.ionatech.nac.ygb.application.ports.spi;

import com.ionatech.nac.ygb.domain.valueobjects.LgoBudgetAllocationAnonymisedRecord;

import java.io.OutputStream;
import java.util.function.Consumer;

public interface LgoBudgetAllocationExportGeneratorPort {

    void writeCsvExport(OutputStream output, Consumer<Consumer<LgoBudgetAllocationAnonymisedRecord>> recordStream);
}
