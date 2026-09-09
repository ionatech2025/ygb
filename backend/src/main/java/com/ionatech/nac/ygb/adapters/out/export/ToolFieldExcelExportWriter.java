package com.ionatech.nac.ygb.adapters.out.export;

import com.ionatech.nac.ygb.domain.valueobjects.ToolFieldExportRow;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

@Component
public class ToolFieldExcelExportWriter {

    void write(OutputStream output, List<ToolFieldExportRow> rows) throws IOException {
        try (SXSSFWorkbook workbook = new SXSSFWorkbook(100)) {
            Sheet sheet = workbook.createSheet("Tool Field Data");
            List<String> headers = ToolFieldCsvExportWriter.resolveHeaders(rows);
            Row headerRow = sheet.createRow(0);
            for (int column = 0; column < headers.size(); column++) {
                headerRow.createCell(column).setCellValue(headers.get(column));
            }
            int rowIndex = 1;
            for (ToolFieldExportRow exportRow : rows) {
                Row row = sheet.createRow(rowIndex++);
                for (int column = 0; column < headers.size(); column++) {
                    String value = exportRow.get(headers.get(column));
                    if (value == null || value.isBlank()) {
                        row.createCell(column).setBlank();
                    } else {
                        row.createCell(column).setCellValue(value);
                    }
                }
            }
            workbook.write(output);
            workbook.dispose();
        }
    }
}
