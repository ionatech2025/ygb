package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.DashboardAggregationRepositoryPort;
import com.ionatech.nac.ygb.application.ports.spi.ExportGeneratorPort;
import com.ionatech.nac.ygb.application.ports.spi.SubmissionRepositoryPort;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.valueobjects.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Consumer;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class ExportSubmissionsServiceTest {

    private SubmissionRepositoryPort submissionRepositoryPort;
    private DashboardAggregationRepositoryPort aggregationRepositoryPort;
    private DashboardFilterHierarchyValidator filterValidator;
    private ExportGeneratorPort exportGeneratorPort;
    private ExportSubmissionsService service;

    @BeforeEach
    void setUp() {
        submissionRepositoryPort = mock(SubmissionRepositoryPort.class);
        aggregationRepositoryPort = mock(DashboardAggregationRepositoryPort.class);
        filterValidator = mock(DashboardFilterHierarchyValidator.class);
        exportGeneratorPort = mock(ExportGeneratorPort.class);
        service = new ExportSubmissionsService(
                submissionRepositoryPort,
                aggregationRepositoryPort,
                filterValidator,
                exportGeneratorPort
        );
    }

    @Test
    void shouldValidateFilterAndStreamSummariesBeforeWritingExport() {
        UUID districtId = UUID.randomUUID();
        DashboardFilter filter = new DashboardFilter(
                districtId, null, null, FormType.BYP, null, null, null, null, null, null
        );

        when(submissionRepositoryPort.findSummariesByFilter(eq(filter), any(PageRequest.class)))
                .thenReturn(new SubmissionPage(
                        List.of(sampleSummary("Jane"), sampleSummary("John")),
                        2L,
                        0,
                        ExportSubmissionsService.EXPORT_BATCH_SIZE
                ));
        when(aggregationRepositoryPort.countTotal(filter)).thenReturn(2L);
        when(aggregationRepositoryPort.countByDistrict(filter)).thenReturn(List.of());
        when(aggregationRepositoryPort.countByGender(filter)).thenReturn(List.of());
        when(aggregationRepositoryPort.countOverTime(filter, TimeSeriesGranularity.DAY)).thenReturn(List.of());
        when(aggregationRepositoryPort.countByFormType(filter)).thenReturn(List.of(new FormTypeCount(FormType.BYP, 2L)));
        when(aggregationRepositoryPort.countByFinancialYearPeriod(filter)).thenReturn(List.of());

        ByteArrayOutputStream output = new ByteArrayOutputStream();
        service.export(filter, ExportFormat.CSV, output);

        verify(filterValidator).validate(filter);

        @SuppressWarnings("unchecked")
        ArgumentCaptor<Consumer<Consumer<SubmissionSummary>>> streamCaptor =
                ArgumentCaptor.forClass(Consumer.class);
        verify(exportGeneratorPort).writeExport(
                eq(ExportFormat.CSV),
                eq(filter),
                any(DashboardAggregates.class),
                eq(output),
                streamCaptor.capture()
        );

        AtomicInteger rowCount = new AtomicInteger();
        streamCaptor.getValue().accept(summary -> rowCount.incrementAndGet());
        assertThat(rowCount.get()).isEqualTo(2);
    }

    private SubmissionSummary sampleSummary(String name) {
        return new SubmissionSummary(
                UUID.randomUUID(),
                FormType.BYP,
                name,
                UUID.randomUUID(),
                "Arua",
                UUID.randomUUID(),
                "Default Collector",
                java.time.LocalDateTime.of(2026, 3, 15, 10, 0),
                java.time.LocalDateTime.of(2026, 3, 15, 10, 5),
                "SYNCED",
                "JAN_JUN_2026"
        );
    }
}
