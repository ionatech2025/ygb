package com.ionatech.nac.ygb.adapters.out.persistence;

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
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
class DownloadUsageAnalyticsJpaRepository {

    @PersistenceContext
    private EntityManager entityManager;

    DownloaderPage findDownloaders(DownloadUsageFilter filter, PageRequest pageRequest) {
        Map<String, Object> params = new HashMap<>();
        String profileWhere = profileWhereClause(filter, params, "p");
        String eventJoinFilter = eventDateAndDatasetFilter(filter, params, "e");

        String countSql = """
                SELECT COUNT(*) FROM (
                    SELECT p.id
                    FROM download_profiles p
                    LEFT JOIN download_events e ON e.profile_id = p.id%s
                    %s
                    GROUP BY p.id
                ) counted
                """.formatted(eventJoinFilter, profileWhere);

        long totalElements = ((Number) bind(entityManager.createNativeQuery(countSql), params).getSingleResult()).longValue();

        String sql = """
                SELECT p.id,
                       p.email,
                       p.optional_name,
                       p.country_code,
                       p.gender,
                       p.age_group,
                       p.field_of_operation,
                       p.field_of_operation_specify,
                       p.created_at,
                       COUNT(e.id) AS download_count,
                       MAX(e.downloaded_at) AS last_downloaded_at
                FROM download_profiles p
                LEFT JOIN download_events e ON e.profile_id = p.id%s
                %s
                GROUP BY p.id, p.email, p.optional_name, p.country_code, p.gender, p.age_group,
                         p.field_of_operation, p.field_of_operation_specify, p.created_at
                ORDER BY MAX(e.downloaded_at) DESC NULLS LAST, p.created_at DESC
                LIMIT :pageSize OFFSET :pageOffset
                """.formatted(eventJoinFilter, profileWhere);
        params.put("pageSize", pageRequest.size());
        params.put("pageOffset", pageRequest.offset());

        @SuppressWarnings("unchecked")
        List<Object[]> rows = bind(entityManager.createNativeQuery(sql), params).getResultList();
        List<DownloaderSummary> items = rows.stream()
                .map(row -> new DownloaderSummary(
                        toUuid(row[0]),
                        (String) row[1],
                        (String) row[2],
                        (String) row[3],
                        (String) row[4],
                        (String) row[5],
                        (String) row[6],
                        (String) row[7],
                        toLocalDateTime(row[8]),
                        ((Number) row[9]).longValue(),
                        toLocalDateTime(row[10])
                ))
                .toList();
        return new DownloaderPage(items, totalElements, pageRequest.page(), pageRequest.size());
    }

    DownloadUsageAggregates getDownloadUsageAggregates(
            DownloadUsageFilter filter,
            TimeSeriesGranularity granularity
    ) {
        Map<String, Object> params = new HashMap<>();
        String where = downloadEventWhereClause(filter, params);

        long totalDownloaders = ((Number) bind(entityManager.createNativeQuery(
                "SELECT COUNT(DISTINCT e.profile_id) FROM download_events e JOIN download_profiles p ON p.id = e.profile_id " + where
        ), params).getSingleResult()).longValue();

        long totalDownloads = ((Number) bind(entityManager.createNativeQuery(
                "SELECT COUNT(e.id) FROM download_events e JOIN download_profiles p ON p.id = e.profile_id " + where
        ), params).getSingleResult()).longValue();

        List<GenderCount> byGender = mapLabelCounts(
                "SELECT p.gender, COUNT(DISTINCT e.profile_id) FROM download_events e JOIN download_profiles p ON p.id = e.profile_id "
                        + where + " GROUP BY p.gender ORDER BY COUNT(DISTINCT e.profile_id) DESC",
                params,
                GenderCount::new
        );

        List<AgeGroupCount> byAgeGroup = mapLabelCounts(
                "SELECT p.age_group, COUNT(DISTINCT e.profile_id) FROM download_events e JOIN download_profiles p ON p.id = e.profile_id "
                        + where + " GROUP BY p.age_group ORDER BY COUNT(DISTINCT e.profile_id) DESC",
                params,
                AgeGroupCount::new
        );

        List<DatasetDownloadCount> byDataset = mapLabelCounts(
                "SELECT e.dataset, COUNT(e.id) FROM download_events e JOIN download_profiles p ON p.id = e.profile_id "
                        + where + " GROUP BY e.dataset ORDER BY COUNT(e.id) DESC",
                params,
                DatasetDownloadCount::new
        );

        String bucketExpression = bucketExpression(granularity, "e.downloaded_at");
        @SuppressWarnings("unchecked")
        List<Object[]> overTimeRows = bind(entityManager.createNativeQuery(
                "SELECT " + bucketExpression + ", COUNT(e.id) FROM download_events e JOIN download_profiles p ON p.id = e.profile_id "
                        + where + " GROUP BY 1 ORDER BY 1 ASC"
        ), params).getResultList();
        List<TimeSeriesPoint> overTime = overTimeRows.stream()
                .map(row -> new TimeSeriesPoint(toLocalDate(row[0]), ((Number) row[1]).longValue()))
                .toList();

        return new DownloadUsageAggregates(
                totalDownloaders,
                totalDownloads,
                byGender,
                byAgeGroup,
                byDataset,
                overTime
        );
    }

