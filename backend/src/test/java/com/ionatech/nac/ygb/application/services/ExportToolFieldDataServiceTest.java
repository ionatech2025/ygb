package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.QueryToolFieldDataExport;
import com.ionatech.nac.ygb.application.ports.spi.ToolFieldExportGeneratorPort;
import com.ionatech.nac.ygb.domain.service.ToolDownloadCatalogue;
import com.ionatech.nac.ygb.domain.service.ToolFieldDataProjector;
import com.ionatech.nac.ygb.domain.valueobjects.ExportFormat;
import com.ionatech.nac.ygb.domain.valueobjects.ToolDownloadDataset;
import com.ionatech.nac.ygb.domain.valueobjects.ToolFieldDataFilter;
import com.ionatech.nac.ygb.domain.valueobjects.ToolFieldExportRow;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayOutputStream;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ExportToolFieldDataServiceTest {

    private QueryToolFieldDataExport queryToolFieldDataExport;
    private ToolFieldExportGeneratorPort exportGeneratorPort;
    private ExportToolFieldDataService service;

    @BeforeEach
    void setUp() {
        queryToolFieldDataExport = mock(QueryToolFieldDataExport.class);
        exportGeneratorPort = mock(ToolFieldExportGeneratorPort.class);
        ToolDownloadCatalogue catalogue = new ToolDownloadCatalogue();
        service = new ExportToolFieldDataService(
                queryToolFieldDataExport,
                exportGeneratorPort,
                new ToolFieldDataProjector(catalogue)
        );
    }

    @Test
    void shouldQueryThenWriteCsv() {
        LinkedHashMap<String, String> columns = new LinkedHashMap<>();
        columns.put("Dataset", "BYP");
        columns.put("District", "Kampala");
        columns.put("Money Used For", "farming inputs");
        List<ToolFieldExportRow> rows = List.of(new ToolFieldExportRow(columns));
        ToolFieldDataFilter filter = ToolFieldDataFilter.empty();
        when(queryToolFieldDataExport.query(ToolDownloadDataset.BYP, filter)).thenReturn(rows);
        ByteArrayOutputStream output = new ByteArrayOutputStream();

        service.export(ToolDownloadDataset.BYP, filter, ExportFormat.CSV, output);

        verify(queryToolFieldDataExport).query(ToolDownloadDataset.BYP, filter);
        verify(exportGeneratorPort).writeExport(eq(ExportFormat.CSV), eq(output), eq(rows));
    }

    @Test
    void shouldRejectPdf() {
        assertThatThrownBy(() -> service.export(
                ToolDownloadDataset.BYP,
                ToolFieldDataFilter.empty(),
                ExportFormat.PDF,
                new ByteArrayOutputStream()
        )).isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("CSV and Excel");
    }

    @Test
    void shouldRejectRowsThatReintroduceBlockedHeaders() {
        when(queryToolFieldDataExport.query(any(), any())).thenReturn(List.of(
                new ToolFieldExportRow(Map.of("Collector Name", "Alice"))
        ));

        assertThatThrownBy(() -> service.export(
                ToolDownloadDataset.BYP,
                ToolFieldDataFilter.empty(),
                ExportFormat.CSV,
                new ByteArrayOutputStream()
        )).isInstanceOf(com.ionatech.nac.ygb.domain.exceptions.PublicPiiExposureException.class);
    }
}
