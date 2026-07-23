package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.LgoBudgetAllocationDashboardFilter;

import java.io.OutputStream;

public interface ExportLgoBudgetAllocationDatasetUseCase {

    void export(LgoBudgetAllocationDashboardFilter filter, OutputStream output);
}