    VisitsVsDownloadsComparison getVisitsVsDownloads(
            DownloadUsageFilter filter,
            TimeSeriesGranularity granularity
    ) {
        Map<String, Object> visitParams = new HashMap<>();
        String visitWhere = visitWhereClause(filter, visitParams);

        long totalUniqueVisitors = ((Number) bind(entityManager.createNativeQuery(
                "SELECT COUNT(DISTINCT v.anonymous_session_id) FROM public_visit_events v " + visitWhere
        ), visitParams).getSingleResult()).longValue();

        Map<String, Object> downloadParams = new HashMap<>();
        String downloadWhere = downloadEventWhereClause(filter, downloadParams);
        long totalUniqueDownloaders = ((Number) bind(entityManager.createNativeQuery(
                "SELECT COUNT(DISTINCT e.profile_id) FROM download_events e JOIN download_profiles p ON p.id = e.profile_id "
                        + downloadWhere
        ), downloadParams).getSingleResult()).longValue();

        String visitBucket = bucketExpression(granularity, "v.visited_at");
        @SuppressWarnings("unchecked")
        List<Object[]> visitRows = bind(entityManager.createNativeQuery(
                "SELECT " + visitBucket + ", COUNT(DISTINCT v.anonymous_session_id) FROM public_visit_events v "
                        + visitWhere + " GROUP BY 1 ORDER BY 1 ASC"
        ), visitParams).getResultList();

        String downloadBucket = bucketExpression(granularity, "e.downloaded_at");
        @SuppressWarnings("unchecked")
        List<Object[]> downloadRows = bind(entityManager.createNativeQuery(
                "SELECT " + downloadBucket + ", COUNT(DISTINCT e.profile_id) FROM download_events e "
                        + "JOIN download_profiles p ON p.id = e.profile_id "
                        + downloadWhere + " GROUP BY 1 ORDER BY 1 ASC"
        ), downloadParams).getResultList();

        Map<LocalDate, Long> visitorsByBucket = new HashMap<>();
        for (Object[] row : visitRows) {
            visitorsByBucket.put(toLocalDate(row[0]), ((Number) row[1]).longValue());
        }
        Map<LocalDate, Long> downloadersByBucket = new HashMap<>();
        for (Object[] row : downloadRows) {
            downloadersByBucket.put(toLocalDate(row[0]), ((Number) row[1]).longValue());
        }

        List<LocalDate> buckets = java.util.stream.Stream.concat(
                        visitorsByBucket.keySet().stream(),
                        downloadersByBucket.keySet().stream()
                )
                .distinct()
                .sorted()
                .toList();

        List<VisitsVsDownloadsPoint> overTime = buckets.stream()
                .map(bucket -> new VisitsVsDownloadsPoint(
                        bucket,
                        visitorsByBucket.getOrDefault(bucket, 0L),
                        downloadersByBucket.getOrDefault(bucket, 0L)
                ))
                .toList();

        return new VisitsVsDownloadsComparison(totalUniqueVisitors, totalUniqueDownloaders, overTime);
    }

    private interface LabelCountFactory<T> {
        T create(String label, long count);
    }

    private <T> List<T> mapLabelCounts(String sql, Map<String, Object> params, LabelCountFactory<T> factory) {
        @SuppressWarnings("unchecked")
        List<Object[]> rows = bind(entityManager.createNativeQuery(sql), params).getResultList();
        return rows.stream()
                .map(row -> factory.create((String) row[0], ((Number) row[1]).longValue()))
                .toList();
    }

    private static String bucketExpression(TimeSeriesGranularity granularity, String column) {
        return granularity == TimeSeriesGranularity.WEEK
                ? "date_trunc('week', " + column + ")::date"
                : column + "::date";
    }

    private static String profileWhereClause(DownloadUsageFilter filter, Map<String, Object> params, String alias) {
        StringBuilder where = new StringBuilder(" WHERE 1=1");
        appendProfileFilters(filter, params, alias, where);
        return where.toString();
    }

