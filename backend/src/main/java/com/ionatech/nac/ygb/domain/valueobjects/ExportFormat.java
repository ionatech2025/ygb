package com.ionatech.nac.ygb.domain.valueobjects;

public enum ExportFormat {
    CSV,
    XLSX,
    PDF;

    public static ExportFormat fromParam(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Export format is required.");
        }
        return ExportFormat.valueOf(value.trim().toUpperCase());
    }

    public String fileExtension() {
        return switch (this) {
            case CSV -> "csv";
            case XLSX -> "xlsx";
            case PDF -> "pdf";
        };
    }

    public String contentType() {
        return switch (this) {
            case CSV -> "text/csv";
            case XLSX -> "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            case PDF -> "application/pdf";
        };
    }
}
