package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.DownloadUsageAnalyticsRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.AgeGroupCount;
import com.ionatech.nac.ygb.domain.valueobjects.DatasetDownloadCount;
import com.ionatech.nac.ygb.domain.valueobjects.DownloadUsageAggregates;
import com.ionatech.nac.ygb.domain.valueobjects.DownloadUsageFilter;
import com.ionatech.nac.ygb.domain.valueobjects.DownloaderPage;
import com.ionatech.nac.ygb.domain.valueobjects.DownloaderSummary;
import com.ionatech.nac.ygb.domain.valueobjects.GenderCount;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesGranularity;
import com.ionatech.nac.ygb.domain.valueobjects.TimeSeriesPoint;
import com.ionatech.nac.ygb.domain.valueobjects.VisitsVsDownloadsComparison;
import com.ionatech.nac.ygb.domain.valueobjects.VisitsVsDownloadsPoint;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DownloadUsageAnalyticsServiceTest {

    @Mock
    private DownloadUsageAnalyticsRepositoryPort repository;

    private DownloadUsageAnalyticsService service;

    @BeforeEach
    void setUp() {
        service = new DownloadUsageAnalyticsService(repository);
    }

    @Test
    void shouldListDownloadersWithAgeAndGenderFilter() {
        DownloadUsageFilter filter = DownloadUsageFilter.of("FEMALE", "AGE_18_24");
        PageRequest page = PageRequest.of(0, 25);
        DownloaderSummary row = new DownloaderSummary(
                UUID.randomUUID(),
                "analyst@example.com",
                "Ada",
                "UG",
                "FEMALE",
                "AGE_18_24",
                "ACADEMIA_RESEARCH",
                null,
                LocalDateTime.parse("2026-08-01T10:00:00"),
                2L,
                LocalDateTime.parse("2026-08-04T12:00:00")
        );
        DownloaderPage expected = new DownloaderPage(List.of(row), 1, 0, 25);
        when(repository.findDownloaders(filter, page)).thenReturn(expected);

        DownloaderPage result = service.list(filter, page);

        assertThat(result.items()).hasSize(1);
        assertThat(result.items().getFirst().email()).isEqualTo("analyst@example.com");
        assertThat(result.items().getFirst().optionalName()).isEqualTo("Ada");
        verify(repository).findDownloaders(eq(filter), eq(page));
    }

    @Test
    void shouldReturnDownloadUsageAggregatesFilteredByDemographics() {
        DownloadUsageFilter filter = DownloadUsageFilter.of("MALE", "AGE_25_29");
        DownloadUsageAggregates aggregates = new DownloadUsageAggregates(
                3L,
                5L,
                List.of(new GenderCount("MALE", 3L)),
                List.of(new AgeGroupCount("AGE_25_29", 3L)),
                List.of(new DatasetDownloadCount("PDM", 4L)),
                List.of(new TimeSeriesPoint(LocalDate.of(2026, 8, 1), 2L))
        );
        when(repository.getDownloadUsageAggregates(filter, TimeSeriesGranularity.DAY)).thenReturn(aggregates);

        DownloadUsageAggregates result = service.getAggregates(filter, TimeSeriesGranularity.DAY);

        assertThat(result.totalDownloaders()).isEqualTo(3L);
        assertThat(result.byGender().getFirst().gender()).isEqualTo("MALE");
        assertThat(result.byAgeGroup().getFirst().ageGroup()).isEqualTo("AGE_25_29");
        assertThat(result.byDataset().getFirst().dataset()).isEqualTo("PDM");
    }

    @Test
    void shouldReturnVisitsVsDownloadsComparison() {
        DownloadUsageFilter filter = DownloadUsageFilter.empty();
        VisitsVsDownloadsComparison comparison = new VisitsVsDownloadsComparison(
                10L,
                4L,
                List.of(new VisitsVsDownloadsPoint(LocalDate.of(2026, 8, 4), 5L, 2L))
        );
        when(repository.getVisitsVsDownloads(filter, TimeSeriesGranularity.DAY)).thenReturn(comparison);

        VisitsVsDownloadsComparison result = service.getComparison(filter, TimeSeriesGranularity.DAY);

        assertThat(result.totalUniqueVisitors()).isEqualTo(10L);
        assertThat(result.totalUniqueDownloaders()).isEqualTo(4L);
        assertThat(result.overTime().getFirst().visitorCount()).isEqualTo(5L);
        assertThat(result.overTime().getFirst().downloaderCount()).isEqualTo(2L);
    }

    @Test
    void shouldRejectInvalidGenderInFilter() {
        assertThatThrownBy(() -> DownloadUsageFilter.of("OTHER", "AGE_18_24"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("gender");
    }
}
