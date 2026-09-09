package com.ionatech.nac.ygb.adapters.out.export;

import com.ionatech.nac.ygb.domain.valueobjects.ExportFormat;
import com.ionatech.nac.ygb.domain.valueobjects.ToolDownloadDataset;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public final class ToolFieldExportFilenameBuilder {

    private static final DateTimeFormatter TIMESTAMP = DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss");

    private ToolFieldExportFilenameBuilder() {
    }

    public static String build(ToolDownloadDataset dataset, ExportFormat format) {
        String slug = dataset.name().toLowerCase(Locale.ROOT).replace('_', '-');
        return "tool-field-data-" + slug + "-" + TIMESTAMP.format(LocalDateTime.now()) + "." + format.fileExtension();
    }
}
