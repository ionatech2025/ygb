package com.ionatech.nac.ygb.domain.model;

import com.ionatech.nac.ygb.domain.valueobjects.AgeGroup;
import com.ionatech.nac.ygb.domain.valueobjects.EmailAddress;
import com.ionatech.nac.ygb.domain.valueobjects.FieldOfOperation;
import com.ionatech.nac.ygb.domain.valueobjects.Gender;
import com.ionatech.nac.ygb.domain.valueobjects.IsoCountryCode;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class DownloadProfileTest {

    private static final LocalDateTime NOW = LocalDateTime.parse("2026-08-04T12:00:00");

    @Test
    void shouldCreateProfileWhenConsentGivenAndFieldsValid() {
        DownloadProfile profile = DownloadProfile.recordNew(
                EmailAddress.of("analyst@example.com"),
                "Ada Lovelace",
                IsoCountryCode.of("UG"),
                Gender.FEMALE,
                AgeGroup.AGE_25_29,
                FieldOfOperation.ACADEMIA_RESEARCH,
                null,
                true,
                NOW
        );

        assertThat(profile.getId()).isNotNull();
        assertThat(profile.getEmail().getValue()).isEqualTo("analyst@example.com");
        assertThat(profile.getOptionalName()).isEqualTo("Ada Lovelace");
        assertThat(profile.getCountryCode().getValue()).isEqualTo("UG");
        assertThat(profile.isConsentGiven()).isTrue();
        assertThat(profile.getCreatedAt()).isEqualTo(NOW);
    }

    @Test
    void shouldRejectWhenConsentNotGiven() {
        assertThatThrownBy(() -> DownloadProfile.recordNew(
                EmailAddress.of("analyst@example.com"),
                null,
                IsoCountryCode.of("UG"),
                Gender.MALE,
                AgeGroup.AGE_30_35,
                FieldOfOperation.GOVERNMENT,
                null,
                false,
                NOW
        ))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Consent");
    }

    @Test
    void shouldRequireSpecifyTextWhenFieldOfOperationIsOther() {
        assertThatThrownBy(() -> DownloadProfile.recordNew(
                EmailAddress.of("analyst@example.com"),
                null,
                IsoCountryCode.of("KE"),
                Gender.FEMALE,
                AgeGroup.AGE_18_24,
                FieldOfOperation.OTHER,
                "  ",
                true,
                NOW
        ))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("specify");
    }

    @Test
    void shouldAcceptOtherWithSpecifyText() {
        DownloadProfile profile = DownloadProfile.recordNew(
                EmailAddress.of("analyst@example.com"),
                null,
                IsoCountryCode.of("KE"),
                Gender.FEMALE,
                AgeGroup.AGE_18_24,
                FieldOfOperation.OTHER,
                "Independent consultant",
                true,
                NOW
        );

        assertThat(profile.getFieldOfOperation()).isEqualTo(FieldOfOperation.OTHER);
        assertThat(profile.getFieldOfOperationSpecify()).isEqualTo("Independent consultant");
        assertThat(profile.getOptionalName()).isNull();
    }
}
