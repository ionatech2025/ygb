package com.ionatech.nac.ygb.domain.valueobjects;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ValueObjectsTest {

    @Test
    void ageShouldBeValidWhenGreaterOrEqual15() {
        Age age = new Age(15);
        assertThat(age.getValue()).isEqualTo(15);

        Age ageOlder = new Age(30);
        assertThat(ageOlder.getValue()).isEqualTo(30);
    }

    @Test
    void ageShouldThrowExceptionWhenLessThan15() {
        assertThatThrownBy(() -> new Age(14))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Age must be at least 15");

        assertThatThrownBy(() -> new Age(0))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Age must be at least 15");
    }

    @Test
    void narrativeTextShouldBeValidWhenLengthGreaterOrEqual10() {
        String content = "This is a valid response suggestion.";
        NarrativeText text = new NarrativeText(content);
        assertThat(text.getValue()).isEqualTo(content);
    }

    @Test
    void narrativeTextShouldThrowExceptionWhenLessThan10Characters() {
        assertThatThrownBy(() -> new NarrativeText("Too short"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Text must be at least 10 characters");

        assertThatThrownBy(() -> new NarrativeText(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Text cannot be null or blank");

        assertThatThrownBy(() -> new NarrativeText("  "))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Text cannot be null or blank");
    }

    @Test
    void financialYearPeriodShouldDeriveCorrectly() {
        // First period: Jan 1 - Jun 30
        LocalDateTime dateTimeJan = LocalDateTime.of(2026, 1, 15, 12, 0);
        FinancialYearPeriod periodJan = FinancialYearPeriod.from(dateTimeJan);
        assertThat(periodJan.getPeriod()).isEqualTo("JAN_JUN");
        assertThat(periodJan.getYear()).isEqualTo(2026);
        assertThat(periodJan.toString()).isEqualTo("JAN_JUN_2026");

        LocalDateTime dateTimeJune = LocalDateTime.of(2026, 6, 30, 23, 59);
        FinancialYearPeriod periodJune = FinancialYearPeriod.from(dateTimeJune);
        assertThat(periodJune.getPeriod()).isEqualTo("JAN_JUN");

        // Second period: Jul 1 - Dec 31
        LocalDateTime dateTimeJul = LocalDateTime.of(2026, 7, 1, 0, 0);
        FinancialYearPeriod periodJul = FinancialYearPeriod.from(dateTimeJul);
        assertThat(periodJul.getPeriod()).isEqualTo("JUL_DEC");
        assertThat(periodJul.getYear()).isEqualTo(2026);
        assertThat(periodJul.toString()).isEqualTo("JUL_DEC_2026");

        LocalDateTime dateTimeDec = LocalDateTime.of(2026, 12, 31, 23, 59);
        FinancialYearPeriod periodDec = FinancialYearPeriod.from(dateTimeDec);
        assertThat(periodDec.getPeriod()).isEqualTo("JUL_DEC");
    }

    @Test
    void locationShouldHoldIds() {
        UUID districtId = UUID.randomUUID();
        UUID subcountyId = UUID.randomUUID();
        UUID parishId = UUID.randomUUID();
        UUID villageId = UUID.randomUUID();

        Location location = new Location(districtId, subcountyId, parishId, villageId);

        assertThat(location.districtId()).isEqualTo(districtId);
        assertThat(location.subcountyId()).isEqualTo(subcountyId);
        assertThat(location.parishId()).isEqualTo(parishId);
        assertThat(location.villageId()).isEqualTo(villageId);
    }

    @Test
    void locationShouldValidateRequiredFields() {
        UUID validId = UUID.randomUUID();

        assertThatThrownBy(() -> new Location(null, validId, validId, validId))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("District ID cannot be null");

        assertThatThrownBy(() -> new Location(validId, null, validId, validId))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Sub-county ID cannot be null");

        assertThatThrownBy(() -> new Location(validId, validId, null, validId))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Parish ID cannot be null");

        assertThatThrownBy(() -> new Location(validId, validId, validId, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Village ID cannot be null");
    }

    @Test
    void fiscalYearRecordShouldValidateRequiredFields() {
        assertThatThrownBy(() -> new FiscalYearRecord(null, 1000L, 800L, 10, 5, 5, 2, 2))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Fiscal year label cannot be null or blank");

        assertThatThrownBy(() -> new FiscalYearRecord("  ", 1000L, 800L, 10, 5, 5, 2, 2))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Fiscal year label cannot be null or blank");

        assertThatThrownBy(() -> new FiscalYearRecord("2025/26", -100L, 800L, 10, 5, 5, 2, 2))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Funds and counts cannot be negative");

        assertThatThrownBy(() -> new FiscalYearRecord("2025/26", 1000L, 800L, -1, 5, 5, 2, 2))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Funds and counts cannot be negative");
    }

    @Test
    void fiscalYearRecordShouldCreateSuccessfully() {
        FiscalYearRecord record = new FiscalYearRecord("2025/26", 1000L, 800L, 10, 5, 5, 2, 2);
        assertThat(record.fiscalYearLabel()).isEqualTo("2025/26");
        assertThat(record.expectedFunds()).isEqualTo(1000L);
        assertThat(record.actualFunds()).isEqualTo(800L);
        assertThat(record.totalBeneficiaryCount()).isEqualTo(10);
        assertThat(record.youngPeopleCount()).isEqualTo(5);
        assertThat(record.youngWomenCount()).isEqualTo(5);
        assertThat(record.totalParishesCount()).isEqualTo(2);
        assertThat(record.fundedParishesCount()).isEqualTo(2);
    }

    @Test
    void ratingEnumShouldContainAllRequiredValues() {
        assertThat(Rating.values()).containsExactly(
                Rating.VERY_GOOD,
                Rating.GOOD,
                Rating.FAIR,
                Rating.POOR,
                Rating.VERY_POOR
        );
    }

    @Test
    void submissionStatusEnumShouldContainAllRequiredValues() {
        assertThat(SubmissionStatus.values()).containsExactly(
                SubmissionStatus.PENDING,
                SubmissionStatus.SYNCED,
                SubmissionStatus.FLAGGED,
                SubmissionStatus.DUPLICATE,
                SubmissionStatus.REJECTED
        );
    }

    @Test
    void submissionMetadataShouldCreateSuccessfully() {
        UUID collectorId = UUID.randomUUID();
        UUID deviceSubmissionId = UUID.randomUUID();
        LocalDateTime completedAt = LocalDateTime.now();

        SubmissionMetadata metadata = new SubmissionMetadata(collectorId, deviceSubmissionId, completedAt);

        assertThat(metadata.collectorId()).isEqualTo(collectorId);
        assertThat(metadata.deviceSubmissionId()).isEqualTo(deviceSubmissionId);
        assertThat(metadata.formCompletedAt()).isEqualTo(completedAt);
    }

    @Test
    void submissionMetadataShouldValidateFields() {
        UUID validId = UUID.randomUUID();
        LocalDateTime validTime = LocalDateTime.now();

        assertThatThrownBy(() -> new SubmissionMetadata(null, validId, validTime))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Collector ID cannot be null");

        assertThatThrownBy(() -> new SubmissionMetadata(validId, null, validTime))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Device submission ID cannot be null");

        assertThatThrownBy(() -> new SubmissionMetadata(validId, validId, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Form completed timestamp cannot be null");
    }

    @Test
    void adminLocationShouldCreateSuccessfully() {
        UUID id = UUID.randomUUID();
        UUID parentId = UUID.randomUUID();
        AdminLocation adminLocation = new AdminLocation(id, "Central", parentId, AdminLocationLevel.SUBCOUNTY);

        assertThat(adminLocation.id()).isEqualTo(id);
        assertThat(adminLocation.name()).isEqualTo("Central");
        assertThat(adminLocation.parentId()).isEqualTo(parentId);
        assertThat(adminLocation.level()).isEqualTo(AdminLocationLevel.SUBCOUNTY);
    }

    @Test
    void adminLocationShouldThrowExceptionWhenRequiredFieldsAreNull() {
        UUID validId = UUID.randomUUID();

        assertThatThrownBy(() -> new AdminLocation(null, "District Name", null, AdminLocationLevel.DISTRICT))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("AdminLocation id must not be null.");

        assertThatThrownBy(() -> new AdminLocation(validId, null, null, AdminLocationLevel.DISTRICT))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("AdminLocation name must not be null.");

        assertThatThrownBy(() -> new AdminLocation(validId, "District Name", null, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("AdminLocation level must not be null.");
    }
}

