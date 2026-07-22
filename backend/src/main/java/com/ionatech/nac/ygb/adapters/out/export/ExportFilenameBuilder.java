package com.ionatech.nac.ygb.adapters.out.export;

import com.ionatech.nac.ygb.domain.valueobjects.ExportFormat;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public final class ExportFilenameBuilder {

    private static final DateTimeFormatter TIMESTAMP = DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss");

    private ExportFilenameBuilder() {
    }

    public static String build(ExportFormat format) {
        return "submissions-export-" + TIMESTAMP.format(LocalDateTime.now()) + "." + format.fileExtension();
    }
}
