package com.ionatech.nac.ygb.domain.valueobjects;

import com.ionatech.nac.ygb.domain.exceptions.InvalidFiscalYearSettingException;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class LgoFiscalYearCatalogTest {

    @Test
    void shouldOrderSupportedLabelsWithCurrentFirst() {
        assertThat(LgoFiscalYearCatalog.orderedWithCurrentFirst("2025/26")).startsWith("2025/26");
        assertThat(LgoFiscalYearCatalog.orderedWithCurrentFirst("2025/26"))
                .containsExactly(
                        "2025/26",
                        "2022/23",
                        "2023/24",
                        "2024/25",
                        "2026/27",
                        "2027/28",
                        "2028/29",
                        "2029/30"
                );
    }

    @Test
    void shouldResolvePriorFiscalYearLabel() {
        assertThat(LgoFiscalYearCatalog.priorLabel("2025/26")).contains("2024/25");
        assertThat(LgoFiscalYearCatalog.priorLabel("2022/23")).isEmpty();
    }

    @Test
    void activeFiscalYearSettingShouldRejectUnsupportedLabel() {
        assertThatThrownBy(() -> new ActiveFiscalYearSetting(
                "2030/31",
                LocalDateTime.now(),
                UUID.randomUUID()
        )).isInstanceOf(InvalidFiscalYearSettingException.class);
    }
}
