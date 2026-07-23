package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.LgoBudgetAllocationExportGeneratorPort;
import com.ionatech.nac.ygb.application.ports.spi.LgoBudgetAllocationReadRepositoryPort;
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

class ExportLgoBudgetAllocationDatasetServiceTest {

    private LgoBudgetAllocationReadRepositoryPort readPort;
    private DashboardFilterHierarchyValidator filterValidator;
    private LgoBudgetAllocationExportGeneratorPort exportGeneratorPort;
    private ExportLgoBudgetAllocationDatasetService service;

    @BeforeEach
    void setUp() {
        readPort = mock(LgoBudgetAllocationReadRepositoryPort.class);
        filterValidator = mock(DashboardFilterHierarchyValidator.class);
        exportGeneratorPort = mock(LgoBudgetAllocationExportGeneratorPort.class);
        service = new ExportLgoBudgetAllocationDatasetService(
                readPort,
                filterValidator,
                exportGeneratorPort,
                new AnonymisationProjector()
        );
    }

    @Test
    void shouldValidateFilterAndStreamProjectedRecordsBeforeWritingExport() {
        UUID districtId = UUID.randomUUID();
        LgoBudgetAllocationDashboardFilter filter = new LgoBudgetAllocationDashboardFilter(
                districtId, null, null, null, null, null, null, null
        );

        when(readPort.findExportRecordsByFilter(eq(filter), any(PageRequest.class)))
                .thenReturn(new LgoBudgetAllocationAnonymisedRecordPage(
                        List.of(sampleRecord(districtId), sampleRecord(districtId)),
                        2L,
                        0,
                        ExportLgoBudgetAllocationDatasetService.EXPORT_BATCH_SIZE
                ));

        ByteArrayOutputStream output = new ByteArrayOutputStream();
        service.export(filter, output);

        verify(filterValidator).validate(LgoBudgetAllocationDashboardFilterMapper.toLocationHierarchyFilter(filter));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<Consumer<Consumer<LgoBudgetAllocationAnonymisedRecord>>> streamCaptor =
                ArgumentCaptor.forClass(Consumer.class);
        verify(exportGeneratorPort).writeCsvExport(eq(output), streamCaptor.capture());

        AtomicInteger rowCount = new AtomicInteger();
        streamCaptor.getValue().accept(record -> rowCount.incrementAndGet());
        assertThat(rowCount.get()).isEqualTo(2);
    }

    private LgoBudgetAllocationAnonymisedRecord sampleRecord(UUID districtId) {
        return new LgoBudgetAllocationAnonymisedRecord(
                UUID.randomUUID(),
                "JAN_JUN_2026",
                districtId,
                "Kampala",
                "FEMALE",
                "AGE_30_AND_ABOVE",
                "{\"health\":{\"amount\":1200000}}",
                LocalDateTime.of(2026, 3, 15, 10, 0)
        );
    }
}
