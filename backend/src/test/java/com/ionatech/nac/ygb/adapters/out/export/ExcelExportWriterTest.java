package com.ionatech.nac.ygb.adapters.out.export;

import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.valueobjects.AgeGroup;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionSummary;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertTrue;

class ExcelExportWriterTest {

    @Test
    void writeProducesOpenableWorkbook() throws Exception {
        ExcelExportWriter writer = new ExcelExportWriter();
        ByteArrayOutputStream output = new ByteArrayOutputStream();

        writer.write(output, rowConsumer -> {
            rowConsumer.accept(sampleSummary("Jane Doe", "Default Collector"));
            rowConsumer.accept(sampleSummary("John Doe", "Default Collector"));
        });

        byte[] bytes = output.toByteArray();
        assertTrue(bytes.length > 100);

        try (var workbook = WorkbookFactory.create(new ByteArrayInputStream(bytes))) {
            assertTrue(workbook.getSheetAt(0).getPhysicalNumberOfRows() >= 3);
        }
    }

    private SubmissionSummary sampleSummary(String respondent, String collector) {
        return new SubmissionSummary(
                UUID.randomUUID(),
                FormType.BYP,
                respondent,
                UUID.randomUUID(),
                "Kampala",
                UUID.randomUUID(),
                collector,
                LocalDateTime.of(2026, 3, 15, 10, 0),
                LocalDateTime.of(2026, 3, 15, 10, 5),
                "SYNCED",
                "JAN_JUN_2026"
        );
    }
}
