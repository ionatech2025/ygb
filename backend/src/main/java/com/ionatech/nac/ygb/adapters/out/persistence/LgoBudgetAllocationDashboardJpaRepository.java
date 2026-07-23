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
class LgoBudgetAllocationDashboardJpaRepository {

    @PersistenceContext
    private EntityManager entityManager;

    long countTotal(LgoBudgetAllocationDashboardFilter filter) {
        Map<String, Object> params = new HashMap<>();
        String sql = "SELECT COUNT(*)" + LgoBudgetAllocationFilterSqlSupport.baseFromClause()
                + LgoBudgetAllocationFilterSqlSupport.whereClause(filter, params);
        var query = entityManager.createNativeQuery(sql);
        bindParams(query, params);
        return ((Number) query.getSingleResult()).longValue();
    }

    List<LgoBudgetAllocationDistrictCount> countByDistrict(LgoBudgetAllocationDashboardFilter filter) {
        Map<String, Object> params = new HashMap<>();
        String sql = """
                SELECT s.district_id, ld.name, COUNT(*)
                """ + LgoBudgetAllocationFilterSqlSupport.baseFromClause() + """
                 JOIN locations ld ON ld.id = s.district_id
                """ + LgoBudgetAllocationFilterSqlSupport.whereClause(filter, params) + """
                 GROUP BY s.district_id, ld.name
                 ORDER BY COUNT(*) DESC, ld.name ASC
                """;
        return runQuery(sql, params).stream()
                .map(row -> new LgoBudgetAllocationDistrictCount(
                        toUuid(row[0]),
                        (String) row[1],
                        ((Number) row[2]).longValue()))
                .toList();
    }

    List<LgoBudgetAllocationSectorCount> countTopSectors(LgoBudgetAllocationDashboardFilter filter, int limit) {
        Map<String, Object> params = new HashMap<>();
        params.put("limit", limit);
        String sql = "SELECT sector, COUNT(*) AS cnt"
                + LgoBudgetAllocationFilterSqlSupport.baseFromClause()
                + ", LATERAL jsonb_object_keys(lba.previous_fy_allocations) AS sector"
                + LgoBudgetAllocationFilterSqlSupport.whereClause(filter, params)
                + " GROUP BY sector ORDER BY cnt DESC, sector ASC LIMIT :limit";
        return mapSectorRows(runQuery(sql, params));
    }

    List<LgoBudgetAllocationSectorCount> countBySector(LgoBudgetAllocationDashboardFilter filter) {
        Map<String, Object> params = new HashMap<>();
        String sql = "SELECT sector, COUNT(*) AS cnt"
                + LgoBudgetAllocationFilterSqlSupport.baseFromClause()
                + ", LATERAL jsonb_object_keys(lba.previous_fy_allocations) AS sector"
                + LgoBudgetAllocationFilterSqlSupport.whereClause(filter, params)
                + " GROUP BY sector ORDER BY cnt DESC, sector ASC";
        return mapSectorRows(runQuery(sql, params));
    }

    List<TimeSeriesPoint> countOverTime(
            LgoBudgetAllocationDashboardFilter filter,
            TimeSeriesGranularity granularity
    ) {
        Map<String, Object> params = new HashMap<>();
        String bucketExpression = granularity == TimeSeriesGranularity.WEEK
                ? "date_trunc('week', lba.submitted_at)::date"
                : "lba.submitted_at::date";
        String sql = """
                SELECT %s, COUNT(*)
                """.formatted(bucketExpression) + LgoBudgetAllocationFilterSqlSupport.baseFromClause()
                + LgoBudgetAllocationFilterSqlSupport.whereClause(filter, params) + """
                 GROUP BY 1
                 ORDER BY 1 ASC
                """;
        return runQuery(sql, params).stream()
                .map(row -> new TimeSeriesPoint(toLocalDate(row[0]), ((Number) row[1]).longValue()))
                .toList();
    }

