package com.ionatech.nac.ygb.adapters.out.export;

import com.ionatech.nac.ygb.domain.service.ToolFieldDataProjector;
import com.ionatech.nac.ygb.domain.valueobjects.ToolFieldExportRow;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class ToolFieldCsvExportWriter {

    void write(OutputStream output, List<ToolFieldExportRow> rows) throws IOException {
        try (OutputStreamWriter writer = new OutputStreamWriter(output, StandardCharsets.UTF_8)) {
            List<String> headers = resolveHeaders(rows);
            writer.write(String.join(",", headers.stream().map(ToolFieldCsvExportWriter::csv).toList()));
            writer.write('\n');
            for (ToolFieldExportRow row : rows) {
                writer.write(String.join(",", headers.stream()
                        .map(header -> csv(row.get(header)))
                        .toList()));
                writer.write('\n');
            }
            writer.flush();
        }
    }

    static List<String> resolveHeaders(List<ToolFieldExportRow> rows) {
        if (rows == null || rows.isEmpty()) {
            return ToolFieldDataProjector.COMMON_HEADERS;
        }
        return rows.getFirst().headers();
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
