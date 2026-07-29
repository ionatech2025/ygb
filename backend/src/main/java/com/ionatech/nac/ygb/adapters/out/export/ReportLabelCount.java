package com.ionatech.nac.ygb.adapters.out.export;

public record ReportLabelCount(String label, long count) {
    public ReportLabelCount {
        if (label == null || label.isBlank()) {
            throw new IllegalArgumentException("ReportLabelCount label must not be blank.");
        }
        if (count < 0) {
            throw new IllegalArgumentException("ReportLabelCount count must not be negative.");
        }
    }
}
