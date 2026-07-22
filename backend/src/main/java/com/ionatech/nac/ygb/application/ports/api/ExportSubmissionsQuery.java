package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.ExportFormat;

import java.io.OutputStream;

public interface ExportSubmissionsQuery {
    void export(DashboardFilter filter, ExportFormat format, OutputStream output);
}
