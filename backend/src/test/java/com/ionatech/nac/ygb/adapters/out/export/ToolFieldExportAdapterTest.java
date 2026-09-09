package com.ionatech.nac.ygb.adapters.out.export;

import com.ionatech.nac.ygb.domain.valueobjects.ExportFormat;
import com.ionatech.nac.ygb.domain.valueobjects.ToolFieldExportRow;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class ToolFieldExportAdapterTest {

    private final ToolFieldExportAdapter adapter = new ToolFieldExportAdapter(
            new ToolFieldCsvExportWriter(),
            new ToolFieldExcelExportWriter()
    );

    @Test
    void shouldWriteCsvWithDynamicHeadersAndEscaping() {
        LinkedHashMap<String, String> columns = new LinkedHashMap<>();
        columns.put("Dataset", "BYP");
        columns.put("Money Used For", "seeds, tools");
        ByteArrayOutputStream output = new ByteArrayOutputStream();

        adapter.writeExport(ExportFormat.CSV, output, List.of(new ToolFieldExportRow(columns)));

        String csv = output.toString(StandardCharsets.UTF_8);
        assertThat(csv).startsWith("Dataset,Money Used For\n");
        assertThat(csv).contains("\"seeds, tools\"");
        assertThat(csv).doesNotContain("Collector");
    }

    @Test
    void shouldWriteNonEmptyExcelWorkbook() {
        LinkedHashMap<String, String> columns = new LinkedHashMap<>();
        columns.put("Dataset", "IYP");
        columns.put("District", "Arua");
        ByteArrayOutputStream output = new ByteArrayOutputStream();

        adapter.writeExport(ExportFormat.XLSX, output, List.of(new ToolFieldExportRow(columns)));

        assertThat(output.size()).isGreaterThan(0);
    }
}
