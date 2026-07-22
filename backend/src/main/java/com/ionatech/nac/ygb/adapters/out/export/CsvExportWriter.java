package com.ionatech.nac.ygb.adapters.out.export;

import com.ionatech.nac.ygb.domain.valueobjects.SubmissionSummary;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.function.Consumer;

@Component
public class CsvExportWriter {

    private static final DateTimeFormatter DATE_TIME_FORMAT = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    void write(OutputStream output, Consumer<Consumer<SubmissionSummary>> summaryStream) throws IOException {
        try (OutputStreamWriter writer = new OutputStreamWriter(output, StandardCharsets.UTF_8)) {
            writer.write(String.join(",", SubmissionExportColumns.HEADERS));
            writer.write('\n');

            summaryStream.accept(summary -> {
                try {
                    writer.write(formatRow(summary));
                    writer.write('\n');
                } catch (IOException ex) {
                    throw new ExportWriteException("Failed to write CSV row.", ex);
                }
            });
            writer.flush();
        }
    }

    private String formatRow(SubmissionSummary summary) {
        return String.join(",",
                csv(summary.id().toString()),
                csv(summary.formType().name()),
                csv(summary.respondentName()),
                csv(summary.districtName()),
                csv(summary.collectorName()),
                csv(formatDateTime(summary.formCompletedAt())),
                csv(summary.syncedAt() != null ? formatDateTime(summary.syncedAt()) : ""),
                csv(summary.status()),
                csv(summary.financialYearPeriod())
        );
    }

    private static String formatDateTime(java.time.LocalDateTime value) {
        return DATE_TIME_FORMAT.format(value);
    }

    private static String csv(String value) {
        if (value == null) {
            return "";
        }
        if (value.contains(",") || value.contains("\"") || value.contains("\n") || value.contains("\r")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}
