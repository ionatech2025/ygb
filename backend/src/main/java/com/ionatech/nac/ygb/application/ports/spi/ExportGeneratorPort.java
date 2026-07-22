package com.ionatech.nac.ygb.application.ports.spi;

import com.ionatech.nac.ygb.domain.valueobjects.DashboardAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.ExportFormat;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionSummary;

import java.io.OutputStream;
import java.util.function.Consumer;

public interface ExportGeneratorPort {

    void writeExport(
            ExportFormat format,
            DashboardFilter filter,
            DashboardAggregates aggregates,
            OutputStream output,
            Consumer<Consumer<SubmissionSummary>> summaryStream
    );
}
