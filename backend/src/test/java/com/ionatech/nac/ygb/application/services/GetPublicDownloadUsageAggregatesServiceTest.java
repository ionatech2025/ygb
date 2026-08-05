package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.DownloadUsageAnalyticsRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.DatasetDownloadCount;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDownloadUsageAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesGranularity;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesPoint;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GetPublicDownloadUsageAggregatesServiceTest {

    @Mock
    private DownloadUsageAnalyticsRepositoryPort repository;

    private GetPublicDownloadUsageAggregatesService service;

    @BeforeEach
    void setUp() {
        service = new GetPublicDownloadUsageAggregatesService(repository);
    }

    @Test
    void shouldReturnAnonymisedOverTimeAndByDatasetSeries() {
        PublicDownloadUsageAggregates aggregates = new PublicDownloadUsageAggregates(
                7L,
                List.of(
                        new DatasetDownloadCount("PDM", 4L),
                        new DatasetDownloadCount("BUDGET_PRIORITIES", 2L),
                        new DatasetDownloadCount("LGO_BUDGET_ALLOCATION", 1L)
                ),
                List.of(new TimeSeriesPoint(LocalDate.of(2026, 8, 4), 7L))
        );
        when(repository.getPublicDownloadUsageAggregates(isNull(), isNull(), eq(TimeSeriesGranularity.DAY)))
                .thenReturn(aggregates);

        PublicDownloadUsageAggregates result = service.getAggregates(null, null, TimeSeriesGranularity.DAY);

        assertThat(result.totalDownloads()).isEqualTo(7L);
        assertThat(result.byDataset()).extracting(DatasetDownloadCount::dataset)
                .containsExactly("PDM", "BUDGET_PRIORITIES", "LGO_BUDGET_ALLOCATION");
        assertThat(result.downloadsOverTime()).hasSize(1);
        verify(repository).getPublicDownloadUsageAggregates(null, null, TimeSeriesGranularity.DAY);
    }

    @Test
    void shouldDefaultGranularityToDay() {
        when(repository.getPublicDownloadUsageAggregates(isNull(), isNull(), eq(TimeSeriesGranularity.DAY)))
                .thenReturn(new PublicDownloadUsageAggregates(0L, List.of(), List.of()));

        service.getAggregates(null, null, null);

        verify(repository).getPublicDownloadUsageAggregates(null, null, TimeSeriesGranularity.DAY);
    }

    @Test
    void shouldRejectInvalidDateRange() {
        assertThatThrownBy(() -> service.getAggregates(
                LocalDate.of(2026, 8, 10),
                LocalDate.of(2026, 8, 1),
                TimeSeriesGranularity.DAY
        )).isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("dateFrom");
    }
}
