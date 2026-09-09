package com.ionatech.nac.ygb.domain.service;

import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDownloadDataset;
import com.ionatech.nac.ygb.domain.valueobjects.ToolDownloadDataset;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ToolDownloadCatalogueTest {

    private final ToolDownloadCatalogue catalogue = new ToolDownloadCatalogue();

    @Test
    void shouldEnumerateExactlySixHubDatasets() {
        List<ToolDownloadDataset> hub = catalogue.hubDatasets();

        assertThat(hub).containsExactly(
                ToolDownloadDataset.BYP,
                ToolDownloadDataset.IYP,
                ToolDownloadDataset.PC,
                ToolDownloadDataset.LGO,
                ToolDownloadDataset.BUDGET_PRIORITIES,
                ToolDownloadDataset.LGO_BUDGET_ALLOCATION
        );
    }

    @Test
    void shouldMapPdmFormTypesToMatchingHubDatasets() {
        assertThat(catalogue.formType(ToolDownloadDataset.BYP)).contains(FormType.BYP);
        assertThat(catalogue.formType(ToolDownloadDataset.IYP)).contains(FormType.IYP);
        assertThat(catalogue.formType(ToolDownloadDataset.PC)).contains(FormType.PC);
        assertThat(catalogue.formType(ToolDownloadDataset.LGO)).contains(FormType.LGO);
        assertThat(catalogue.formType(ToolDownloadDataset.LGO_BUDGET_ALLOCATION))
                .contains(FormType.LGO_BUDGET_ALLOCATION);
    }

    @Test
    void shouldNotMapBudgetPrioritiesToFormType() {
        assertThat(catalogue.formType(ToolDownloadDataset.BUDGET_PRIORITIES)).isEmpty();
    }

    @Test
    void shouldExposeDistinctDisplayLabels() {
        assertThat(catalogue.displayLabel(ToolDownloadDataset.LGO)).isEqualTo("LGO");
        assertThat(catalogue.displayLabel(ToolDownloadDataset.LGO_BUDGET_ALLOCATION))
                .isEqualTo("Budget Allocations");
        assertThat(catalogue.displayLabel(ToolDownloadDataset.BUDGET_PRIORITIES))
                .isEqualTo("Budget Priorities");
        assertThat(catalogue.displayLabel(ToolDownloadDataset.BYP)).isEqualTo("BYP");
    }

    @Test
    void shouldTreatHistoricalPdmAsLegacyAnalyticsOnly() {
        assertThat(catalogue.isLegacyAnalyticsOnly(PublicDownloadDataset.PDM)).isTrue();
        assertThat(catalogue.isHubDownloadable(PublicDownloadDataset.PDM)).isFalse();
        assertThat(catalogue.analyticsDisplayLabel(PublicDownloadDataset.PDM)).isEqualTo("PDM (legacy)");
    }

    @ParameterizedTest
    @EnumSource(ToolDownloadDataset.class)
    void everyHubDatasetIsDownloadable(ToolDownloadDataset dataset) {
        assertThat(catalogue.isHubDownloadable(dataset)).isTrue();
    }

    @Test
    void shouldRejectUnknownHubDatasetName() {
        assertThatThrownBy(() -> catalogue.requireHubDataset("PDM"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("PDM");
    }

    @Test
    void shouldResolveHubDatasetByName() {
        assertThat(catalogue.requireHubDataset("BYP")).isEqualTo(ToolDownloadDataset.BYP);
        assertThat(catalogue.requireHubDataset("lgo_budget_allocation"))
                .isEqualTo(ToolDownloadDataset.LGO_BUDGET_ALLOCATION);
    }

    @Test
    void shouldMapHubDatasetsToPublicDownloadDatasetForUsageEvents() {
        assertThat(catalogue.toPublicDownloadDataset(ToolDownloadDataset.BYP))
                .isEqualTo(PublicDownloadDataset.BYP);
        assertThat(catalogue.toPublicDownloadDataset(ToolDownloadDataset.LGO_BUDGET_ALLOCATION))
                .isEqualTo(PublicDownloadDataset.LGO_BUDGET_ALLOCATION);
        assertThat(catalogue.isHubDownloadable(PublicDownloadDataset.BYP)).isTrue();
        assertThat(catalogue.hubDatasetFor(PublicDownloadDataset.IYP)).contains(ToolDownloadDataset.IYP);
    }
}
