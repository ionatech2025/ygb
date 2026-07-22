package com.ionatech.nac.ygb.adapters.out.export;

import com.ionatech.nac.ygb.domain.valueobjects.PublicAnonymisedRecord;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.function.Consumer;

@Component
public class PublicCsvExportWriter {

    private static final DateTimeFormatter DATE_TIME_FORMAT = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    void write(OutputStream output, Consumer<Consumer<PublicAnonymisedRecord>> recordStream) throws IOException {
        try (OutputStreamWriter writer = new OutputStreamWriter(output, StandardCharsets.UTF_8)) {
            writer.write(String.join(",", PublicExportColumns.HEADERS));
            writer.write('\n');

            recordStream.accept(record -> {
                try {
                    writer.write(formatRow(record));
                    writer.write('\n');
                } catch (IOException ex) {
                    throw new ExportWriteException("Failed to write public CSV row.", ex);
                }
            });
            writer.flush();
        }
    }

    private String formatRow(PublicAnonymisedRecord record) {
        return String.join(",",
                csv(record.id().toString()),
                csv(record.formType().name()),
                csv(record.districtId().toString()),
                csv(record.districtName()),
                csv(record.gender()),
                csv(record.ageGroup()),
                csv(DATE_TIME_FORMAT.format(record.formCompletedAt())),
                csv(record.status()),
                csv(record.financialYearPeriod())
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
