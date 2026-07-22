package com.ionatech.nac.ygb.domain.service;

import com.ionatech.nac.ygb.domain.exceptions.PublicPiiExposureException;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.valueobjects.PublicAnonymisedRecord;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionSummary;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class AnonymisationProjectorTest {

    private AnonymisationProjector projector;

    @BeforeEach
    void setUp() {
        projector = new AnonymisationProjector();
    }

    @Test
    void shouldStripRespondentAndCollectorFieldsFromSubmissionSummary() {
        SubmissionSummary internal = new SubmissionSummary(
                UUID.randomUUID(),
                FormType.BYP,
                "Jane Doe",
                UUID.randomUUID(),
                "Kampala",
                UUID.randomUUID(),
                "Default Collector",
                LocalDateTime.of(2026, 3, 15, 10, 0),
                LocalDateTime.of(2026, 3, 15, 10, 5),
                "SYNCED",
                "JAN_JUN_2026"
        );

        PublicAnonymisedRecord anonymised = projector.fromSubmissionSummary(internal);

        assertThat(anonymised.id()).isEqualTo(internal.id());
        assertThat(anonymised.formType()).isEqualTo(FormType.BYP);
        assertThat(anonymised.districtName()).isEqualTo("Kampala");
        assertThat(anonymised.financialYearPeriod()).isEqualTo("JAN_JUN_2026");
    }

    @Test
    void shouldRejectPiiJsonKeys() {
        assertThatThrownBy(() -> projector.assertNoPiiJsonKeys(List.of("districts", "collectorName")))
                .isInstanceOf(PublicPiiExposureException.class)
                .hasMessageContaining("collectorName");
    }

    @Test
    void shouldAllowNonPiiJsonKeys() {
        projector.assertNoPiiJsonKeys(List.of("districts", "formTypes", "genders", "programmeAreas"));
    }
}
