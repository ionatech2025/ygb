package com.ionatech.nac.ygb.adapters.out.export;

import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityAnonymisedRecord;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.function.Consumer;

@Component
public class BudgetPriorityCsvExportWriter {

    private static final DateTimeFormatter DATE_TIME_FORMAT = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    void write(OutputStream output, Consumer<Consumer<BudgetPriorityAnonymisedRecord>> recordStream) throws IOException {
        try (OutputStreamWriter writer = new OutputStreamWriter(output, StandardCharsets.UTF_8)) {
            writer.write(String.join(",", BudgetPriorityExportColumns.HEADERS));
            writer.write('\n');

            recordStream.accept(record -> {
                try {
                    writer.write(formatRow(record));
                    writer.write('\n');
                } catch (IOException ex) {
                    throw new ExportWriteException("Failed to write budget priority CSV row.", ex);
                }
            });
            writer.flush();
        }
    }

    private String formatRow(BudgetPriorityAnonymisedRecord record) {
        return String.join(",",
                csv(record.id().toString()),
                csv(record.section()),
                csv(record.financialYearPeriod()),
                csv(record.districtId().toString()),
                csv(record.districtName()),
                csv(record.gender()),
                csv(record.ageGroup()),
                csv(record.priorityAreas()),
                csv(DATE_TIME_FORMAT.format(record.submittedAt()))
        );
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
