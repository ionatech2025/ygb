package com.ionatech.nac.ygb.adapters.out.export;

import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfContentByte;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPCellEvent;
import com.lowagie.text.pdf.PdfPTable;

import java.awt.Color;
import java.util.List;

final class HorizontalBarChartCellEvent implements PdfPCellEvent {

    private static final float PADDING = 14f;
    private static final float LABEL_WIDTH = 96f;
    private static final float ROW_HEIGHT = 22f;

    private final List<ReportLabelCount> rows;
    private final Color seriesColor;

    HorizontalBarChartCellEvent(List<ReportLabelCount> rows, Color seriesColor) {
        this.rows = List.copyOf(rows);
        this.seriesColor = seriesColor;
    }

    @Override
    public void cellLayout(PdfPCell cell, Rectangle position, PdfContentByte[] canvases) {
        if (rows.isEmpty()) {
            return;
        }

        PdfContentByte canvas = canvases[PdfPTable.BACKGROUNDCANVAS];
        PdfContentByte textCanvas = canvases[PdfPTable.TEXTCANVAS];
        float plotLeft = position.getLeft() + PADDING + LABEL_WIDTH;
        float plotRight = position.getRight() - PADDING;
        float plotTop = position.getTop() - PADDING;
        float plotWidth = plotRight - plotLeft;
        long maxCount = Math.max(1L, rows.stream().mapToLong(ReportLabelCount::count).max().orElse(1L));

        try {
            BaseFont font = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
            canvas.saveState();
            for (int index = 0; index < rows.size(); index++) {
                ReportLabelCount row = rows.get(index);
                float rowTop = plotTop - index * ROW_HEIGHT;
                float rowBottom = rowTop - ROW_HEIGHT;
                float barWidth = plotWidth * row.count() / maxCount;

                canvas.setColorFill(PdfReportTheme.TABLE_STRIPE);
                canvas.rectangle(plotLeft, rowBottom + 4f, plotWidth, ROW_HEIGHT - 8f);
                canvas.fill();

                canvas.setColorFill(seriesColor);
                canvas.rectangle(plotLeft, rowBottom + 4f, barWidth, ROW_HEIGHT - 8f);
                canvas.fill();
            }
            canvas.restoreState();

            textCanvas.saveState();
            for (int index = 0; index < rows.size(); index++) {
                ReportLabelCount row = rows.get(index);
                float rowTop = plotTop - index * ROW_HEIGHT;
                float rowBottom = rowTop - ROW_HEIGHT;
                float barWidth = plotWidth * row.count() / maxCount;

                textCanvas.beginText();
                textCanvas.setFontAndSize(font, 8);
                textCanvas.setColorFill(PdfReportTheme.BODY_TEXT);
                textCanvas.showTextAligned(
                        PdfContentByte.ALIGN_RIGHT,
                        ReportChartDataPreparer.truncate(row.label(), 16),
                        plotLeft - 6f,
                        rowBottom + 8f,
                        0
                );
                textCanvas.endText();

                textCanvas.beginText();
                textCanvas.setFontAndSize(font, 8);
                textCanvas.setColorFill(PdfReportTheme.MUTED_TEXT);
                textCanvas.showTextAligned(
                        PdfContentByte.ALIGN_LEFT,
                        Long.toString(row.count()),
                        plotLeft + barWidth + 4f,
                        rowBottom + 8f,
                        0
                );
                textCanvas.endText();
            }
            textCanvas.restoreState();
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to draw horizontal chart.", ex);
        }
    }
}