    List<FilterLocationOption> findDistinctDistricts() {
        @SuppressWarnings("unchecked")
        List<Object[]> rows = entityManager.createNativeQuery("""
                SELECT DISTINCT s.district_id, ld.name
                FROM lgo_budget_allocations lba
                JOIN submissions s ON s.id = lba.submission_id
                JOIN locations ld ON ld.id = s.district_id
                WHERE s.form_type = 'LGO_BUDGET_ALLOCATION'
                ORDER BY ld.name ASC
                """).getResultList();
        return rows.stream()
                .map(row -> new FilterLocationOption(toUuid(row[0]), (String) row[1]))
                .toList();
    }

    List<String> findDistinctGenders() {
        return runStringQuery("""
                SELECT DISTINCT s.respondent_gender
                FROM lgo_budget_allocations lba
                JOIN submissions s ON s.id = lba.submission_id
                WHERE s.form_type = 'LGO_BUDGET_ALLOCATION'
                  AND s.respondent_gender IS NOT NULL
                ORDER BY s.respondent_gender ASC
                """);
    }

    List<String> findDistinctAgeGroups() {
        return runStringQuery("""
                SELECT DISTINCT s.respondent_age_group
                FROM lgo_budget_allocations lba
                JOIN submissions s ON s.id = lba.submission_id
                WHERE s.form_type = 'LGO_BUDGET_ALLOCATION'
                  AND s.respondent_age_group IS NOT NULL
                ORDER BY s.respondent_age_group ASC
                """);
    }

    List<String> findDistinctFinancialYearPeriods() {
        return runStringQuery("""
                SELECT DISTINCT s.financial_year_period
                FROM lgo_budget_allocations lba
                JOIN submissions s ON s.id = lba.submission_id
                WHERE s.form_type = 'LGO_BUDGET_ALLOCATION'
                ORDER BY s.financial_year_period ASC
                """);
    }

    LgoBudgetAllocationAnonymisedRecordPage findExportRecords(
            LgoBudgetAllocationDashboardFilter filter,
            PageRequest pageRequest
    ) {
        Map<String, Object> params = new HashMap<>();
        String whereClause = LgoBudgetAllocationFilterSqlSupport.whereClause(filter, params);
        long totalElements = countExportRecords(whereClause, params);

        String sql = """
                SELECT lba.lba_id,
                       s.financial_year_period,
                       s.district_id,
                       ld.name,
                       s.respondent_gender,
                       s.respondent_age_group,
                       lba.previous_fy_allocations::text,
                       lba.submitted_at
                """ + LgoBudgetAllocationFilterSqlSupport.baseFromClause() + """
                 JOIN locations ld ON ld.id = s.district_id
                """ + whereClause + """
                 ORDER BY lba.submitted_at DESC, lba.lba_id DESC
                 LIMIT :pageSize OFFSET :pageOffset
                """;
        params.put("pageSize", pageRequest.size());
        params.put("pageOffset", pageRequest.offset());

        List<LgoBudgetAllocationAnonymisedRecord> items = runQuery(sql, params).stream()
                .map(this::mapExportRecordRow)
                .toList();
        return new LgoBudgetAllocationAnonymisedRecordPage(items, totalElements, pageRequest.page(), pageRequest.size());
    }

    private long countExportRecords(String whereClause, Map<String, Object> params) {
        Map<String, Object> countParams = new HashMap<>(params);
        String sql = "SELECT COUNT(*)" + LgoBudgetAllocationFilterSqlSupport.baseFromClause() + whereClause;
        var query = entityManager.createNativeQuery(sql);
        bindParams(query, countParams);
        return ((Number) query.getSingleResult()).longValue();
    }

    private LgoBudgetAllocationAnonymisedRecord mapExportRecordRow(Object[] row) {
        return new LgoBudgetAllocationAnonymisedRecord(
                toUuid(row[0]),
                (String) row[1],
                toUuid(row[2]),
                (String) row[3],
                (String) row[4],
                (String) row[5],
                row[6] == null ? "{}" : (String) row[6],
                toLocalDateTime(row[7])
        );
    }

    private List<LgoBudgetAllocationSectorCount> mapSectorRows(List<Object[]> rows) {
        return rows.stream()
                .map(row -> new LgoBudgetAllocationSectorCount((String) row[0], ((Number) row[1]).longValue()))
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
        if (value instanceof Timestamp timestamp) {
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
        return LocalDateTime.parse(value.toString());
    }
}
