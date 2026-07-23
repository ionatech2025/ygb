package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.LgoBudgetAllocationRepositoryPort;
import com.ionatech.nac.ygb.domain.model.LgoBudgetAllocation;
import com.ionatech.nac.ygb.domain.valueobjects.PriorYearAllocationBreakdown;
import com.ionatech.nac.ygb.domain.valueobjects.Rationale;
import com.ionatech.nac.ygb.domain.valueobjects.Recommendation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SaveLgoBudgetAllocationServiceTest {

    @Mock
    private LgoBudgetAllocationRepositoryPort repositoryPort;

    private SaveLgoBudgetAllocationService service;

    @BeforeEach
    void setUp() {
        service = new SaveLgoBudgetAllocationService(repositoryPort);
    }

    @Test
    void shouldPersistAllocationThroughRepositoryPort() {
        LgoBudgetAllocation allocation = sampleAllocation();
        when(repositoryPort.save(allocation)).thenReturn(allocation);

        LgoBudgetAllocation saved = service.save(allocation);

        assertThat(saved).isSameAs(allocation);
        verify(repositoryPort).save(allocation);
    }

    private LgoBudgetAllocation sampleAllocation() {
        return LgoBudgetAllocation.recordNew(
                UUID.randomUUID(),
                new PriorYearAllocationBreakdown(Map.of(
                        "health", Map.of("amount", 500_000, "percentage", 30)
                )),
                new Rationale("Health spending addressed primary care gaps across the district."),
                new Recommendation("Prioritise education infrastructure and teacher housing in the next FY."),
                LocalDateTime.of(2026, 3, 15, 10, 0)
        );
    }
}
