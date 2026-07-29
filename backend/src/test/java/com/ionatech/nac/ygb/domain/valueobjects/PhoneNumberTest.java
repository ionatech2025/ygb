package com.ionatech.nac.ygb.domain.valueobjects;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class PhoneNumberTest {

    @ParameterizedTest
    @ValueSource(strings = {
            "0772123456",
            "0782123456",
            "0762123456",
            "0391234567",
            "0752350470",
            "0701234567",
            "0746532164",
            "0721234567",
            "0711234567",
            "0791234567"
    })
    void shouldAcceptAllMajorUgandaMobilePrefixes(String localNumber) {
        assertThat(PhoneNumber.of(localNumber).getValue()).isEqualTo(localNumber);
    }

    @Test
    void shouldNormalizeInternationalFormatToLocalUgandaNumber() {
        assertThat(PhoneNumber.of("+256772123456").getValue()).isEqualTo("0772123456");
        assertThat(PhoneNumber.of("+256 752 350 470").getValue()).isEqualTo("0752350470");
        assertThat(PhoneNumber.of("+256746532164").getValue()).isEqualTo("0746532164");
        assertThat(PhoneNumber.of("+256391234567").getValue()).isEqualTo("0391234567");
    }

    @Test
    void shouldRejectInvalidUgandaNumber() {
        assertThatThrownBy(() -> PhoneNumber.of("12345"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid Uganda mobile number");
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "0671234567",
            "1234567890",
            "077212345",
            "07721234567"
    })
    void shouldRejectInvalidPrefixOrLength(String invalidNumber) {
        assertThatThrownBy(() -> PhoneNumber.of(invalidNumber))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid Uganda mobile number");
    }
}
