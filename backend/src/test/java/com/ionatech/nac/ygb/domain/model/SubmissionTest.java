package com.ionatech.nac.ygb.domain.model;

import com.ionatech.nac.ygb.domain.valueobjects.*;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class SubmissionTest {

    private SubmissionMetadata createMetadata() {
        return new SubmissionMetadata(UUID.randomUUID(), UUID.randomUUID(), LocalDateTime.now());
    }

    private Location createLocation() {
        return new Location(UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID());
    }

    // ==========================================
    // BYP SUBMISSION TESTS
    // ==========================================

    @Test
    void shouldCreateValidBypSubmission() {
        BypSubmission byp = new BypSubmission(
                UUID.randomUUID(),
                createMetadata(),
                createLocation(),
                "Jane Doe",
                "0772111222",
                "FEMALE",
                AgeGroup.AGE_20_24,
                new Age(22),
                "ONE_WEEK",
                null,
                true,
                500000L,
                "MONTHLY",
                null,
                Rating.VERY_GOOD,
                Rating.GOOD,
                true,
                true,
                List.of("TRAINING", "MARKET_LINKAGES"),
                new NarrativeText("Provide more technical support and early training.")
        );

        byp.validate();

        assertThat(byp.getId()).isNotNull();
        assertThat(byp.getExactAge().getValue()).isEqualTo(22);
    }

    @Test
    void bypShouldThrowWhenFundReceiptDurationRequiresSpecifyButNull() {
        BypSubmission byp = new BypSubmission(
                UUID.randomUUID(),
                createMetadata(),
                createLocation(),
                "Jane Doe",
                "0772111222",
                "FEMALE",
                AgeGroup.AGE_20_24,
                new Age(22),
                "MONTHS", // requires specify
                null, // missing specify
                true,
                500000L,
                "MONTHLY",
                null,
                Rating.VERY_GOOD,
                Rating.GOOD,
                true,
                true,
                List.of("TRAINING"),
                new NarrativeText("Provide more technical support.")
        );

        assertThatThrownBy(byp::validate)
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("fundReceiptDurationSpecify is required when duration is MONTHS");
    }

    @Test
    void bypShouldThrowWhenInstalmentPeriodRequiresSpecifyButNull() {
        BypSubmission byp = new BypSubmission(
                UUID.randomUUID(),
                createMetadata(),
                createLocation(),
                "Jane Doe",
                "0772111222",
                "FEMALE",
                AgeGroup.AGE_20_24,
                new Age(22),
                "ONE_WEEK",
                null,
                true,
                500000L,
                "OTHERS", // requires specify
                null, // missing specify
                Rating.VERY_GOOD,
                Rating.GOOD,
                true,
                true,
                List.of("TRAINING"),
                new NarrativeText("Provide more technical support.")
        );

        assertThatThrownBy(byp::validate)
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("instalmentPeriodSpecify is required when period is OTHERS");
    }

    @Test
    void bypShouldThrowWhenReceivedBdsIsTrueButBdsServicesIsEmpty() {
        BypSubmission byp = new BypSubmission(
                UUID.randomUUID(),
                createMetadata(),
                createLocation(),
                "Jane Doe",
                "0772111222",
                "FEMALE",
                AgeGroup.AGE_20_24,
                new Age(22),
                "ONE_WEEK",
                null,
                true,
                500000L,
                "MONTHLY",
                null,
                Rating.VERY_GOOD,
                Rating.GOOD,
                true,
                true, // received BDS
                Collections.emptyList(), // empty list
                new NarrativeText("Provide more technical support.")
        );

        assertThatThrownBy(byp::validate)
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("BDS services list cannot be empty when receivedBds is true");
    }

    // ==========================================
    // IYP SUBMISSION TESTS
    // ==========================================

    @Test
    void shouldCreateValidIypSubmissionUnawareBranch() {
        IypSubmission iyp = new IypSubmission(
                UUID.randomUUID(),
                createMetadata(),
                createLocation(),
                "John Doe",
                "0772111333",
                "MALE",
                AgeGroup.AGE_15_19,
                false, // unaware
                null,
                null,
                null,
                null,
                Collections.emptyList(),
                Collections.emptyList(),
                Collections.emptyList(),
                null, // limitationExplanation
                new NarrativeText("Make information more accessible in rural areas.")
        );

        iyp.validate();
        assertThat(iyp.isAwareOfPdm()).isFalse();
    }

    @Test
    void shouldCreateValidIypSubmissionAppliedAndAccessed() {
        IypSubmission iyp = new IypSubmission(
                UUID.randomUUID(),
                createMetadata(),
                createLocation(),
                "John Doe",
                "0772111333",
                "MALE",
                AgeGroup.AGE_15_19,
                true, // aware
                true, // eligible criteria aware
                true, // applied
                true, // accessed
                null, // no rejection narrative needed
                Collections.emptyList(), // no reasons for not applying
                List.of("RADIO"),
                Collections.emptyList(), // difficultiesFaced
                null, // limitationExplanation
                new NarrativeText("Make information more accessible in rural areas.")
        );

        iyp.validate();
        assertThat(iyp.isAccessedFund()).isTrue();
    }

    @Test
    void iypShouldThrowWhenRejectionNarrativeMissingOnRejection() {
        IypSubmission iyp = new IypSubmission(
                UUID.randomUUID(),
                createMetadata(),
                createLocation(),
                "John Doe",
                "0772111333",
                "MALE",
                AgeGroup.AGE_15_19,
                true,
                true,
                true, // applied
                false, // did not access
                null, // missing rejection narrative
                Collections.emptyList(),
                List.of("RADIO"),
                Collections.emptyList(), // difficultiesFaced
                null, // limitationExplanation
                new NarrativeText("Make information more accessible in rural areas.")
        );

        assertThatThrownBy(iyp::validate)
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Rejection narrative is required when applied but not accessed");
    }

    @Test
    void iypShouldThrowWhenReasonsForNotApplyingMissingOnNoApply() {
        IypSubmission iyp = new IypSubmission(
                UUID.randomUUID(),
                createMetadata(),
                createLocation(),
                "John Doe",
                "0772111333",
                "MALE",
                AgeGroup.AGE_15_19,
                true,
                true,
                false, // did not apply
                null,
                null,
                Collections.emptyList(), // missing reasons
                List.of("RADIO"),
                Collections.emptyList(), // difficultiesFaced
                null, // limitationExplanation
                new NarrativeText("Make information more accessible in rural areas.")
        );

        assertThatThrownBy(iyp::validate)
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Reasons for not applying is required when user did not apply");
    }

    @Test
    void iypShouldThrowWhenLimitationExplanationMissingOnLimitationCheckbox() {
        IypSubmission iyp = new IypSubmission(
                UUID.randomUUID(),
                createMetadata(),
                createLocation(),
                "John Doe",
                "0772111333",
                "MALE",
                AgeGroup.AGE_15_19,
                true,
                true,
                true,
                true,
                null,
                Collections.emptyList(),
                List.of("RADIO"),
                List.of("LIMITATION_IN_AMOUNT"), // limitation difficulty
                null, // missing explanation
                new NarrativeText("Make information more accessible in rural areas.")
        );

        assertThatThrownBy(iyp::validate)
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Limitation explanation is required when LIMITATION_IN_AMOUNT difficulty is selected");
    }

    // ==========================================
    // LGO SUBMISSION TESTS
    // ==========================================

    @Test
    void shouldCreateValidLgoSubmission() {
        LgoSubmission lgo = new LgoSubmission(
                UUID.randomUUID(),
                createMetadata(),
                createLocation(),
                "Official Name",
                "0772111444",
                "FEMALE",
                AgeGroup.AGE_30_AND_ABOVE,
                List.of(new FiscalYearRecord("2024/25", 100000L, 80000L, 50, 20, 20, 5, 4)),
                true,
                null,
                true,
                null,
                new NarrativeText("Provide more monitoring tools.")
        );

        lgo.validate();
        assertThat(lgo.getFiscalYearRecords()).hasSize(1);
    }

    @Test
    void lgoShouldThrowWhenFundsNotSpentExplanationMissing() {
        LgoSubmission lgo = new LgoSubmission(
                UUID.randomUUID(),
                createMetadata(),
                createLocation(),
                "Official Name",
                "0772111444",
                "FEMALE",
                AgeGroup.AGE_30_AND_ABOVE,
                List.of(new FiscalYearRecord("2024/25", 100000L, 80000L, 50, 20, 20, 5, 4)),
                false, // funds NOT spent as required
                null, // missing explanation
                true,
                null,
                new NarrativeText("Provide more monitoring tools.")
        );

        assertThatThrownBy(lgo::validate)
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Explanation is required when funds were not spent as required");
    }

    // ==========================================
    // PC SUBMISSION TESTS
    // ==========================================

    @Test
    void shouldCreateValidPcSubmission() {
        PcSubmission pc = new PcSubmission(
                UUID.randomUUID(),
                createMetadata(),
                createLocation(),
                "Parish Chief Name",
                "0772111555",
                "MALE",
                AgeGroup.AGE_30_AND_ABOVE,
                1500000L,
                1500000L,
                100,
                40,
                30,
                new NarrativeText("Lack of transport equipment is the main obstacle."),
                true,
                7,
                3,
                4,
                true,
                List.of("FINANCIAL_LITERACY", "BUSINESS_PLANNING"),
                "HIGHLY_EFFECTIVE",
                List.of("CAO", "PDM_SECRETARIAT"),
                null,
                new NarrativeText("Regular fields checks performed."),
                true,
                true,
                new NarrativeText("Improvements seen in poultry and crop production sectors."),
                true,
                new NarrativeText("Reports submitted quarterly to the CAO office."),
                10,
                8
        );

        pc.validate();
        assertThat(pc.getAmountExpected()).isEqualTo(1500000L);
    }

    @Test
    void pcShouldThrowWhenMonitoredByOthersSpecifyMissing() {
        PcSubmission pc = new PcSubmission(
                UUID.randomUUID(),
                createMetadata(),
                createLocation(),
                "Parish Chief Name",
                "0772111555",
                "MALE",
                AgeGroup.AGE_30_AND_ABOVE,
                1500000L,
                1500000L,
                100,
                40,
                30,
                new NarrativeText("Lack of transport equipment is the main obstacle."),
                true,
                7,
                3,
                4,
                true,
                List.of("FINANCIAL_LITERACY"),
                "HIGHLY_EFFECTIVE",
                List.of("OTHERS"), // monitored by OTHERS
                null, // missing specify
                new NarrativeText("Regular fields checks performed."),
                true,
                true,
                new NarrativeText("Improvements seen in poultry sectors."),
                true,
                new NarrativeText("Reports submitted quarterly."),
                10,
                8
        );

        assertThatThrownBy(pc::validate)
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("monitoredByOthersSpecify is required when monitoredBy contains OTHERS");
    }
}
