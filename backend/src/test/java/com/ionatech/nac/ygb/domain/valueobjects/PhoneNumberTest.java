package com.ionatech.nac.ygb.domain.valueobjects;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class PhoneNumberTest {

    @Test
    void shouldNormalizeInternationalFormatToLocalUgandaNumber() {
        assertThat(PhoneNumber.of("+256772123456").getValue()).isEqualTo("0772123456");
        assertThat(PhoneNumber.of("+256 752 350 470").getValue()).isEqualTo("0752350470");
    }

    @Test
    void shouldAcceptLocalUgandaNumber() {
        assertThat(PhoneNumber.of("0772123456").getValue()).isEqualTo("0772123456");
    }

    @Test
    void shouldRejectInvalidUgandaNumber() {
        assertThatThrownBy(() -> PhoneNumber.of("12345"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid Uganda phone number");
    }
}
