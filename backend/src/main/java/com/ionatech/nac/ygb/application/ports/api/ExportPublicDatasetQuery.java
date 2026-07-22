package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.ExportFormat;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDashboardFilter;

import java.io.OutputStream;

public interface ExportPublicDatasetQuery {
    void export(PublicDashboardFilter filter, ExportFormat format, OutputStream output);
}
