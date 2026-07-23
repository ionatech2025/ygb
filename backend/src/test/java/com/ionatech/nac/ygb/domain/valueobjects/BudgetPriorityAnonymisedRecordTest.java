package com.ionatech.nac.ygb.domain.valueobjects;

import com.ionatech.nac.ygb.domain.exceptions.PublicPiiExposureException;
import com.ionatech.nac.ygb.domain.service.AnonymisationProjector;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class BudgetPriorityAnonymisedRecordTest {

    private final AnonymisationProjector projector = new AnonymisationProjector();

    @Test
    void exportHeadersShouldNotExposePiiFieldNames() {
        assertThatCode(projector::assertBudgetPriorityExportHeadersSafe).doesNotThrowAnyException();
        assertThat(BudgetPriorityAnonymisedRecord.EXPORT_HEADERS)
                .doesNotContain("Full Name", "Phone", "Phone Number", "Respondent Name");
    }

    @Test
    void shouldRejectPiiLikeExportHeaderNames() {
        assertThatThrownBy(() -> projector.assertNoPiiJsonKeys(List.of("section", "phoneNumber")))
                .isInstanceOf(PublicPiiExposureException.class);
    }

    @Test
    void shouldRequireCoreNonPiiFields() {
        UUID id = UUID.randomUUID();
        UUID districtId = UUID.randomUUID();

        BudgetPriorityAnonymisedRecord record = new BudgetPriorityAnonymisedRecord(
                id,
                "health",
                "JAN_JUN_2026",
                districtId,
                "Kampala",
                "FEMALE",
                "AGE_20_24",
                "PRIMARY_HEALTH_CARE, MATERNAL_HEALTH",
                LocalDateTime.of(2026, 3, 15, 10, 0)
        );

        assertThat(record.id()).isEqualTo(id);
        assertThat(record.section()).isEqualTo("health");
        assertThat(record.priorityAreas()).contains("PRIMARY_HEALTH_CARE");
    }
}
