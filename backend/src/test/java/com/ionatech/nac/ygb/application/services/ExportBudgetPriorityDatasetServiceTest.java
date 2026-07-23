package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.BudgetPriorityDashboardReadPort;
import com.ionatech.nac.ygb.application.ports.spi.BudgetPriorityExportGeneratorPort;
import com.ionatech.nac.ygb.domain.model.BudgetPrioritySection;
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

class ExportBudgetPriorityDatasetServiceTest {

    private BudgetPriorityDashboardReadPort readPort;
    private DashboardFilterHierarchyValidator filterValidator;
    private BudgetPriorityExportGeneratorPort exportGeneratorPort;
    private ExportBudgetPriorityDatasetService service;

    @BeforeEach
    void setUp() {
        readPort = mock(BudgetPriorityDashboardReadPort.class);
        filterValidator = mock(DashboardFilterHierarchyValidator.class);
        exportGeneratorPort = mock(BudgetPriorityExportGeneratorPort.class);
        service = new ExportBudgetPriorityDatasetService(
                readPort,
                filterValidator,
                exportGeneratorPort,
                new AnonymisationProjector()
        );
    }

    @Test
    void shouldValidateFilterAndStreamProjectedRecordsBeforeWritingExport() {
        UUID districtId = UUID.randomUUID();
        BudgetPriorityDashboardFilter filter = new BudgetPriorityDashboardFilter(
                BudgetPrioritySection.HEALTH,
                districtId, null, null, null, null, null, null, null
        );

        when(readPort.findExportRecordsByFilter(eq(filter), any(PageRequest.class)))
                .thenReturn(new BudgetPriorityAnonymisedRecordPage(
                        List.of(sampleRecord(districtId), sampleRecord(districtId)),
                        2L,
                        0,
                        ExportBudgetPriorityDatasetService.EXPORT_BATCH_SIZE
                ));

        ByteArrayOutputStream output = new ByteArrayOutputStream();
        service.export(filter, ExportFormat.CSV, output);

        verify(filterValidator).validate(BudgetPriorityDashboardFilterMapper.toLocationHierarchyFilter(filter));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<Consumer<Consumer<BudgetPriorityAnonymisedRecord>>> streamCaptor =
                ArgumentCaptor.forClass(Consumer.class);
        verify(exportGeneratorPort).writeExport(eq(ExportFormat.CSV), eq(output), streamCaptor.capture());

        AtomicInteger rowCount = new AtomicInteger();
        streamCaptor.getValue().accept(record -> rowCount.incrementAndGet());
        assertThat(rowCount.get()).isEqualTo(2);
    }

    private BudgetPriorityAnonymisedRecord sampleRecord(UUID districtId) {
        return new BudgetPriorityAnonymisedRecord(
                UUID.randomUUID(),
                "health",
                "JAN_JUN_2026",
                districtId,
                "Kampala",
                "FEMALE",
                "AGE_20_24",
                "PRIMARY_HEALTH_CARE",
                LocalDateTime.of(2026, 3, 15, 10, 0)
        );
    }
}
