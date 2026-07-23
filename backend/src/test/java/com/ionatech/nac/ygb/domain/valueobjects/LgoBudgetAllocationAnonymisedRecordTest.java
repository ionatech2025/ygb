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

class LgoBudgetAllocationAnonymisedRecordTest {

    private final AnonymisationProjector projector = new AnonymisationProjector();

    @Test
    void exportHeadersShouldNotExposePiiFieldNames() {
        assertThatCode(projector::assertLgoBudgetAllocationExportHeadersSafe).doesNotThrowAnyException();
        assertThat(LgoBudgetAllocationAnonymisedRecord.EXPORT_HEADERS)
                .doesNotContain(
                        "Full Name",
                        "Phone",
                        "Phone Number",
                        "Respondent Name",
                        "Rationale",
                        "Recommendations",
                        "Collector ID"
                );
    }

    @Test
    void shouldRejectPiiLikeExportHeaderNames() {
        assertThatThrownBy(() -> projector.assertNoPiiJsonKeys(List.of("district", "phoneNumber")))
                .isInstanceOf(PublicPiiExposureException.class);
    }

    @Test
    void shouldRequireCoreNonPiiFields() {
        UUID id = UUID.randomUUID();
        UUID districtId = UUID.randomUUID();

        LgoBudgetAllocationAnonymisedRecord record = new LgoBudgetAllocationAnonymisedRecord(
                id,
                "JAN_JUN_2026",
                districtId,
                "Kampala",
                "FEMALE",
                "AGE_30_AND_ABOVE",
                "{\"health\":{\"amount\":1200000}}",
                LocalDateTime.of(2026, 3, 15, 10, 0)
        );

        assertThat(record.id()).isEqualTo(id);
        assertThat(record.financialYearPeriod()).isEqualTo("JAN_JUN_2026");
        assertThat(record.previousFyAllocations()).contains("health");
    }
}
