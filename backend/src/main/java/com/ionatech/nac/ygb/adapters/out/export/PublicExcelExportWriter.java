package com.ionatech.nac.ygb.adapters.out.export;

import com.ionatech.nac.ygb.domain.valueobjects.PublicAnonymisedRecord;
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
public class PublicExcelExportWriter {

    void write(OutputStream output, Consumer<Consumer<PublicAnonymisedRecord>> recordStream) throws IOException {
        try (SXSSFWorkbook workbook = new SXSSFWorkbook(100)) {
            Sheet sheet = workbook.createSheet("Public Dataset");
            CreationHelper creationHelper = workbook.getCreationHelper();
            CellStyle dateTimeStyle = workbook.createCellStyle();
            dateTimeStyle.setDataFormat(creationHelper.createDataFormat().getFormat("yyyy-mm-dd hh:mm:ss"));

            Row headerRow = sheet.createRow(0);
            for (int column = 0; column < PublicExportColumns.HEADERS.length; column++) {
                headerRow.createCell(column).setCellValue(PublicExportColumns.HEADERS[column]);
            }

            final int[] rowIndex = {1};
            recordStream.accept(record -> {
                Row row = sheet.createRow(rowIndex[0]++);
                writeRow(row, record, dateTimeStyle);
            });

            workbook.write(output);
            workbook.dispose();
        }
    }

    private void writeRow(Row row, PublicAnonymisedRecord record, CellStyle dateTimeStyle) {
        row.createCell(0).setCellValue(record.id().toString());
        row.createCell(1).setCellValue(record.formType().name());
        row.createCell(2).setCellValue(record.districtId().toString());
        row.createCell(3).setCellValue(record.districtName());
        setOptionalStringCell(row.createCell(4), record.gender());
        setOptionalStringCell(row.createCell(5), record.ageGroup());
        setDateTimeCell(row.createCell(6), record.formCompletedAt(), dateTimeStyle);
        row.createCell(7).setCellValue(record.status());
        row.createCell(8).setCellValue(record.financialYearPeriod());
    }

    private static void setOptionalStringCell(Cell cell, String value) {
        if (value == null || value.isBlank()) {
            cell.setBlank();
        } else {
            cell.setCellValue(value);
        }
    }

    private void setDateTimeCell(Cell cell, LocalDateTime value, CellStyle dateTimeStyle) {
        Date date = Date.from(value.atZone(ZoneId.systemDefault()).toInstant());
        cell.setCellValue(date);
        cell.setCellStyle(dateTimeStyle);
    }
}
