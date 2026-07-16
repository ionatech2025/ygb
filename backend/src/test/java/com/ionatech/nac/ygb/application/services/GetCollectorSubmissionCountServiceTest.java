package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.SubmissionRepositoryPort;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GetCollectorSubmissionCountServiceTest {

    @Mock
    private SubmissionRepositoryPort repositoryPort;

    @InjectMocks
    private GetCollectorSubmissionCountService service;

    @Test
    void shouldReturnDailyCountForCollector() {
        UUID collectorId = UUID.randomUUID();
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.atTime(LocalTime.MAX);

        when(repositoryPort.countByCollectorIdAndFormCompletedAtBetween(eq(collectorId), eq(start), eq(end)))
                .thenReturn(5L);

        long count = service.getDailyCount(collectorId);

        assertThat(count).isEqualTo(5L);
        verify(repositoryPort, times(1))
                .countByCollectorIdAndFormCompletedAtBetween(eq(collectorId), eq(start), eq(end));
    }
}
