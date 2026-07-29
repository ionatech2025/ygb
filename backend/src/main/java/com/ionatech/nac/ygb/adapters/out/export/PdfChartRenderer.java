package com.ionatech.nac.ygb.adapters.out.export;

import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.axis.CategoryAxis;
import org.jfree.chart.axis.NumberAxis;
import org.jfree.chart.plot.CategoryPlot;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.chart.renderer.category.BarRenderer;
import org.jfree.chart.renderer.category.StandardBarPainter;
import org.jfree.data.category.DefaultCategoryDataset;
import org.jfree.data.general.DefaultPieDataset;
import org.springframework.stereotype.Component;

import java.awt.Color;
import java.awt.Font;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import javax.imageio.ImageIO;

@Component
public class PdfChartRenderer {

    private static final int CHART_WIDTH = 460;
    private static final int CHART_HEIGHT = 260;

    byte[] createSubmissionsOverTimeChart(List<ReportLabelCount> points) throws IOException {
        return createVerticalBarChart("Submissions Over Time", points, PdfReportTheme.BRAND_GREEN);
    }

    byte[] createFormTypePieChart(List<ReportLabelCount> rows) throws IOException {
        DefaultPieDataset<String> dataset = new DefaultPieDataset<>();
        for (ReportLabelCount row : rows) {
            dataset.setValue(row.label(), row.count());
        }
        JFreeChart chart = ChartFactory.createPieChart("Submissions by Form Type", dataset, true, false, false);
        chart.setBackgroundPaint(Color.WHITE);
        chart.getTitle().setFont(new Font(Font.SANS_SERIF, Font.BOLD, 14));
        return toPng(chart);
    }

    byte[] createGenderBarChart(List<ReportLabelCount> rows) throws IOException {
        return createVerticalBarChart("Submissions by Gender", rows, PdfReportTheme.BRAND_BLUE);
    }

    byte[] createTopDistrictsChart(List<ReportLabelCount> rows) throws IOException {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();
        for (ReportLabelCount row : rows) {
            dataset.addValue(row.count(), "Submissions", row.label());
        }
        JFreeChart chart = ChartFactory.createBarChart(
                "Top Districts",
                "District",
                "Count",
                dataset,
                PlotOrientation.HORIZONTAL,
                false,
                false,
                false
        );
        styleCategoryPlot(chart, PdfReportTheme.BRAND_ORANGE);
        return toPng(chart);
    }

    private byte[] createVerticalBarChart(String title, List<ReportLabelCount> rows, Color color) throws IOException {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();
        for (ReportLabelCount row : rows) {
            dataset.addValue(row.count(), "Count", row.label());
        }
        JFreeChart chart = ChartFactory.createBarChart(
                title,
                "Category",
                "Count",
                dataset,
                PlotOrientation.VERTICAL,
                false,
                false,
                false
        );
        styleCategoryPlot(chart, color);
        return toPng(chart);
    }

    private void styleCategoryPlot(JFreeChart chart, Color seriesColor) {
        chart.setBackgroundPaint(Color.WHITE);
        chart.getTitle().setFont(new Font(Font.SANS_SERIF, Font.BOLD, 14));
        CategoryPlot plot = chart.getCategoryPlot();
        plot.setBackgroundPaint(Color.WHITE);
        plot.setOutlineVisible(false);
        plot.setRangeGridlinePaint(PdfReportTheme.TABLE_BORDER);
        CategoryAxis domainAxis = plot.getDomainAxis();
        domainAxis.setTickLabelFont(new Font(Font.SANS_SERIF, Font.PLAIN, 9));
        NumberAxis rangeAxis = (NumberAxis) plot.getRangeAxis();
        rangeAxis.setTickLabelFont(new Font(Font.SANS_SERIF, Font.PLAIN, 9));
        BarRenderer renderer = (BarRenderer) plot.getRenderer();
        renderer.setSeriesPaint(0, seriesColor);
        renderer.setBarPainter(new StandardBarPainter());
        renderer.setDrawBarOutline(false);
    }

    private byte[] toPng(JFreeChart chart) throws IOException {
        BufferedImage image = chart.createBufferedImage(CHART_WIDTH, CHART_HEIGHT);
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        ImageIO.write(image, "png", output);
        return output.toByteArray();
    }
}
