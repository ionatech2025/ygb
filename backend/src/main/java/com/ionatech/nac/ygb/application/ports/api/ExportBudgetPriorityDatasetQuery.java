package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityDashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.ExportFormat;

import java.io.OutputStream;

public interface ExportBudgetPriorityDatasetQuery {
    void export(BudgetPriorityDashboardFilter filter, ExportFormat format, OutputStream output);
}
