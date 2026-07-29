package com.ionatech.nac.ygb.domain.valueobjects;

import com.ionatech.nac.ygb.domain.exceptions.InvalidFiscalYearSettingException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public final class LgoFiscalYearCatalog {

    public static final String DEFAULT_ACTIVE_COLLECTION_LABEL = "2025/26";

    public static final List<String> SUPPORTED_LABELS = List.of(
            "2022/23",
            "2023/24",
            "2024/25",
            "2025/26",
            "2026/27",
            "2027/28",
            "2028/29",
            "2029/30"
    );

    private LgoFiscalYearCatalog() {}

    public static boolean isSupported(String label) {
        return label != null && SUPPORTED_LABELS.contains(label.trim());
    }

    public static String latestSupportedLabel() {
        return SUPPORTED_LABELS.get(SUPPORTED_LABELS.size() - 1);
    }

    public static String resolveActiveLabel(String configuredLabel) {
        if (configuredLabel != null && isSupported(configuredLabel)) {
            return configuredLabel.trim();
        }
        return DEFAULT_ACTIVE_COLLECTION_LABEL;
    }

    public static Optional<String> priorLabel(String currentLabel) {
        int index = SUPPORTED_LABELS.indexOf(currentLabel);
        if (index <= 0) {
            return Optional.empty();
        }
        return Optional.of(SUPPORTED_LABELS.get(index - 1));
    }

    public static List<String> orderedWithCurrentFirst(String currentLabel) {
        if (!isSupported(currentLabel)) {
            throw new InvalidFiscalYearSettingException("Unsupported fiscal year label: " + currentLabel);
        }
        List<String> ordered = new ArrayList<>(SUPPORTED_LABELS.size());
        ordered.add(currentLabel);
        for (String label : SUPPORTED_LABELS) {
            if (!label.equals(currentLabel)) {
                ordered.add(label);
            }
        }
        return List.copyOf(ordered);
    }
}
