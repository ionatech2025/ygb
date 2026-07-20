package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.persistence.entity.AdminLocationJpaEntity;
import com.ionatech.nac.ygb.adapters.out.persistence.mapper.AdminLocationMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.AdminLocationJpaRepository;
import com.ionatech.nac.ygb.application.ports.spi.AdminLocationRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.AdminLocation;
import com.ionatech.nac.ygb.domain.valueobjects.AdminLocationLevel;
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

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class AdminLocationRepositoryAdapterTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private AdminLocationJpaRepository jpaRepository;

    private AdminLocationRepositoryPort repositoryPort;

    @BeforeEach
    void setUp() {
        AdminLocationMapper mapper = Mappers.getMapper(AdminLocationMapper.class);
        repositoryPort = new AdminLocationRepositoryAdapter(jpaRepository, mapper);
    }

    @Test
    void shouldFindAllSeededLocations() {
        List<AdminLocation> dataset = repositoryPort.findAll();

        // Check total size or specific categories
        assertThat(dataset).isNotEmpty();

        long districtCount = dataset.stream()
                .filter(loc -> loc.level() == AdminLocationLevel.DISTRICT)
                .count();

        // We seeded exactly 3 districts (Kampala, Wakiso, Gulu)
        assertThat(districtCount).isEqualTo(3);

        // Check presence of specific districts
        assertThat(dataset).anyMatch(loc -> "Kampala".equals(loc.name()) && loc.level() == AdminLocationLevel.DISTRICT);
        assertThat(dataset).anyMatch(loc -> "Wakiso".equals(loc.name()) && loc.level() == AdminLocationLevel.DISTRICT);
        assertThat(dataset).anyMatch(loc -> "Gulu".equals(loc.name()) && loc.level() == AdminLocationLevel.DISTRICT);
    }
}
