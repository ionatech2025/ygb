package com.ionatech.nac.ygb.adapters.out.export;

import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import org.springframework.stereotype.Component;

import java.awt.Color;
import java.util.List;

@Component
public class PdfVectorChartRenderer {

    private static final float VERTICAL_CHART_HEIGHT = 220f;
    private static final float HORIZONTAL_ROW_HEIGHT = 22f;

    PdfPTable createSubmissionsOverTimeChart(List<ReportLabelCount> points) throws DocumentException {
        return createVerticalBarChart(
                "Submissions Over Time",
                ReportChartDataPreparer.prepareTimeSeries(points),
                PdfReportTheme.BRAND_GREEN
        );
    }

    PdfPTable createFormTypeChart(List<ReportLabelCount> rows) throws DocumentException {
        return createHorizontalBarChart(
                "Submissions by Form Type",
                rows,
                PdfReportTheme.BRAND_GREEN
        );
    }

    PdfPTable createGenderChart(List<ReportLabelCount> rows) throws DocumentException {
        return createVerticalBarChart("Submissions by Gender", rows, PdfReportTheme.BRAND_BLUE);
    }

    PdfPTable createTopDistrictsChart(List<ReportLabelCount> rows) throws DocumentException {
        return createHorizontalBarChart(
                "Top Districts",
                ReportChartDataPreparer.limitRows(rows, ReportChartDataPreparer.MAX_HORIZONTAL_ROWS),
                PdfReportTheme.BRAND_ORANGE
        );
    }

    PdfPTable createDownloadsByDatasetChart(List<ReportLabelCount> rows) throws DocumentException {
        return createHorizontalBarChart(
                "Public Downloads by Dataset",
                rows,
                PdfReportTheme.BRAND_GREEN
        );
    }

    PdfPTable createDownloadsOverTimeChart(List<ReportLabelCount> points) throws DocumentException {
        return createVerticalBarChart(
                "Public Downloads Over Time",
                ReportChartDataPreparer.prepareTimeSeries(points),
                PdfReportTheme.BRAND_BLUE
        );
    }

    PdfPTable createDownloaderGenderChart(List<ReportLabelCount> rows) throws DocumentException {
        return createVerticalBarChart("Downloaders by Gender", rows, PdfReportTheme.BRAND_BLUE);
    }

    private PdfPTable createVerticalBarChart(String title, List<ReportLabelCount> rows, Color seriesColor)
            throws DocumentException {
        PdfPTable wrapper = chartWrapper(title);
        PdfPCell chartCell = new PdfPCell();
        chartCell.setBorder(Rectangle.BOX);
        chartCell.setBorderColor(PdfReportTheme.TABLE_BORDER);
        chartCell.setBackgroundColor(Color.WHITE);
        chartCell.setFixedHeight(VERTICAL_CHART_HEIGHT);
        chartCell.setCellEvent(new VerticalBarChartCellEvent(rows, seriesColor));
        wrapper.addCell(chartCell);
        return wrapper;
    }

    private PdfPTable createHorizontalBarChart(String title, List<ReportLabelCount> rows, Color seriesColor)
            throws DocumentException {
        PdfPTable wrapper = chartWrapper(title);
        float height = Math.max(90f, rows.size() * HORIZONTAL_ROW_HEIGHT + 28f);
        PdfPCell chartCell = new PdfPCell();
        chartCell.setBorder(Rectangle.BOX);
        chartCell.setBorderColor(PdfReportTheme.TABLE_BORDER);
        chartCell.setBackgroundColor(Color.WHITE);
        chartCell.setFixedHeight(height);
        chartCell.setCellEvent(new HorizontalBarChartCellEvent(rows, seriesColor));
        wrapper.addCell(chartCell);
        return wrapper;
    }

    private PdfPTable chartWrapper(String title) throws DocumentException {
        PdfPTable wrapper = new PdfPTable(1);
        wrapper.setWidthPercentage(100);
        wrapper.setSpacingAfter(14);

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, PdfReportTheme.BODY_TEXT);
        PdfPCell titleCell = new PdfPCell(new Phrase(title, titleFont));
        titleCell.setBorder(Rectangle.NO_BORDER);
        titleCell.setPaddingBottom(6);
        titleCell.setHorizontalAlignment(Element.ALIGN_LEFT);
        wrapper.addCell(titleCell);
        return wrapper;
    }
}
