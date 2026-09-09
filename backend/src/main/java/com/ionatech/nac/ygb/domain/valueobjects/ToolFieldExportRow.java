package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/** Ordered tabular row for a tool field-data export (common header + answers). */
public record ToolFieldExportRow(Map<String, String> columns) {

    public ToolFieldExportRow {
        Objects.requireNonNull(columns, "columns must not be null");
        columns = Collections.unmodifiableMap(new LinkedHashMap<>(columns));
    }

    public List<String> headers() {
        return List.copyOf(columns.keySet());
    }

    public List<String> values() {
        return new ArrayList<>(columns.values());
    }

    public String get(String header) {
        return columns.get(header);
    }
}
