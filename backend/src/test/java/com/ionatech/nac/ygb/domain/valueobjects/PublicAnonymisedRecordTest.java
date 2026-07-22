package com.ionatech.nac.ygb.domain.valueobjects;

import com.ionatech.nac.ygb.domain.exceptions.PublicPiiExposureException;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.service.AnonymisationProjector;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class PublicAnonymisedRecordTest {

    private final AnonymisationProjector projector = new AnonymisationProjector();

    @Test
    void exportHeadersShouldNotExposePiiFieldNames() {
        assertThatCode(projector::assertExportHeadersSafe).doesNotThrowAnyException();
        assertThat(PublicAnonymisedRecord.EXPORT_HEADERS)
                .doesNotContain("Respondent Name", "Phone", "Collector", "Device Submission ID");
    }

    @Test
    void shouldRejectPiiLikeExportHeaderNames() {
        assertThatThrownBy(() -> projector.assertNoPiiJsonKeys(List.of("respondentName")))
                .isInstanceOf(PublicPiiExposureException.class);
    }

    @Test
    void shouldRequireCoreNonPiiFields() {
        UUID id = UUID.randomUUID();
        UUID districtId = UUID.randomUUID();

        PublicAnonymisedRecord record = new PublicAnonymisedRecord(
                id,
                FormType.BYP,
                districtId,
                "Kampala",
                "FEMALE",
                "AGE_20_24",
                LocalDateTime.of(2026, 3, 15, 10, 0),
                "SYNCED",
                "JAN_JUN_2026"
        );

        assertThat(record.id()).isEqualTo(id);
        assertThat(record.gender()).isEqualTo("FEMALE");
        assertThat(record.ageGroup()).isEqualTo("AGE_20_24");
    }
}
