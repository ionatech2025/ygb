package com.ionatech.nac.ygb.domain.valueobjects;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class EmailAddressTest {

    @Test
    void shouldAcceptValidEmailAndNormalizeToLowerCase() {
        assertThat(EmailAddress.of("Donor.User@Example.COM").getValue())
                .isEqualTo("donor.user@example.com");
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "",
            "   ",
            "not-an-email",
            "missing-domain@",
            "@missing-local.com",
            "spaces emma@example.com"
    })
    void shouldRejectInvalidEmailFormat(String raw) {
        assertThatThrownBy(() -> EmailAddress.of(raw))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid email");
    }
}
