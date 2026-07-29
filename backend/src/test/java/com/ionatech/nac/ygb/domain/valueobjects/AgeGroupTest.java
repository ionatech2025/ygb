package com.ionatech.nac.ygb.domain.valueobjects;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AgeGroupTest {

    @Test
    void definesProgrammeTargetBracketsForJuly2026Change() {
        assertThat(AgeGroup.values()).containsExactly(
                AgeGroup.AGE_BELOW_18,
                AgeGroup.AGE_18_24,
                AgeGroup.AGE_25_29,
                AgeGroup.AGE_30_35,
                AgeGroup.AGE_ABOVE_35
        );
        assertThat(AgeGroup.AGE_18_24.getLabel()).isEqualTo("18-24");
        assertThat(AgeGroup.AGE_ABOVE_35.getLabel()).isEqualTo("Above 35");
    }

    @Test
    void marksBelow18AsOutOfProgrammeScope() {
        assertThat(AgeGroup.AGE_BELOW_18.isOutOfProgrammeScope()).isTrue();
        assertThat(AgeGroup.AGE_18_24.isOutOfProgrammeScope()).isFalse();
    }
}
