package com.ionatech.nac.ygb.adapters.out.persistence;

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

    private AdminLocationMapper mapper;
    private AdminLocationRepositoryPort repositoryPort;

    @BeforeEach
    void setUp() {
        mapper = Mappers.getMapper(AdminLocationMapper.class);
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

        assertThat(districtCount).isEqualTo(2);

        assertThat(dataset).anyMatch(loc -> "Kampala".equals(loc.name()) && loc.level() == AdminLocationLevel.DISTRICT);
        assertThat(dataset).anyMatch(loc -> "Ntungamo".equals(loc.name()) && loc.level() == AdminLocationLevel.DISTRICT);
        assertThat(dataset.size()).isGreaterThan(1000);
    }

    @Test
    void shouldExposeCorrectedRomanNumeralLabelsAfterJul2026Migration() {
        UUID kamwokyaIParishId = UUID.fromString("496f65c7-febe-4b6a-8f7e-aa23e0041597");
        UUID kamwokyaIiParishId = UUID.fromString("33ff1b1b-0691-4c48-8925-d04ef4f6391f");
        UUID nyakihangaIVillageId = UUID.fromString("7a79b74b-4f5f-425f-8188-c7a975410980");

        List<AdminLocation> dataset = repositoryPort.findAll();

        assertThat(dataset)
                .anyMatch(loc -> kamwokyaIParishId.equals(loc.id()) && "Kamwokya i".equals(loc.name()));
        assertThat(dataset)
                .anyMatch(loc -> kamwokyaIiParishId.equals(loc.id()) && "Kamwokya ii".equals(loc.name()));
        assertThat(dataset)
                .anyMatch(loc -> nyakihangaIVillageId.equals(loc.id()) && "Nyakihanga i".equals(loc.name()));
        assertThat(dataset).noneMatch(loc -> "Kamwokya I".equals(loc.name()));
        assertThat(dataset).noneMatch(loc -> "Nyakihanga I".equals(loc.name()));
    }
}
