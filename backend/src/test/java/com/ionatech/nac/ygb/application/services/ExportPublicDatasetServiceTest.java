package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.PublicAnonymisedExportRepositoryPort;
import com.ionatech.nac.ygb.application.ports.spi.PublicExportGeneratorPort;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.service.AnonymisationProjector;
import com.ionatech.nac.ygb.domain.valueobjects.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Consumer;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class ExportPublicDatasetServiceTest {

    private PublicAnonymisedExportRepositoryPort exportRepositoryPort;
    private DashboardFilterHierarchyValidator filterValidator;
    private PublicExportGeneratorPort exportGeneratorPort;
    private ExportPublicDatasetService service;

    @BeforeEach
    void setUp() {
        exportRepositoryPort = mock(PublicAnonymisedExportRepositoryPort.class);
        filterValidator = mock(DashboardFilterHierarchyValidator.class);
        exportGeneratorPort = mock(PublicExportGeneratorPort.class);
        service = new ExportPublicDatasetService(
                exportRepositoryPort,
                filterValidator,
                exportGeneratorPort,
                new AnonymisationProjector()
        );
    }

    @Test
    void shouldValidateFilterAndStreamProjectedRecordsBeforeWritingExport() {
        UUID districtId = UUID.randomUUID();
        PublicDashboardFilter publicFilter = new PublicDashboardFilter(
                districtId, null, null, FormType.BYP, null, null, null, null, null
        );
        DashboardFilter dashboardFilter = PublicDashboardFilterMapper.toDashboardFilter(publicFilter);

        when(exportRepositoryPort.findRecordsByFilter(eq(dashboardFilter), any(PageRequest.class)))
                .thenReturn(new PublicAnonymisedRecordPage(
                        List.of(sampleRecord(districtId), sampleRecord(districtId)),
                        2L,
                        0,
                        ExportPublicDatasetService.EXPORT_BATCH_SIZE
                ));

        ByteArrayOutputStream output = new ByteArrayOutputStream();
        service.export(publicFilter, ExportFormat.CSV, output);

        verify(filterValidator).validate(dashboardFilter);

        @SuppressWarnings("unchecked")
        ArgumentCaptor<Consumer<Consumer<PublicAnonymisedRecord>>> streamCaptor =
                ArgumentCaptor.forClass(Consumer.class);
        verify(exportGeneratorPort).writeExport(eq(ExportFormat.CSV), eq(output), streamCaptor.capture());

        AtomicInteger rowCount = new AtomicInteger();
        streamCaptor.getValue().accept(record -> rowCount.incrementAndGet());
        assertThat(rowCount.get()).isEqualTo(2);
    }

    private PublicAnonymisedRecord sampleRecord(UUID districtId) {
        return new PublicAnonymisedRecord(
                UUID.randomUUID(),
                FormType.BYP,
                districtId,
                "Kampala",
                "FEMALE",
                "AGE_20_24",
                LocalDateTime.of(2026, 3, 15, 10, 0),
                "SYNCED",
                "JAN_JUN_2026"
        );
    }
}
