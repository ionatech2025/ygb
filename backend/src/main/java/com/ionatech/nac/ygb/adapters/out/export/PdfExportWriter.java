package com.ionatech.nac.ygb.adapters.out.export;

import com.ionatech.nac.ygb.domain.valueobjects.DashboardAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Image;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.awt.Color;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class PdfExportWriter {

    private final AdminDashboardReportAssembler reportAssembler;
    private final PdfVectorChartRenderer chartRenderer;

    public PdfExportWriter(AdminDashboardReportAssembler reportAssembler, PdfVectorChartRenderer chartRenderer) {
        this.reportAssembler = reportAssembler;
        this.chartRenderer = chartRenderer;
    }

    void write(OutputStream output, DashboardFilter filter, DashboardAggregates aggregates) throws DocumentException, IOException {
        AdminDashboardReportModel report = reportAssembler.assemble(filter, aggregates, LocalDateTime.now());
        Document document = new Document(PageSize.A4, 42, 42, 48, 48);
        PdfWriter writer = PdfWriter.getInstance(document, output);
        writer.setPageEvent(new PdfReportFooterEvent());
        document.open();

        addCoverPage(document, report);
        document.newPage();
        addExecutiveSummary(document, report);
        document.newPage();
        addChartsSection(document, report);
        document.newPage();
        addBreakdownTables(document, report);

        document.close();
    }

    private void addCoverPage(Document document, AdminDashboardReportModel report) throws DocumentException, IOException {
        addBrandHeaderBand(document);

        Image logo = loadLogo();
        if (logo != null) {
            logo.scaleToFit(72, 72);
            logo.setAlignment(Element.ALIGN_LEFT);
            document.add(logo);
            document.add(new Paragraph(" "));
        }

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, PdfReportTheme.BODY_TEXT);
        Paragraph title = new Paragraph("YGB Survey Dashboard Report", titleFont);
        title.setSpacingAfter(12);
        document.add(title);

        Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 12, PdfReportTheme.MUTED_TEXT);
        document.add(new Paragraph("Parish Development Model field data summary", subtitleFont));
        document.add(new Paragraph(" "));

        document.add(infoPanel("Applied filters", report.filterDescription()));
        document.add(new Paragraph(" "));
        document.add(infoPanel("Generated at", report.generatedAtLabel()));
    }

    private void addExecutiveSummary(Document document, AdminDashboardReportModel report) throws DocumentException {
        document.add(sectionHeading("Executive Summary"));
        document.add(new Paragraph(" ", bodyFont()));

        PdfPTable kpiTable = new PdfPTable(3);
        kpiTable.setWidthPercentage(100);
        kpiTable.setSpacingBefore(8);
        addKpiCell(kpiTable, "Total submissions", Long.toString(report.totalSubmissions()), PdfReportTheme.BRAND_GREEN);
        addKpiCell(kpiTable, "Districts represented", Integer.toString(report.districtsRepresented()), PdfReportTheme.BRAND_BLUE);
        addKpiCell(kpiTable, "Form types represented", Integer.toString(report.formTypesRepresented()), PdfReportTheme.BRAND_ORANGE);
        document.add(kpiTable);
    }

    private void addChartsSection(Document document, AdminDashboardReportModel report) throws DocumentException {
        document.add(sectionHeading("Visual Overview"));
        document.add(new Paragraph(" ", bodyFont()));

        if (!report.submissionsOverTime().isEmpty()) {
            document.add(chartRenderer.createSubmissionsOverTimeChart(report.submissionsOverTime()));
        }
        if (!report.formTypes().isEmpty()) {
            document.add(chartRenderer.createFormTypeChart(report.formTypes()));
        }
        if (!report.genders().isEmpty()) {
            document.add(chartRenderer.createGenderChart(report.genders()));
        }
        if (!report.topDistricts().isEmpty()) {
            document.add(chartRenderer.createTopDistrictsChart(report.topDistricts()));
        }
    }

    private void addBreakdownTables(Document document, AdminDashboardReportModel report) throws DocumentException {
        document.add(sectionHeading("Detailed Breakdowns"));
        document.add(new Paragraph(" ", bodyFont()));

        addBreakdownTable(document, "By Form Type", report.formTypes(), PdfReportTheme.BRAND_GREEN);
        addBreakdownTable(document, "By Gender", report.genders(), PdfReportTheme.BRAND_BLUE);
        addBreakdownTable(document, "Top Districts", report.topDistricts(), PdfReportTheme.BRAND_ORANGE);
        if (!report.financialYearPeriods().isEmpty()) {
            addBreakdownTable(document, "By Financial Year Period", report.financialYearPeriods(), PdfReportTheme.BRAND_GREEN);
        }
    }

    private void addBreakdownTable(
            Document document,
            String title,
            List<ReportLabelCount> rows,
            Color accent
    ) throws DocumentException {
        document.add(subsectionHeading(title));
        PdfPTable table = new PdfPTable(new float[] { 3f, 1f });
        table.setWidthPercentage(100);
        table.setSpacingBefore(6);
        table.setSpacingAfter(14);
        addHeaderCell(table, "Category", accent);
        addHeaderCell(table, "Count", accent);
        boolean stripe = false;
        for (ReportLabelCount row : rows) {
            addBodyCell(table, row.label(), stripe);
            addBodyCell(table, Long.toString(row.count()), stripe);
            stripe = !stripe;
        }
        document.add(table);
    }

    private PdfPTable infoPanel(String label, String value) throws DocumentException {
        PdfPTable table = new PdfPTable(1);
        table.setWidthPercentage(100);
        PdfPCell labelCell = new PdfPCell(new Phrase(label, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, PdfReportTheme.MUTED_TEXT)));
        labelCell.setBorder(Rectangle.NO_BORDER);
        labelCell.setPaddingBottom(4);
        table.addCell(labelCell);
        PdfPCell valueCell = new PdfPCell(new Phrase(value, FontFactory.getFont(FontFactory.HELVETICA, 11, PdfReportTheme.BODY_TEXT)));
        valueCell.setBackgroundColor(PdfReportTheme.TABLE_STRIPE);
        valueCell.setBorderColor(PdfReportTheme.TABLE_BORDER);
        valueCell.setPadding(10);
        table.addCell(valueCell);
        return table;
    }

    private void addBrandHeaderBand(Document document) throws DocumentException {
        PdfPTable band = new PdfPTable(1);
        band.setWidthPercentage(100);
        PdfPCell cell = new PdfPCell(new Phrase("Youth Go Budget App", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, PdfReportTheme.HEADER_TEXT)));
        cell.setBackgroundColor(PdfReportTheme.BRAND_GREEN);
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setPadding(10);
        band.addCell(cell);
        band.setSpacingAfter(18);
        document.add(band);
    }

    private void addKpiCell(PdfPTable table, String label, String value, Color accent) {
        PdfPCell cell = new PdfPCell();
        cell.setBorderColor(PdfReportTheme.TABLE_BORDER);
        cell.setPadding(12);
        cell.addElement(new Phrase(label, FontFactory.getFont(FontFactory.HELVETICA, 9, PdfReportTheme.MUTED_TEXT)));
        cell.addElement(new Phrase(value, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, accent)));
        table.addCell(cell);
    }

    private void addHeaderCell(PdfPTable table, String text, Color background) {
        PdfPCell cell = new PdfPCell(new Phrase(text, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, PdfReportTheme.HEADER_TEXT)));
        cell.setBackgroundColor(background);
        cell.setHorizontalAlignment(Element.ALIGN_LEFT);
        cell.setPadding(8);
        cell.setBorderColor(PdfReportTheme.TABLE_BORDER);
        table.addCell(cell);
    }

    private void addBodyCell(PdfPTable table, String text, boolean stripe) {
        PdfPCell cell = new PdfPCell(new Phrase(text, bodyFont()));
        cell.setPadding(8);
        cell.setBorderColor(PdfReportTheme.TABLE_BORDER);
        if (stripe) {
            cell.setBackgroundColor(PdfReportTheme.TABLE_STRIPE);
        }
        table.addCell(cell);
    }

    private Paragraph sectionHeading(String text) {
        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, PdfReportTheme.BRAND_GREEN);
        Paragraph paragraph = new Paragraph(text, font);
        paragraph.setSpacingAfter(4);
        return paragraph;
    }

    private Paragraph subsectionHeading(String text) {
        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, PdfReportTheme.BODY_TEXT);
        return new Paragraph(text, font);
    }

    private Font bodyFont() {
        return FontFactory.getFont(FontFactory.HELVETICA, 10, PdfReportTheme.BODY_TEXT);
    }

    private Image loadLogo() {
        try (InputStream input = new ClassPathResource("export/ygb-logo.png").getInputStream()) {
            return Image.getInstance(input.readAllBytes());
        } catch (Exception ex) {
            return null;
        }
    }
}
