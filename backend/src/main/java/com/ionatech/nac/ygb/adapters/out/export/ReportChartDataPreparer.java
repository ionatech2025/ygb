package com.ionatech.nac.ygb.adapters.out.export;

import java.util.ArrayList;
import java.util.List;

final class ReportChartDataPreparer {

    static final int MAX_TIME_SERIES_BUCKETS = 12;
    static final int MAX_HORIZONTAL_ROWS = 10;

    private ReportChartDataPreparer() {
    }

    static List<ReportLabelCount> prepareTimeSeries(List<ReportLabelCount> points) {
        if (points.isEmpty()) {
            return List.of();
        }
        if (points.size() <= MAX_TIME_SERIES_BUCKETS) {
            return points.stream()
                    .map(point -> new ReportLabelCount(shortenDateLabel(point.label()), point.count()))
                    .toList();
        }
        int groupSize = (int) Math.ceil(points.size() / (double) MAX_TIME_SERIES_BUCKETS);
        List<ReportLabelCount> buckets = new ArrayList<>();
        for (int index = 0; index < points.size(); index += groupSize) {
            int end = Math.min(index + groupSize, points.size());
            List<ReportLabelCount> group = points.subList(index, end);
            long total = group.stream().mapToLong(ReportLabelCount::count).sum();
            String label = shortenDateLabel(group.getFirst().label()) + "–" + shortenDateLabel(group.getLast().label());
            buckets.add(new ReportLabelCount(label, total));
        }
        return buckets;
    }

    static List<ReportLabelCount> limitRows(List<ReportLabelCount> rows, int maxRows) {
        return rows.stream().limit(maxRows).toList();
    }

    static String shortenDateLabel(String label) {
        if (label.length() >= 10 && label.charAt(4) == '-' && label.charAt(7) == '-') {
            return label.substring(5, 7) + "/" + label.substring(8, 10);
        }
        return truncate(label, 12);
    }

    static String truncate(String text, int maxLength) {
        if (text.length() <= maxLength) {
            return text;
        }
        return text.substring(0, Math.max(0, maxLength - 1)) + "…";
    }
}
