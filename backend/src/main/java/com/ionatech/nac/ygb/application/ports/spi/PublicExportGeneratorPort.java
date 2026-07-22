package com.ionatech.nac.ygb.application.ports.spi;

import com.ionatech.nac.ygb.domain.valueobjects.ExportFormat;
import com.ionatech.nac.ygb.domain.valueobjects.PublicAnonymisedRecord;

import java.io.OutputStream;
import java.util.function.Consumer;

public interface PublicExportGeneratorPort {

    void writeExport(
            ExportFormat format,
            OutputStream output,
            Consumer<Consumer<PublicAnonymisedRecord>> recordStream
    );
}
