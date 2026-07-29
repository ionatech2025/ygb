package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.persistence.mapper.ActiveFiscalYearSettingMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.ActiveFiscalYearSettingJpaRepository;
import com.ionatech.nac.ygb.application.ports.spi.ActiveFiscalYearSettingRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.ActiveFiscalYearSetting;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class ActiveFiscalYearSettingRepositoryAdapterTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private ActiveFiscalYearSettingJpaRepository jpaRepository;

    private ActiveFiscalYearSettingRepositoryPort repositoryPort;

    @BeforeEach
    void setUp() {
        ActiveFiscalYearSettingMapper mapper = Mappers.getMapper(ActiveFiscalYearSettingMapper.class);
        repositoryPort = new ActiveFiscalYearSettingRepositoryAdapter(jpaRepository, mapper);
    }

    @Test
    void shouldReadSeededDefaultFiscalYear() {
        Optional<ActiveFiscalYearSetting> current = repositoryPort.findCurrent();

        assertThat(current).isPresent();
        assertThat(current.get().fiscalYearLabel()).isEqualTo("2025/26");
    }

    @Test
    void shouldPersistUpdatedFiscalYearSetting() {
        UUID adminId = UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
        LocalDateTime effectiveFrom = LocalDateTime.parse("2026-07-28T10:00:00");

        ActiveFiscalYearSetting saved = repositoryPort.save(
                new ActiveFiscalYearSetting("2024/25", effectiveFrom, adminId)
        );

        assertThat(saved.fiscalYearLabel()).isEqualTo("2024/25");
        assertThat(saved.setByUserId()).isEqualTo(adminId);
        assertThat(repositoryPort.findCurrent()).contains(saved);
    }
}
