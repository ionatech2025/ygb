package com.ionatech.nac.ygb.adapters.out.export;

import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfContentByte;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPCellEvent;
import com.lowagie.text.pdf.PdfPTable;

import java.awt.Color;
import java.util.List;

final class VerticalBarChartCellEvent implements PdfPCellEvent {

    private static final float PADDING = 14f;
    private static final float LABEL_HEIGHT = 30f;

    private final List<ReportLabelCount> rows;
    private final Color seriesColor;

    VerticalBarChartCellEvent(List<ReportLabelCount> rows, Color seriesColor) {
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
        float plotLeft = position.getLeft() + PADDING;
        float plotRight = position.getRight() - PADDING;
        float plotBottom = position.getBottom() + PADDING + LABEL_HEIGHT;
        float plotTop = position.getTop() - PADDING;
        float plotWidth = plotRight - plotLeft;
        float plotHeight = plotTop - plotBottom;
        long maxCount = Math.max(1L, rows.stream().mapToLong(ReportLabelCount::count).max().orElse(1L));
        float slotWidth = plotWidth / rows.size();

        canvas.saveState();
        canvas.setColorStroke(PdfReportTheme.TABLE_BORDER);
        canvas.setLineWidth(0.5f);
        for (int tick = 0; tick <= 4; tick++) {
            float y = plotBottom + (plotHeight * tick / 4f);
            canvas.moveTo(plotLeft, y);
            canvas.lineTo(plotRight, y);
            canvas.stroke();
        }

        canvas.setColorFill(seriesColor);
        for (int index = 0; index < rows.size(); index++) {
            ReportLabelCount row = rows.get(index);
            float barWidth = slotWidth * 0.62f;
            float x = plotLeft + index * slotWidth + (slotWidth - barWidth) / 2f;
            float barHeight = plotHeight * row.count() / maxCount;
            canvas.rectangle(x, plotBottom, barWidth, barHeight);
            canvas.fill();
        }
        canvas.restoreState();

        drawLabels(textCanvas, plotLeft, plotBottom, slotWidth);
    }

    private void drawLabels(PdfContentByte canvas, float plotLeft, float plotBottom, float slotWidth) {
        try {
            BaseFont font = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
            canvas.saveState();
            canvas.setColorFill(PdfReportTheme.MUTED_TEXT);
            for (int index = 0; index < rows.size(); index++) {
                String label = ReportChartDataPreparer.truncate(rows.get(index).label(), 10);
                float x = plotLeft + index * slotWidth + slotWidth / 2f;
                canvas.beginText();
                canvas.setFontAndSize(font, 7);
                canvas.showTextAligned(PdfContentByte.ALIGN_CENTER, label, x, plotBottom - 12f, 55);
                canvas.endText();
            }
            canvas.restoreState();
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to draw chart labels.", ex);
        }
    }
}
