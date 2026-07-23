package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.ExportLgoBudgetAllocationDatasetUseCase;
import com.ionatech.nac.ygb.application.ports.spi.LgoBudgetAllocationExportGeneratorPort;
import com.ionatech.nac.ygb.application.ports.spi.LgoBudgetAllocationReadRepositoryPort;
import com.ionatech.nac.ygb.domain.service.AnonymisationProjector;
import com.ionatech.nac.ygb.domain.valueobjects.*;

import java.io.OutputStream;
import java.util.function.Consumer;

public class ExportLgoBudgetAllocationDatasetService implements ExportLgoBudgetAllocationDatasetUseCase {

    static final int EXPORT_BATCH_SIZE = 1000;

    private final LgoBudgetAllocationReadRepositoryPort readPort;
    private final DashboardFilterHierarchyValidator filterValidator;
    private final LgoBudgetAllocationExportGeneratorPort exportGeneratorPort;
    private final AnonymisationProjector anonymisationProjector;

    public ExportLgoBudgetAllocationDatasetService(
            LgoBudgetAllocationReadRepositoryPort readPort,
            DashboardFilterHierarchyValidator filterValidator,
            LgoBudgetAllocationExportGeneratorPort exportGeneratorPort,
            AnonymisationProjector anonymisationProjector
    ) {
        this.readPort = readPort;
        this.filterValidator = filterValidator;
        this.exportGeneratorPort = exportGeneratorPort;
        this.anonymisationProjector = anonymisationProjector;
    }

    @Override
    public void export(LgoBudgetAllocationDashboardFilter filter, OutputStream output) {
        LgoBudgetAllocationDashboardFilter effectiveFilter = resolveFilter(filter);
        anonymisationProjector.assertLgoBudgetAllocationExportHeadersSafe();
        exportGeneratorPort.writeCsvExport(output, rowConsumer -> streamRecords(effectiveFilter, rowConsumer));
    }

    private void streamRecords(
            LgoBudgetAllocationDashboardFilter filter,
            Consumer<LgoBudgetAllocationAnonymisedRecord> rowConsumer
    ) {
        int page = 0;
        while (true) {
            LgoBudgetAllocationAnonymisedRecordPage result = readPort.findExportRecordsByFilter(
                    filter,
                    PageRequest.of(page, EXPORT_BATCH_SIZE)
            );
            for (LgoBudgetAllocationAnonymisedRecord record : result.items()) {
                rowConsumer.accept(anonymisationProjector.assertLgoBudgetAllocationExportRecord(record));
            }
            page++;
            if (page >= result.totalPages()) {
                break;
            }
        }
    }

    private LgoBudgetAllocationDashboardFilter resolveFilter(LgoBudgetAllocationDashboardFilter filter) {
        LgoBudgetAllocationDashboardFilter effectiveFilter =
                filter != null ? filter : LgoBudgetAllocationDashboardFilter.empty();
        filterValidator.validate(LgoBudgetAllocationDashboardFilterMapper.toLocationHierarchyFilter(effectiveFilter));
        return effectiveFilter;
    }
}
