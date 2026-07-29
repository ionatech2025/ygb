package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.ActiveFiscalYearView;
import com.ionatech.nac.ygb.application.ports.spi.ActiveFiscalYearSettingRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.ActiveFiscalYearSetting;
import com.ionatech.nac.ygb.domain.valueobjects.LgoFiscalYearCatalog;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class GetActiveFiscalYearServiceTest {

    private ActiveFiscalYearSettingRepositoryPort repositoryPort;
    private GetActiveFiscalYearService service;

    @BeforeEach
    void setUp() {
        repositoryPort = mock(ActiveFiscalYearSettingRepositoryPort.class);
        service = new GetActiveFiscalYearService(repositoryPort);
    }

    @Test
    void shouldReturnLastAdminSetValue() {
        when(repositoryPort.findCurrent()).thenReturn(Optional.of(
                new ActiveFiscalYearSetting("2024/25", LocalDateTime.parse("2026-07-01T09:00:00"), UUID.randomUUID())
        ));

        ActiveFiscalYearView view = service.getActiveFiscalYear();

        assertThat(view.fiscalYearLabel()).isEqualTo("2024/25");
        assertThat(view.priorFiscalYearLabel()).isEqualTo("2023/24");
        assertThat(view.supportedLabels()).startsWith("2024/25");
        assertThat(view.supportedLabels()).containsExactly(
                "2024/25",
                "2022/23",
                "2023/24",
                "2025/26",
                "2026/27",
                "2027/28",
                "2028/29",
                "2029/30"
        );
    }

    @Test
    void shouldDefaultToCollectionLabelWhenUnset() {
        when(repositoryPort.findCurrent()).thenReturn(Optional.empty());

        ActiveFiscalYearView view = service.getActiveFiscalYear();

        assertThat(view.fiscalYearLabel()).isEqualTo(LgoFiscalYearCatalog.DEFAULT_ACTIVE_COLLECTION_LABEL);
        assertThat(view.priorFiscalYearLabel()).isEqualTo("2024/25");
    }
}
