package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.ExportPublicDatasetQuery;
import com.ionatech.nac.ygb.application.ports.spi.PublicAnonymisedExportRepositoryPort;
import com.ionatech.nac.ygb.application.ports.spi.PublicExportGeneratorPort;
import com.ionatech.nac.ygb.domain.service.AnonymisationProjector;
import com.ionatech.nac.ygb.domain.valueobjects.*;

import java.io.OutputStream;
import java.util.function.Consumer;

public class ExportPublicDatasetService implements ExportPublicDatasetQuery {

    static final int EXPORT_BATCH_SIZE = 1000;

    private final PublicAnonymisedExportRepositoryPort exportRepositoryPort;
    private final DashboardFilterHierarchyValidator filterValidator;
    private final PublicExportGeneratorPort exportGeneratorPort;
    private final AnonymisationProjector anonymisationProjector;

    public ExportPublicDatasetService(
            PublicAnonymisedExportRepositoryPort exportRepositoryPort,
            DashboardFilterHierarchyValidator filterValidator,
            PublicExportGeneratorPort exportGeneratorPort,
            AnonymisationProjector anonymisationProjector
    ) {
        this.exportRepositoryPort = exportRepositoryPort;
        this.filterValidator = filterValidator;
        this.exportGeneratorPort = exportGeneratorPort;
        this.anonymisationProjector = anonymisationProjector;
    }

    @Override
    public void export(PublicDashboardFilter filter, ExportFormat format, OutputStream output) {
        DashboardFilter dashboardFilter = resolveFilter(filter);
        anonymisationProjector.assertExportHeadersSafe();
        exportGeneratorPort.writeExport(
                format,
                output,
                rowConsumer -> streamRecords(dashboardFilter, rowConsumer)
        );
    }

    private void streamRecords(DashboardFilter filter, Consumer<PublicAnonymisedRecord> rowConsumer) {
        int page = 0;
        while (true) {
            PublicAnonymisedRecordPage result = exportRepositoryPort.findRecordsByFilter(
                    filter,
                    PageRequest.of(page, EXPORT_BATCH_SIZE)
            );
            for (PublicAnonymisedRecord record : result.items()) {
                rowConsumer.accept(anonymisationProjector.assertExportRecord(record));
            }
            page++;
            if (page >= result.totalPages()) {
                break;
            }
        }
    }

    private DashboardFilter resolveFilter(PublicDashboardFilter filter) {
        PublicDashboardFilter effectiveFilter = filter != null ? filter : PublicDashboardFilter.empty();
        DashboardFilter dashboardFilter = PublicDashboardFilterMapper.toDashboardFilter(effectiveFilter);
        filterValidator.validate(dashboardFilter);
        return dashboardFilter;
    }
}