    private static String downloadEventWhereClause(DownloadUsageFilter filter, Map<String, Object> params) {
        StringBuilder where = new StringBuilder(" WHERE 1=1");
        appendProfileFilters(filter, params, "p", where);
        if (filter.dataset() != null) {
            where.append(" AND e.dataset = :dataset");
            params.put("dataset", filter.dataset().name());
        }
        if (filter.dateFrom() != null) {
            where.append(" AND e.downloaded_at >= :dateFrom");
            params.put("dateFrom", filter.dateFrom().atStartOfDay());
        }
        if (filter.dateTo() != null) {
            where.append(" AND e.downloaded_at < :dateToExclusive");
            params.put("dateToExclusive", filter.dateTo().plusDays(1).atStartOfDay());
        }
        return where.toString();
    }

    private static String eventDateAndDatasetFilter(DownloadUsageFilter filter, Map<String, Object> params, String alias) {
        StringBuilder join = new StringBuilder();
        if (filter.dataset() != null) {
            join.append(" AND ").append(alias).append(".dataset = :dataset");
            params.put("dataset", filter.dataset().name());
        }
        if (filter.dateFrom() != null) {
            join.append(" AND ").append(alias).append(".downloaded_at >= :dateFrom");
            params.put("dateFrom", filter.dateFrom().atStartOfDay());
        }
        if (filter.dateTo() != null) {
            join.append(" AND ").append(alias).append(".downloaded_at < :dateToExclusive");
            params.put("dateToExclusive", filter.dateTo().plusDays(1).atStartOfDay());
        }
        return join.toString();
    }

    private static String visitWhereClause(DownloadUsageFilter filter, Map<String, Object> params) {
        StringBuilder where = new StringBuilder(" WHERE 1=1");
        if (filter.dateFrom() != null) {
            where.append(" AND v.visited_at >= :visitDateFrom");
            params.put("visitDateFrom", filter.dateFrom().atStartOfDay());
        }
        if (filter.dateTo() != null) {
            where.append(" AND v.visited_at < :visitDateToExclusive");
            params.put("visitDateToExclusive", filter.dateTo().plusDays(1).atStartOfDay());
        }
        return where.toString();
    }

    private static void appendProfileFilters(
            DownloadUsageFilter filter,
            Map<String, Object> params,
            String alias,
            StringBuilder where
    ) {
        if (filter.gender() != null) {
            where.append(" AND ").append(alias).append(".gender = :gender");
            params.put("gender", filter.gender());
        }
        if (filter.ageGroup() != null) {
            where.append(" AND ").append(alias).append(".age_group = :ageGroup");
            params.put("ageGroup", filter.ageGroup());
        }
        if (filter.countryCode() != null) {
            where.append(" AND ").append(alias).append(".country_code = :countryCode");
            params.put("countryCode", filter.countryCode());
        }
        if (filter.fieldOfOperation() != null) {
            where.append(" AND ").append(alias).append(".field_of_operation = :fieldOfOperation");
            params.put("fieldOfOperation", filter.fieldOfOperation());
        }
    }

    private static jakarta.persistence.Query bind(jakarta.persistence.Query query, Map<String, Object> params) {
        params.forEach(query::setParameter);
        return query;
    }

    private static UUID toUuid(Object value) {
        if (value instanceof UUID uuid) {
            return uuid;
        }
        return UUID.fromString(value.toString());
    }

    private static LocalDate toLocalDate(Object value) {
        if (value instanceof LocalDate localDate) {
            return localDate;
        }
        if (value instanceof Date sqlDate) {
            return sqlDate.toLocalDate();
        }
        if (value instanceof Timestamp timestamp) {
            return timestamp.toLocalDateTime().toLocalDate();
        }
        return LocalDate.parse(value.toString());
    }

    private static LocalDateTime toLocalDateTime(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof LocalDateTime localDateTime) {
            return localDateTime;
        }
        if (value instanceof Timestamp timestamp) {
            return timestamp.toLocalDateTime();
        }
        if (value instanceof OffsetDateTime offsetDateTime) {
            return offsetDateTime.toLocalDateTime();
        }
        if (value instanceof java.time.Instant instant) {
            return LocalDateTime.ofInstant(instant, java.time.ZoneOffset.UTC);
        }
        String text = value.toString();
        if (text.endsWith("Z") || text.contains("+") || text.lastIndexOf('-') > 9) {
            return OffsetDateTime.parse(text).toLocalDateTime();
        }
        return LocalDateTime.parse(text);
    }
}
