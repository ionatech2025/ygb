package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.ExportBudgetPriorityDatasetQuery;
import com.ionatech.nac.ygb.application.ports.spi.BudgetPriorityDashboardReadPort;
import com.ionatech.nac.ygb.application.ports.spi.BudgetPriorityExportGeneratorPort;
import com.ionatech.nac.ygb.domain.service.AnonymisationProjector;
import com.ionatech.nac.ygb.domain.valueobjects.*;

import java.io.OutputStream;
import java.util.function.Consumer;

public class ExportBudgetPriorityDatasetService implements ExportBudgetPriorityDatasetQuery {

    static final int EXPORT_BATCH_SIZE = 1000;

    private final BudgetPriorityDashboardReadPort readPort;
    private final DashboardFilterHierarchyValidator filterValidator;
    private final BudgetPriorityExportGeneratorPort exportGeneratorPort;
    private final AnonymisationProjector anonymisationProjector;

    public ExportBudgetPriorityDatasetService(
            BudgetPriorityDashboardReadPort readPort,
            DashboardFilterHierarchyValidator filterValidator,
            BudgetPriorityExportGeneratorPort exportGeneratorPort,
            AnonymisationProjector anonymisationProjector
    ) {
        this.readPort = readPort;
        this.filterValidator = filterValidator;
        this.exportGeneratorPort = exportGeneratorPort;
        this.anonymisationProjector = anonymisationProjector;
    }

    @Override
    public void export(BudgetPriorityDashboardFilter filter, ExportFormat format, OutputStream output) {
        BudgetPriorityDashboardFilter effectiveFilter = resolveFilter(filter);
        anonymisationProjector.assertBudgetPriorityExportHeadersSafe();
        exportGeneratorPort.writeExport(
                format,
                output,
                rowConsumer -> streamRecords(effectiveFilter, rowConsumer)
        );
    }

    private void streamRecords(BudgetPriorityDashboardFilter filter, Consumer<BudgetPriorityAnonymisedRecord> rowConsumer) {
        int page = 0;
        while (true) {
            BudgetPriorityAnonymisedRecordPage result = readPort.findExportRecordsByFilter(
                    filter,
                    PageRequest.of(page, EXPORT_BATCH_SIZE)
            );
            for (BudgetPriorityAnonymisedRecord record : result.items()) {
                rowConsumer.accept(anonymisationProjector.assertBudgetPriorityExportRecord(record));
            }
            page++;
            if (page >= result.totalPages()) {
                break;
            }
        }
    }

    private BudgetPriorityDashboardFilter resolveFilter(BudgetPriorityDashboardFilter filter) {
        BudgetPriorityDashboardFilter effectiveFilter =
                filter != null ? filter : BudgetPriorityDashboardFilter.empty();
        filterValidator.validate(BudgetPriorityDashboardFilterMapper.toLocationHierarchyFilter(effectiveFilter));
        return effectiveFilter;
    }
}
