package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.domain.valueobjects.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
class BudgetPriorityDashboardJpaRepository {

    @PersistenceContext
    private EntityManager entityManager;

    long countTotal(BudgetPriorityDashboardFilter filter) {
        Map<String, Object> params = new HashMap<>();
        String sql = "SELECT COUNT(*) FROM budget_priority_submissions bps"
                + BudgetPriorityFilterSqlSupport.whereClause(filter, params);
        var query = entityManager.createNativeQuery(sql);
        bindParams(query, params);
        return ((Number) query.getSingleResult()).longValue();
    }

    List<BudgetPrioritySectionCount> countBySection(BudgetPriorityDashboardFilter filter) {
        Map<String, Object> params = new HashMap<>();
        String sql = """
                SELECT bps.section, COUNT(*)
                FROM budget_priority_submissions bps
                """ + BudgetPriorityFilterSqlSupport.whereClause(filter, params) + """
                 GROUP BY bps.section
                 ORDER BY COUNT(*) DESC, bps.section ASC
                """;
        @SuppressWarnings("unchecked")
        List<Object[]> rows = runQuery(sql, params);
        return rows.stream()
                .map(row -> new BudgetPrioritySectionCount(
                        BudgetPriorityFilterSqlSupport.toApiSection((String) row[0]),
                        ((Number) row[1]).longValue()))
                .toList();
    }

    List<BudgetPriorityAreaCount> countTopPriorityAreas(BudgetPriorityDashboardFilter filter, int limit) {
        Map<String, Object> params = new HashMap<>();
        params.put("limit", limit);
        String sql = """
                SELECT area, COUNT(*) AS cnt
                FROM budget_priority_submissions bps,
                LATERAL jsonb_array_elements_text(bps.priority_areas->'rankedAreas') AS area
                """ + BudgetPriorityFilterSqlSupport.whereClause(filter, params) + """
                 GROUP BY area
                 ORDER BY cnt DESC, area ASC
                 LIMIT :limit
                """;
        return mapPriorityAreaRows(runQuery(sql, params));
    }

    List<BudgetPriorityAreaCount> countByPriorityArea(BudgetPriorityDashboardFilter filter) {
        Map<String, Object> params = new HashMap<>();
        String sql = """
                SELECT area, COUNT(*) AS cnt
                FROM budget_priority_submissions bps,
                LATERAL jsonb_array_elements_text(bps.priority_areas->'rankedAreas') AS area
                """ + BudgetPriorityFilterSqlSupport.whereClause(filter, params) + """
                 GROUP BY area
                 ORDER BY cnt DESC, area ASC
                """;
        return mapPriorityAreaRows(runQuery(sql, params));
    }

    List<TimeSeriesPoint> countOverTime(
            BudgetPriorityDashboardFilter filter,
            TimeSeriesGranularity granularity
    ) {
        Map<String, Object> params = new HashMap<>();
        String bucketExpression = granularity == TimeSeriesGranularity.WEEK
                ? "date_trunc('week', bps.submitted_at)::date"
                : "bps.submitted_at::date";
        String sql = """
                SELECT %s, COUNT(*)
                FROM budget_priority_submissions bps
                """.formatted(bucketExpression) + BudgetPriorityFilterSqlSupport.whereClause(filter, params) + """
                 GROUP BY 1
                 ORDER BY 1 ASC
                """;
        @SuppressWarnings("unchecked")
        List<Object[]> rows = runQuery(sql, params);
        return rows.stream()
                .map(row -> new TimeSeriesPoint(toLocalDate(row[0]), ((Number) row[1]).longValue()))
                .toList();
    }

    List<FilterLocationOption> findDistinctDistricts() {
        @SuppressWarnings("unchecked")
        List<Object[]> rows = entityManager.createNativeQuery("""
                SELECT DISTINCT l.id, l.name
                FROM budget_priority_submissions bps
                JOIN locations l ON l.id = (bps.demographic_data->>'districtId')::uuid
                ORDER BY l.name ASC
                """).getResultList();
        return rows.stream()
                .map(row -> new FilterLocationOption(toUuid(row[0]), (String) row[1]))
                .toList();
    }

    List<String> findDistinctGenders() {
        return runStringQuery("""
                SELECT DISTINCT bps.demographic_data->>'gender' AS gender
                FROM budget_priority_submissions bps
                WHERE bps.demographic_data->>'gender' IS NOT NULL
                ORDER BY gender ASC
                """);
    }

