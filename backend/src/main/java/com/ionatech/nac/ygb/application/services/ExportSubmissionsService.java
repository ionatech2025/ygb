package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.ExportSubmissionsQuery;
import com.ionatech.nac.ygb.application.ports.spi.DashboardAggregationRepositoryPort;
import com.ionatech.nac.ygb.application.ports.spi.ExportGeneratorPort;
import com.ionatech.nac.ygb.application.ports.spi.SubmissionRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.*;

import java.io.OutputStream;
import java.util.function.Consumer;

public class ExportSubmissionsService implements ExportSubmissionsQuery {

    static final int EXPORT_BATCH_SIZE = 1000;

    private final SubmissionRepositoryPort submissionRepositoryPort;
    private final DashboardAggregationRepositoryPort aggregationRepositoryPort;
    private final DashboardFilterHierarchyValidator filterValidator;
    private final ExportGeneratorPort exportGeneratorPort;

    public ExportSubmissionsService(
            SubmissionRepositoryPort submissionRepositoryPort,
            DashboardAggregationRepositoryPort aggregationRepositoryPort,
            DashboardFilterHierarchyValidator filterValidator,
            ExportGeneratorPort exportGeneratorPort
    ) {
        this.submissionRepositoryPort = submissionRepositoryPort;
        this.aggregationRepositoryPort = aggregationRepositoryPort;
        this.filterValidator = filterValidator;
        this.exportGeneratorPort = exportGeneratorPort;
    }

    @Override
    public void export(DashboardFilter filter, ExportFormat format, OutputStream output) {
        DashboardFilter effectiveFilter = filter != null ? filter : DashboardFilter.empty();
        filterValidator.validate(effectiveFilter);

        DashboardAggregates aggregates = loadAggregates(effectiveFilter);
        exportGeneratorPort.writeExport(
                format,
                effectiveFilter,
                aggregates,
                output,
                rowConsumer -> streamSummaries(effectiveFilter, rowConsumer)
        );
    }

    private DashboardAggregates loadAggregates(DashboardFilter filter) {
        return new DashboardAggregates(
                aggregationRepositoryPort.countTotal(filter),
                aggregationRepositoryPort.countByDistrict(filter),
                aggregationRepositoryPort.countByGender(filter),
                aggregationRepositoryPort.countOverTime(filter, TimeSeriesGranularity.DAY),
                aggregationRepositoryPort.countByFormType(filter),
                aggregationRepositoryPort.countByFinancialYearPeriod(filter)
        );
    }

    private void streamSummaries(DashboardFilter filter, Consumer<SubmissionSummary> rowConsumer) {
        int page = 0;
        while (true) {
            SubmissionPage result = submissionRepositoryPort.findSummariesByFilter(
                    filter,
                    PageRequest.of(page, EXPORT_BATCH_SIZE)
            );
            for (SubmissionSummary summary : result.items()) {
                rowConsumer.accept(summary);
            }
            page++;
            if (page >= result.totalPages()) {
                break;
            }
        }
    }
}
