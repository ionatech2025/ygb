package com.ionatech.nac.ygb.adapters.out.export;

import com.ionatech.nac.ygb.domain.valueobjects.ExportFormat;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public final class PublicExportFilenameBuilder {

    private static final DateTimeFormatter TIMESTAMP = DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss");

    private PublicExportFilenameBuilder() {
    }

    public static String build(ExportFormat format) {
        return "public-dataset-export-" + TIMESTAMP.format(LocalDateTime.now()) + "." + format.fileExtension();
    }
}
