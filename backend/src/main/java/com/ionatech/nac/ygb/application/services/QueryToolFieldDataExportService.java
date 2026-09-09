package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.QueryToolFieldDataExport;
import com.ionatech.nac.ygb.application.ports.spi.ToolFieldDataExportRepositoryPort;
import com.ionatech.nac.ygb.domain.model.BypSubmission;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.model.IypSubmission;
import com.ionatech.nac.ygb.domain.model.LgoSubmission;
import com.ionatech.nac.ygb.domain.model.PcSubmission;
import com.ionatech.nac.ygb.domain.service.ToolDownloadCatalogue;
import com.ionatech.nac.ygb.domain.service.ToolFieldDataProjector;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.ToolDownloadDataset;
import com.ionatech.nac.ygb.domain.valueobjects.ToolFieldDataFilter;
import com.ionatech.nac.ygb.domain.valueobjects.ToolFieldDataRecord;
import com.ionatech.nac.ygb.domain.valueobjects.ToolFieldExportRow;

import java.util.List;
import java.util.Objects;

public class QueryToolFieldDataExportService implements QueryToolFieldDataExport {

    private final ToolDownloadCatalogue catalogue;
    private final ToolFieldDataExportRepositoryPort exportRepositoryPort;
    private final DashboardFilterHierarchyValidator filterValidator;
    private final ToolFieldDataProjector projector;

    public QueryToolFieldDataExportService(
            ToolDownloadCatalogue catalogue,
            ToolFieldDataExportRepositoryPort exportRepositoryPort,
            DashboardFilterHierarchyValidator filterValidator,
            ToolFieldDataProjector projector
    ) {
        this.catalogue = Objects.requireNonNull(catalogue);
        this.exportRepositoryPort = Objects.requireNonNull(exportRepositoryPort);
        this.filterValidator = Objects.requireNonNull(filterValidator);
        this.projector = Objects.requireNonNull(projector);
    }

    @Override
    public List<ToolFieldExportRow> query(ToolDownloadDataset dataset, ToolFieldDataFilter filter) {
        if (!catalogue.isHubDownloadable(dataset)) {
            throw new IllegalArgumentException("Not a hub download dataset: " + dataset);
        }
        ToolFieldDataFilter effective = filter == null ? ToolFieldDataFilter.empty() : filter;
        filterValidator.validate(toDashboardFilter(dataset, effective));
        return exportRepositoryPort.findSyncedByDatasetAndFilter(dataset, effective).stream()
                .map(this::project)
                .toList();
    }

    private ToolFieldExportRow project(ToolFieldDataRecord record) {
        return switch (record) {
            case ToolFieldDataRecord.PdmForm pdm -> projectPdm(pdm);
            case ToolFieldDataRecord.BudgetPriority budgetPriority -> projector.projectBudgetPriorities(
                    budgetPriority.submission(),
                    budgetPriority.districtName(),
                    budgetPriority.subcountyName(),
                    budgetPriority.parishName()
            );
            case ToolFieldDataRecord.BudgetAllocation budgetAllocation -> projector.projectBudgetAllocations(
                    budgetAllocation.envelope(),
                    budgetAllocation.allocation(),
                    budgetAllocation.districtName(),
                    budgetAllocation.subcountyName(),
                    budgetAllocation.parishName()
            );
        };
    }

    private ToolFieldExportRow projectPdm(ToolFieldDataRecord.PdmForm pdm) {
        return switch (pdm.dataset()) {
            case BYP -> projector.projectByp(
                    (BypSubmission) pdm.submission(),
                    pdm.districtName(),
                    pdm.subcountyName(),
                    pdm.parishName()
            );
            case IYP -> projector.projectIyp(
                    (IypSubmission) pdm.submission(),
                    pdm.districtName(),
                    pdm.subcountyName(),
                    pdm.parishName()
            );
            case LGO -> projector.projectLgo(
                    (LgoSubmission) pdm.submission(),
                    pdm.districtName(),
                    pdm.subcountyName(),
                    pdm.parishName()
            );
            case PC -> projector.projectPc(
                    (PcSubmission) pdm.submission(),
                    pdm.districtName(),
                    pdm.subcountyName(),
                    pdm.parishName()
            );
            case LGO_BUDGET_ALLOCATION, BUDGET_PRIORITIES -> throw new IllegalStateException(
                    "PDM form record cannot carry dataset " + pdm.dataset()
            );
        };
    }

    private DashboardFilter toDashboardFilter(ToolDownloadDataset dataset, ToolFieldDataFilter filter) {
        FormType formType = catalogue.formType(dataset).orElse(null);
        return new DashboardFilter(
                filter.districtId(),
                filter.subcountyId(),
                filter.parishId(),
                formType,
                null,
                null,
                filter.gender(),
                filter.ageGroup(),
                null,
                filter.financialYearPeriod()
        );
    }
}
