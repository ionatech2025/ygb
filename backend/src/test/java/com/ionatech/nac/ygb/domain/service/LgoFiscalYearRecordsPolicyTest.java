package com.ionatech.nac.ygb.domain.service;

import com.ionatech.nac.ygb.domain.valueobjects.FiscalYearRecord;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class LgoFiscalYearRecordsPolicyTest {

    private LgoFiscalYearRecordsPolicy policy;

    @BeforeEach
    void setUp() {
        policy = new LgoFiscalYearRecordsPolicy();
    }

    @Test
    void shouldRejectSingleRecordWhenPriorYearExists() {
        List<FiscalYearRecord> oneRecord = List.of(record("2025/26"));

        assertThatThrownBy(() -> policy.validate(oneRecord, "2025/26", "2024/25"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Exactly two fiscal year records are required");
    }

    @Test
    void shouldAcceptCurrentAndPriorRecords() {
        List<FiscalYearRecord> twoRecords = List.of(record("2025/26"), record("2024/25"));

        assertThatCode(() -> policy.validate(twoRecords, "2025/26", "2024/25"))
                .doesNotThrowAnyException();
    }

    @Test
    void shouldRejectWhenYoungMenCountWouldExceedBeneficiariesUnder30() {
        FiscalYearRecord invalid = new FiscalYearRecord("2025/26", 1000L, 800L, 10, 5, 3, 3, 2, 1);

        assertThatThrownBy(() -> policy.validate(List.of(invalid, record("2024/25")), "2025/26", "2024/25"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Beneficiary young women and young men counts cannot exceed beneficiaries under 30");
    }

    @Test
    void shouldRejectWhenFundedParishesExceedTotalParishesInDistrict() {
        FiscalYearRecord invalid = new FiscalYearRecord("2025/26", 1000L, 800L, 10, 5, 3, 2, 2, 3);

        assertThatThrownBy(() -> policy.validate(List.of(invalid, record("2024/25")), "2025/26", "2024/25"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Parishes that received PDM funds cannot exceed total parishes in the district");
    }

    private FiscalYearRecord record(String label) {
        return new FiscalYearRecord(label, 100000L, 80000L, 50, 20, 12, 8, 5, 4);
    }
}
