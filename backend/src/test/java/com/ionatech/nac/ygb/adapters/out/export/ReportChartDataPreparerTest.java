package com.ionatech.nac.ygb.adapters.out.export;

import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ReportChartDataPreparerTest {

    @Test
    void prepareTimeSeriesBucketsLongRangesAndShortensLabels() {
        List<ReportLabelCount> points = new ArrayList<>();
        for (int day = 1; day <= 30; day++) {
            points.add(new ReportLabelCount("2026-03-%02d".formatted(day), 1));
        }

        List<ReportLabelCount> prepared = ReportChartDataPreparer.prepareTimeSeries(points);

        assertTrue(prepared.size() <= ReportChartDataPreparer.MAX_TIME_SERIES_BUCKETS);
        assertTrue(prepared.getFirst().label().contains("/"));
        assertEquals(30, prepared.stream().mapToLong(ReportLabelCount::count).sum());
    }

    @Test
    void prepareTimeSeriesKeepsShortSeriesLabelsReadable() {
        List<ReportLabelCount> points = List.of(
                new ReportLabelCount("2026-03-01", 4),
                new ReportLabelCount("2026-03-08", 14)
        );

        List<ReportLabelCount> prepared = ReportChartDataPreparer.prepareTimeSeries(points);

        assertEquals(2, prepared.size());
        assertEquals("03/01", prepared.getFirst().label());
        assertEquals("03/08", prepared.getLast().label());
    }
}
