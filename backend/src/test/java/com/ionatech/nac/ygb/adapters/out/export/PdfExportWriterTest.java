package com.ionatech.nac.ygb.adapters.out.export;

import com.ionatech.nac.ygb.application.ports.spi.DownloadUsageAnalyticsRepositoryPort;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.valueobjects.AgeGroupCount;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.DatasetDownloadCount;
import com.ionatech.nac.ygb.domain.valueobjects.DistrictCount;
import com.ionatech.nac.ygb.domain.valueobjects.DownloadUsageAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.DownloadUsageFilter;
import com.ionatech.nac.ygb.domain.valueobjects.FormTypeCount;
import com.ionatech.nac.ygb.domain.valueobjects.GenderCount;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesGranularity;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesPoint;
import com.ionatech.nac.ygb.domain.valueobjects.VisitsVsDownloadsComparison;
import com.ionatech.nac.ygb.domain.valueobjects.VisitsVsDownloadsPoint;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PdfExportWriterTest {

    @Mock
    private DownloadUsageAnalyticsRepositoryPort downloadUsageAnalyticsRepository;

    private PdfExportWriter writer;

    @BeforeEach
    void setUp() {
        writer = new PdfExportWriter(
                new AdminDashboardReportAssembler(),
                new PdfVectorChartRenderer(),
                downloadUsageAnalyticsRepository
        );
        when(downloadUsageAnalyticsRepository.getDownloadUsageAggregates(any(DownloadUsageFilter.class), eq(TimeSeriesGranularity.DAY)))
                .thenReturn(sampleDownloadUsage());
        when(downloadUsageAnalyticsRepository.getVisitsVsDownloads(any(DownloadUsageFilter.class), eq(TimeSeriesGranularity.DAY)))
                .thenReturn(sampleVisitsVsDownloads());
    }

    @Test
    void writeProducesMultiPageReportWithExpectedSections() throws Exception {
        DashboardAggregates aggregates = sampleAggregates();
        ByteArrayOutputStream output = new ByteArrayOutputStream();

        writer.write(output, DashboardFilter.empty(), aggregates);

        byte[] pdfBytes = output.toByteArray();
        assertTrue(pdfBytes.length > 8_000);

        try (PDDocument document = Loader.loadPDF(pdfBytes)) {
            assertTrue(document.getNumberOfPages() >= 4);
            String text = new PDFTextStripper().getText(document);
            assertTrue(text.contains("YGB Survey Dashboard Report"));
            assertTrue(text.contains("Executive Summary"));
            assertTrue(text.contains("Visual Overview"));
            assertTrue(text.contains("Detailed Breakdowns"));
            assertTrue(text.contains("By Form Type"));
            assertTrue(text.contains("By Gender"));
            assertTrue(text.contains("Top Districts"));
            assertTrue(text.contains("Youth Go Budget App"));
            assertTrue(text.contains("Open Data Usage"));
            assertTrue(text.contains("Unique site visitors"));
            assertTrue(text.contains("Unique downloaders"));
            assertTrue(text.contains("Downloads by Dataset"));
            assertTrue(text.contains("Budget Priorities"));
            assertTrue(text.contains("LGO Budget Allocation"));
            assertTrue(text.contains("Downloaders by Age Group"));
            assertFalse(text.contains("analyst@example.com"));
            assertFalse(text.contains("@fixture.test"));
            assertFalse(text.contains("Ada Lovelace"));
        }
    }

    private DownloadUsageAggregates sampleDownloadUsage() {
        return new DownloadUsageAggregates(
                4L,
                9L,
                List.of(new GenderCount("FEMALE", 3L), new GenderCount("MALE", 1L)),
                List.of(new AgeGroupCount("AGE_18_24", 2L), new AgeGroupCount("AGE_25_29", 2L)),
                List.of(
                        new DatasetDownloadCount("PDM", 5L),
                        new DatasetDownloadCount("BUDGET_PRIORITIES", 3L),
                        new DatasetDownloadCount("LGO_BUDGET_ALLOCATION", 1L)
                ),
                List.of(new TimeSeriesPoint(LocalDate.of(2026, 8, 4), 9L))
        );
    }

    private VisitsVsDownloadsComparison sampleVisitsVsDownloads() {
        return new VisitsVsDownloadsComparison(
                20L,
                4L,
                List.of(new VisitsVsDownloadsPoint(LocalDate.of(2026, 8, 4), 12L, 3L))
        );
    }

    private DashboardAggregates sampleAggregates() {
        return new DashboardAggregates(
                18,
                List.of(new DistrictCount("Kampala", UUID.randomUUID(), 12)),
                List.of(new GenderCount("MALE", 10), new GenderCount("FEMALE", 8)),
                List.of(
                        new TimeSeriesPoint(LocalDate.of(2026, 3, 1), 4),
                        new TimeSeriesPoint(LocalDate.of(2026, 3, 8), 14)
                ),
                List.of(new FormTypeCount(FormType.BYP, 10), new FormTypeCount(FormType.PC, 8)),
                List.of()
        );
    }
}
