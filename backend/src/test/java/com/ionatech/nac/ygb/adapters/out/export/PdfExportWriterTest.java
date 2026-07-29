package com.ionatech.nac.ygb.adapters.out.export;

import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.DistrictCount;
import com.ionatech.nac.ygb.domain.valueobjects.FormTypeCount;
import com.ionatech.nac.ygb.domain.valueobjects.GenderCount;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesPoint;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertTrue;

class PdfExportWriterTest {

    private final PdfExportWriter writer = new PdfExportWriter(
            new AdminDashboardReportAssembler(),
            new PdfVectorChartRenderer()
    );

    @Test
    void writeProducesMultiPageReportWithExpectedSections() throws Exception {
        DashboardAggregates aggregates = sampleAggregates();
        ByteArrayOutputStream output = new ByteArrayOutputStream();

        writer.write(output, DashboardFilter.empty(), aggregates);

        byte[] pdfBytes = output.toByteArray();
        assertTrue(pdfBytes.length > 8_000);

        try (PDDocument document = Loader.loadPDF(pdfBytes)) {
            assertTrue(document.getNumberOfPages() >= 3);
            String text = new PDFTextStripper().getText(document);
            assertTrue(text.contains("YGB Survey Dashboard Report"));
            assertTrue(text.contains("Executive Summary"));
            assertTrue(text.contains("Visual Overview"));
            assertTrue(text.contains("Detailed Breakdowns"));
            assertTrue(text.contains("By Form Type"));
            assertTrue(text.contains("By Gender"));
            assertTrue(text.contains("Top Districts"));
            assertTrue(text.contains("Youth Go Budget App"));
        }
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