    List<String> findDistinctAgeGroups() {
        return runStringQuery("""
                SELECT DISTINCT bps.demographic_data->>'ageGroup' AS age_group
                FROM budget_priority_submissions bps
                WHERE bps.demographic_data->>'ageGroup' IS NOT NULL
                ORDER BY age_group ASC
                """);
    }

    List<String> findDistinctFinancialYearPeriods() {
        return runStringQuery("""
                SELECT DISTINCT bps.financial_year_period
                FROM budget_priority_submissions bps
                ORDER BY bps.financial_year_period ASC
                """);
    }

    BudgetPriorityAnonymisedRecordPage findExportRecords(
            BudgetPriorityDashboardFilter filter,
            PageRequest pageRequest
    ) {
        Map<String, Object> params = new HashMap<>();
        String whereClause = BudgetPriorityFilterSqlSupport.whereClause(filter, params);
        long totalElements = countExportRecords(whereClause, params);

        String sql = """
                SELECT bps.bp_id,
                       bps.section,
                       bps.financial_year_period,
                       (bps.demographic_data->>'districtId')::uuid,
                       l.name,
                       bps.demographic_data->>'gender',
                       bps.demographic_data->>'ageGroup',
                       (
                           SELECT string_agg(value, ', ' ORDER BY ord)
                           FROM jsonb_array_elements_text(bps.priority_areas->'rankedAreas')
                                WITH ORDINALITY AS arr(value, ord)
                       ),
                       bps.submitted_at
                FROM budget_priority_submissions bps
                JOIN locations l ON l.id = (bps.demographic_data->>'districtId')::uuid
                """ + whereClause + """
                 ORDER BY bps.submitted_at DESC, bps.bp_id DESC
                 LIMIT :pageSize OFFSET :pageOffset
                """;
        params.put("pageSize", pageRequest.size());
        params.put("pageOffset", pageRequest.offset());

        List<BudgetPriorityAnonymisedRecord> items = runQuery(sql, params).stream()
                .map(this::mapExportRecordRow)
                .toList();
        return new BudgetPriorityAnonymisedRecordPage(items, totalElements, pageRequest.page(), pageRequest.size());
    }

    private long countExportRecords(String whereClause, Map<String, Object> params) {
        Map<String, Object> countParams = new HashMap<>(params);
        String sql = "SELECT COUNT(*) FROM budget_priority_submissions bps" + whereClause;
        var query = entityManager.createNativeQuery(sql);
        bindParams(query, countParams);
        return ((Number) query.getSingleResult()).longValue();
    }

    private BudgetPriorityAnonymisedRecord mapExportRecordRow(Object[] row) {
        return new BudgetPriorityAnonymisedRecord(
                toUuid(row[0]),
                BudgetPriorityFilterSqlSupport.toApiSection((String) row[1]),
                (String) row[2],
                toUuid(row[3]),
                (String) row[4],
                (String) row[5],
                (String) row[6],
                row[7] == null ? "" : (String) row[7],
                toLocalDateTime(row[8])
        );
    }

    private List<BudgetPriorityAreaCount> mapPriorityAreaRows(List<Object[]> rows) {
        return rows.stream()
                .map(row -> new BudgetPriorityAreaCount((String) row[0], ((Number) row[1]).longValue()))
                .toList();
    }

    @SuppressWarnings("unchecked")
    private List<String> runStringQuery(String sql) {
        return entityManager.createNativeQuery(sql).getResultList();
    }

    @SuppressWarnings("unchecked")
    private List<Object[]> runQuery(String sql, Map<String, Object> params) {
        var query = entityManager.createNativeQuery(sql);
        bindParams(query, params);
        return query.getResultList();
    }

    private void bindParams(jakarta.persistence.Query query, Map<String, Object> params) {
        params.forEach(query::setParameter);
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
        if (value instanceof java.sql.Timestamp timestamp) {
            return timestamp.toLocalDateTime().toLocalDate();
        }
        return LocalDate.parse(value.toString());
    }

    private static LocalDateTime toLocalDateTime(Object value) {
        if (value instanceof LocalDateTime localDateTime) {
            return localDateTime;
        }
        if (value instanceof Timestamp timestamp) {
            return timestamp.toLocalDateTime();
        }
        if (value instanceof OffsetDateTime offsetDateTime) {
            return offsetDateTime.toLocalDateTime();
        }
        if (value instanceof Instant instant) {
            return LocalDateTime.ofInstant(instant, ZoneOffset.UTC);
        }
        String text = value.toString();
        if (text.endsWith("Z")) {
            return LocalDateTime.ofInstant(Instant.parse(text), ZoneOffset.UTC);
        }
        return LocalDateTime.parse(text);
    }
}
