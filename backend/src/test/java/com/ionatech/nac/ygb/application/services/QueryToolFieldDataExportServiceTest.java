package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.ToolFieldDataExportRepositoryPort;
import com.ionatech.nac.ygb.domain.model.BypSubmission;
import com.ionatech.nac.ygb.domain.service.ToolDownloadCatalogue;
import com.ionatech.nac.ygb.domain.service.ToolFieldDataProjector;
import com.ionatech.nac.ygb.domain.valueobjects.AgeGroup;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.Location;
import com.ionatech.nac.ygb.domain.valueobjects.NarrativeText;
import com.ionatech.nac.ygb.domain.valueobjects.Rating;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionMetadata;
import com.ionatech.nac.ygb.domain.valueobjects.ToolDownloadDataset;
import com.ionatech.nac.ygb.domain.valueobjects.ToolFieldDataFilter;
import com.ionatech.nac.ygb.domain.valueobjects.ToolFieldDataRecord;
import com.ionatech.nac.ygb.domain.valueobjects.ToolFieldExportRow;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class QueryToolFieldDataExportServiceTest {

    private ToolFieldDataExportRepositoryPort exportRepositoryPort;
    private DashboardFilterHierarchyValidator filterValidator;
    private QueryToolFieldDataExportService service;

    @BeforeEach
    void setUp() {
        exportRepositoryPort = mock(ToolFieldDataExportRepositoryPort.class);
        filterValidator = mock(DashboardFilterHierarchyValidator.class);
        ToolDownloadCatalogue catalogue = new ToolDownloadCatalogue();
        service = new QueryToolFieldDataExportService(
                catalogue,
                exportRepositoryPort,
                filterValidator,
                new ToolFieldDataProjector(catalogue)
        );
    }

    @Test
    void shouldForwardEmptyFilterAndProjectSyncedRows() {
        when(exportRepositoryPort.findSyncedByDatasetAndFilter(
                eq(ToolDownloadDataset.BYP),
                eq(ToolFieldDataFilter.empty())
        )).thenReturn(List.of(new ToolFieldDataRecord.PdmForm(
                ToolDownloadDataset.BYP,
                sampleByp(),
                "Kampala",
                "Central",
                "Nakasero"
        )));

        List<ToolFieldExportRow> rows = service.query(ToolDownloadDataset.BYP, null);

        assertThat(rows).hasSize(1);
        assertThat(rows.getFirst().get("Dataset")).isEqualTo("BYP");
        assertThat(rows.getFirst().get("District")).isEqualTo("Kampala");
        assertThat(rows.getFirst().get("Money Used For")).contains("farming inputs");
        verify(exportRepositoryPort).findSyncedByDatasetAndFilter(
                ToolDownloadDataset.BYP,
                ToolFieldDataFilter.empty()
        );
    }

    @Test
    void shouldValidateAndForwardAndCombinedFilters() {
        UUID districtId = UUID.randomUUID();
        UUID subcountyId = UUID.randomUUID();
        UUID parishId = UUID.randomUUID();
        ToolFieldDataFilter filter = new ToolFieldDataFilter(
                districtId,
                subcountyId,
                parishId,
                "FEMALE",
                "AGE_18_24",
                "JAN_JUN_2026"
        );
        when(exportRepositoryPort.findSyncedByDatasetAndFilter(eq(ToolDownloadDataset.IYP), eq(filter)))
                .thenReturn(List.of());

        service.query(ToolDownloadDataset.IYP, filter);

        ArgumentCaptor<DashboardFilter> dashboardFilterCaptor = ArgumentCaptor.forClass(DashboardFilter.class);
        verify(filterValidator).validate(dashboardFilterCaptor.capture());
        DashboardFilter validated = dashboardFilterCaptor.getValue();
        assertThat(validated.districtId()).isEqualTo(districtId);
        assertThat(validated.subcountyId()).isEqualTo(subcountyId);
        assertThat(validated.parishId()).isEqualTo(parishId);
        assertThat(validated.gender()).isEqualTo("FEMALE");
        assertThat(validated.ageGroup()).isEqualTo("AGE_18_24");
        assertThat(validated.financialYearPeriod()).isEqualTo("JAN_JUN_2026");
        assertThat(validated.formType().name()).isEqualTo("IYP");
        assertThat(validated.dateFrom()).isNull();
        assertThat(validated.dateTo()).isNull();
        assertThat(validated.collectorId()).isNull();

        verify(exportRepositoryPort).findSyncedByDatasetAndFilter(ToolDownloadDataset.IYP, filter);
    }

    @Test
    void shouldPassBudgetPrioritiesWithoutFormTypeOnDashboardFilter() {
        when(exportRepositoryPort.findSyncedByDatasetAndFilter(any(), any())).thenReturn(List.of());

        service.query(ToolDownloadDataset.BUDGET_PRIORITIES, ToolFieldDataFilter.empty());

        ArgumentCaptor<DashboardFilter> captor = ArgumentCaptor.forClass(DashboardFilter.class);
        verify(filterValidator).validate(captor.capture());
        assertThat(captor.getValue().formType()).isNull();
    }

    private static BypSubmission sampleByp() {
        return new BypSubmission(
                UUID.randomUUID(),
                new SubmissionMetadata(UUID.randomUUID(), UUID.randomUUID(), LocalDateTime.of(2026, 3, 15, 10, 0)),
                new Location(UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID()),
                "Jane Doe",
                "0772111222",
                "FEMALE",
                AgeGroup.AGE_18_24,
                "ONE_WEEK",
                null,
                true,
                500000L,
                new NarrativeText("I used the money to buy farming inputs."),
                "MONTHLY",
                null,
                Rating.VERY_GOOD,
                false,
                null,
                Rating.GOOD,
                true,
                true,
                List.of("TRAINING", "MARKET_LINKAGES"),
                new NarrativeText("Provide more technical support and early training.")
        );
    }
}
