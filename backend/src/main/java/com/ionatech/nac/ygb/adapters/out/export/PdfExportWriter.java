package com.ionatech.nac.ygb.adapters.out.export;

import com.ionatech.nac.ygb.domain.valueobjects.DashboardAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Component;

import java.io.OutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class PdfExportWriter {

    private static final DateTimeFormatter GENERATED_AT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    void write(
            OutputStream output,
            DashboardFilter filter,
            DashboardAggregates aggregates
    ) throws DocumentException {
        Document document = new Document();
        PdfWriter.getInstance(document, output);
        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
        Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
        Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 10);

        document.add(new Paragraph("YGB Submission Export Report", titleFont));
        document.add(new Paragraph("Generated at: " + GENERATED_AT.format(LocalDateTime.now()), bodyFont));
        document.add(new Paragraph("Filters: " + DashboardFilterDescriptionBuilder.describe(filter), bodyFont));
        document.add(new Paragraph(" "));

        document.add(new Paragraph("Summary Statistics", sectionFont));
        document.add(summaryTable(aggregates, bodyFont));

        document.add(new Paragraph(" "));
        document.add(new Paragraph("Breakdown by Form Type", sectionFont));
        document.add(breakdownTable(
                new String[]{"Form Type", "Count"},
                aggregates.byFormType().stream()
                        .map(row -> new String[]{row.formType().name(), Long.toString(row.count())})
                        .toList(),
                bodyFont
        ));

        document.add(new Paragraph(" "));
        document.add(new Paragraph("Breakdown by Gender", sectionFont));
        document.add(breakdownTable(
                new String[]{"Gender", "Count"},
                aggregates.byGender().stream()
                        .map(row -> new String[]{row.gender(), Long.toString(row.count())})
                        .toList(),
                bodyFont
        ));

        document.close();
    }

    private PdfPTable summaryTable(DashboardAggregates aggregates, Font bodyFont) {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        addRow(table, "Total Submissions", Long.toString(aggregates.totalSubmissions()), bodyFont);
        addRow(table, "Districts Represented", Integer.toString(aggregates.byDistrict().size()), bodyFont);
        addRow(table, "Form Types Represented", Integer.toString(aggregates.byFormType().size()), bodyFont);
        return table;
    }

    private PdfPTable breakdownTable(String[] headers, java.util.List<String[]> rows, Font bodyFont) {
        PdfPTable table = new PdfPTable(headers.length);
        table.setWidthPercentage(100);
        for (String header : headers) {
            PdfPCell headerCell = new PdfPCell(new Phrase(header, bodyFont));
            headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(headerCell);
        }
        for (String[] row : rows) {
            for (String value : row) {
                table.addCell(new Phrase(value, bodyFont));
            }
        }
        return table;
    }

    private void addRow(PdfPTable table, String label, String value, Font bodyFont) {
        table.addCell(new Phrase(label, bodyFont));
        table.addCell(new Phrase(value, bodyFont));
    }
}
