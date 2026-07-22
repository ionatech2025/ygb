package com.ionatech.nac.ygb.adapters.out.export;

import com.ionatech.nac.ygb.domain.valueobjects.SubmissionSummary;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.OutputStream;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.function.Consumer;

@Component
public class ExcelExportWriter {

    void write(OutputStream output, Consumer<Consumer<SubmissionSummary>> summaryStream) throws IOException {
        try (SXSSFWorkbook workbook = new SXSSFWorkbook(100)) {
            Sheet sheet = workbook.createSheet("Submissions");
            CreationHelper creationHelper = workbook.getCreationHelper();
            CellStyle dateTimeStyle = workbook.createCellStyle();
            dateTimeStyle.setDataFormat(creationHelper.createDataFormat().getFormat("yyyy-mm-dd hh:mm:ss"));

            Row headerRow = sheet.createRow(0);
            for (int column = 0; column < SubmissionExportColumns.HEADERS.length; column++) {
                headerRow.createCell(column).setCellValue(SubmissionExportColumns.HEADERS[column]);
            }

            final int[] rowIndex = {1};
            summaryStream.accept(summary -> {
                Row row = sheet.createRow(rowIndex[0]++);
                writeRow(row, summary, dateTimeStyle);
            });

            workbook.write(output);
            workbook.dispose();
        }
    }

    private void writeRow(Row row, SubmissionSummary summary, CellStyle dateTimeStyle) {
        row.createCell(0).setCellValue(summary.id().toString());
        row.createCell(1).setCellValue(summary.formType().name());
        row.createCell(2).setCellValue(summary.respondentName());
        row.createCell(3).setCellValue(summary.districtName());
        row.createCell(4).setCellValue(summary.collectorName());
        setDateTimeCell(row.createCell(5), summary.formCompletedAt(), dateTimeStyle);
        if (summary.syncedAt() != null) {
            setDateTimeCell(row.createCell(6), summary.syncedAt(), dateTimeStyle);
        } else {
            row.createCell(6).setBlank();
        }
        row.createCell(7).setCellValue(summary.status());
        row.createCell(8).setCellValue(summary.financialYearPeriod());
    }

    private void setDateTimeCell(Cell cell, LocalDateTime value, CellStyle dateTimeStyle) {
        Date date = Date.from(value.atZone(ZoneId.systemDefault()).toInstant());
        cell.setCellValue(date);
        cell.setCellStyle(dateTimeStyle);
    }
}
