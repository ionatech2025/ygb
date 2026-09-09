package com.ionatech.nac.ygb.domain.service;

import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDownloadDataset;
import com.ionatech.nac.ygb.domain.valueobjects.ToolDownloadDataset;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

/** Single source of hub datasets, display labels, and storage mappings for field-data downloads. */
public final class ToolDownloadCatalogue {

    private static final List<ToolDownloadDataset> HUB_DATASETS = List.of(
            ToolDownloadDataset.BYP,
            ToolDownloadDataset.IYP,
            ToolDownloadDataset.PC,
            ToolDownloadDataset.LGO,
            ToolDownloadDataset.BUDGET_PRIORITIES,
            ToolDownloadDataset.LGO_BUDGET_ALLOCATION
    );

    public List<ToolDownloadDataset> hubDatasets() {
        return HUB_DATASETS;
    }

    public boolean isHubDownloadable(ToolDownloadDataset dataset) {
        return dataset != null && HUB_DATASETS.contains(dataset);
    }

    public boolean isHubDownloadable(PublicDownloadDataset dataset) {
        return dataset != null && dataset != PublicDownloadDataset.PDM && hubDatasetFor(dataset).isPresent();
    }

    public boolean isLegacyAnalyticsOnly(PublicDownloadDataset dataset) {
        return dataset == PublicDownloadDataset.PDM;
    }

    public String displayLabel(ToolDownloadDataset dataset) {
        requireHub(dataset);
        return switch (dataset) {
            case BYP -> "BYP";
            case IYP -> "IYP";
            case PC -> "PC";
            case LGO -> "LGO";
            case BUDGET_PRIORITIES -> "Budget Priorities";
            case LGO_BUDGET_ALLOCATION -> "Budget Allocations";
        };
    }

    public String analyticsDisplayLabel(PublicDownloadDataset dataset) {
        if (dataset == null) {
            throw new IllegalArgumentException("PublicDownloadDataset must not be null.");
        }
        if (dataset == PublicDownloadDataset.PDM) {
            return "PDM (legacy)";
        }
        return displayLabel(hubDatasetFor(dataset).orElseThrow(
                () -> new IllegalArgumentException("Unknown public download dataset: " + dataset)
        ));
    }

    public Optional<FormType> formType(ToolDownloadDataset dataset) {
        requireHub(dataset);
        return switch (dataset) {
            case BYP -> Optional.of(FormType.BYP);
            case IYP -> Optional.of(FormType.IYP);
            case PC -> Optional.of(FormType.PC);
            case LGO -> Optional.of(FormType.LGO);
            case LGO_BUDGET_ALLOCATION -> Optional.of(FormType.LGO_BUDGET_ALLOCATION);
            case BUDGET_PRIORITIES -> Optional.empty();
        };
    }

    public ToolDownloadDataset requireHubDataset(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Dataset name must not be blank.");
        }
        String normalized = name.trim().toUpperCase(Locale.ROOT);
        return Arrays.stream(ToolDownloadDataset.values())
                .filter(dataset -> dataset.name().equals(normalized))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Not a hub download dataset: " + name));
    }

    public PublicDownloadDataset toPublicDownloadDataset(ToolDownloadDataset dataset) {
        requireHub(dataset);
        return PublicDownloadDataset.valueOf(dataset.name());
    }

    public Optional<ToolDownloadDataset> hubDatasetFor(PublicDownloadDataset dataset) {
        if (dataset == null || dataset == PublicDownloadDataset.PDM) {
            return Optional.empty();
        }
        return Optional.of(ToolDownloadDataset.valueOf(dataset.name()));
    }

    private void requireHub(ToolDownloadDataset dataset) {
        if (!isHubDownloadable(dataset)) {
            throw new IllegalArgumentException("Not a hub download dataset: " + dataset);
        }
    }
}
