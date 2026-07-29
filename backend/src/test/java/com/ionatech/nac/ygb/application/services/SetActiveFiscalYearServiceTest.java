package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.SetActiveFiscalYearCommand;
import com.ionatech.nac.ygb.application.ports.spi.ActiveFiscalYearSettingRepositoryPort;
import com.ionatech.nac.ygb.domain.exceptions.InvalidFiscalYearSettingException;
import com.ionatech.nac.ygb.domain.valueobjects.ActiveFiscalYearSetting;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class SetActiveFiscalYearServiceTest {

    private static final Instant FIXED_INSTANT = Instant.parse("2026-07-28T09:15:00Z");
    private static final UUID ADMIN_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");

    private ActiveFiscalYearSettingRepositoryPort repositoryPort;
    private SetActiveFiscalYearService service;

    @BeforeEach
    void setUp() {
        repositoryPort = mock(ActiveFiscalYearSettingRepositoryPort.class);
        Clock clock = Clock.fixed(FIXED_INSTANT, ZoneOffset.UTC);
        service = new SetActiveFiscalYearService(repositoryPort, clock);
    }

    @Test
    void shouldPersistValidFiscalYearLabel() {
        when(repositoryPort.save(any(ActiveFiscalYearSetting.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ActiveFiscalYearSetting saved = service.setActiveFiscalYear(
                new SetActiveFiscalYearCommand("2025/26", ADMIN_ID)
        );

        assertThat(saved.fiscalYearLabel()).isEqualTo("2025/26");
        assertThat(saved.setByUserId()).isEqualTo(ADMIN_ID);
        assertThat(saved.effectiveFrom()).isEqualTo(LocalDateTime.ofInstant(FIXED_INSTANT, ZoneOffset.UTC));
        verify(repositoryPort).save(any(ActiveFiscalYearSetting.class));
    }

    @Test
    void shouldRejectInvalidFiscalYearLabel() {
        assertThatThrownBy(() -> service.setActiveFiscalYear(
                new SetActiveFiscalYearCommand("2030/31", ADMIN_ID)
        )).isInstanceOf(InvalidFiscalYearSettingException.class)
                .hasMessageContaining("Unsupported fiscal year label");
    }
}
