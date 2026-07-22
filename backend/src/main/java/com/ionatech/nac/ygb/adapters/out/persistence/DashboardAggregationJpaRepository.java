package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.valueobjects.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
class DashboardAggregationJpaRepository {

    @PersistenceContext
    private EntityManager entityManager;

    long countTotal(DashboardFilter filter) {
        Map<String, Object> params = new java.util.HashMap<>();
        String sql = "SELECT COUNT(*) FROM submissions s" + DashboardFilterSqlSupport.whereClause(filter, params);
        var query = entityManager.createNativeQuery(sql);
        bindParams(query, params);
        return ((Number) query.getSingleResult()).longValue();
    }

    List<DistrictCount> countByDistrict(DashboardFilter filter) {
        Map<String, Object> params = new java.util.HashMap<>();
        String sql = """
                SELECT l.name, s.district_id, COUNT(*)
                FROM submissions s
                JOIN locations l ON l.id = s.district_id
                """ + DashboardFilterSqlSupport.whereClause(filter, params) + """
                 GROUP BY l.name, s.district_id
                 ORDER BY COUNT(*) DESC, l.name ASC
                """;
        return mapDistrictRows(runQuery(sql, params));
    }

    List<GenderCount> countByGender(DashboardFilter filter) {
        Map<String, Object> params = new java.util.HashMap<>();
        String sql = """
                SELECT s.respondent_gender, COUNT(*)
                FROM submissions s
                """ + DashboardFilterSqlSupport.whereClause(filter, params) + """
                 GROUP BY s.respondent_gender
                 ORDER BY COUNT(*) DESC
                """;
        @SuppressWarnings("unchecked")
        List<Object[]> rows = runQuery(sql, params);
        return rows.stream()
                .map(row -> new GenderCount((String) row[0], ((Number) row[1]).longValue()))
                .toList();
    }

    List<TimeSeriesPoint> countOverTime(DashboardFilter filter, TimeSeriesGranularity granularity) {
        Map<String, Object> params = new java.util.HashMap<>();
        String bucketExpression = granularity == TimeSeriesGranularity.WEEK
                ? "date_trunc('week', s.form_completed_at)::date"
                : "s.form_completed_at::date";
        String sql = """
                SELECT %s, COUNT(*)
                FROM submissions s
                """.formatted(bucketExpression) + DashboardFilterSqlSupport.whereClause(filter, params) + """
                 GROUP BY 1
                 ORDER BY 1 ASC
                """;
        @SuppressWarnings("unchecked")
        List<Object[]> rows = runQuery(sql, params);
        return rows.stream()
                .map(row -> new TimeSeriesPoint(toLocalDate(row[0]), ((Number) row[1]).longValue()))
                .toList();
    }

    List<FormTypeCount> countByFormType(DashboardFilter filter) {
        Map<String, Object> params = new java.util.HashMap<>();
        String sql = """
                SELECT s.form_type, COUNT(*)
                FROM submissions s
                """ + DashboardFilterSqlSupport.whereClause(filter, params) + """
                 GROUP BY s.form_type
                 ORDER BY COUNT(*) DESC
                """;
        @SuppressWarnings("unchecked")
        List<Object[]> rows = runQuery(sql, params);
        return rows.stream()
                .map(row -> new FormTypeCount(FormType.valueOf((String) row[0]), ((Number) row[1]).longValue()))
                .toList();
    }

    List<FinancialYearPeriodCount> countByFinancialYearPeriod(DashboardFilter filter) {
        Map<String, Object> params = new java.util.HashMap<>();
        String sql = """
                SELECT s.financial_year_period, COUNT(*)
                FROM submissions s
                """ + DashboardFilterSqlSupport.whereClause(filter, params) + """
                 GROUP BY s.financial_year_period
                 ORDER BY s.financial_year_period ASC
                """;
        @SuppressWarnings("unchecked")
        List<Object[]> rows = runQuery(sql, params);
        return rows.stream()
                .map(row -> new FinancialYearPeriodCount((String) row[0], ((Number) row[1]).longValue()))
                .toList();
    }

    List<AgeGroupCount> countByAgeGroup(DashboardFilter filter) {
        Map<String, Object> params = new java.util.HashMap<>();
        String sql = """
                SELECT s.respondent_age_group, COUNT(*)
                FROM submissions s
                """ + DashboardFilterSqlSupport.whereClause(filter, params) + """
                 GROUP BY s.respondent_age_group
                 ORDER BY COUNT(*) DESC
                """;
        @SuppressWarnings("unchecked")
        List<Object[]> rows = runQuery(sql, params);
        return rows.stream()
                .map(row -> new AgeGroupCount((String) row[0], ((Number) row[1]).longValue()))
                .toList();
    }

    List<HeatmapEntry> countHeatmap(DashboardFilter filter) {
        if (filter.districtId() != null) {
            return countHeatmapByParish(filter);
        }
        return countHeatmapByDistrict(filter);
    }

    private List<HeatmapEntry> countHeatmapByDistrict(DashboardFilter filter) {
        Map<String, Object> params = new java.util.HashMap<>();
        String sql = """
                SELECT l.name, s.district_id, COUNT(*)
                FROM submissions s
                JOIN locations l ON l.id = s.district_id
                """ + DashboardFilterSqlSupport.whereClause(filter, params) + """
                 GROUP BY l.name, s.district_id
                 ORDER BY COUNT(*) DESC, l.name ASC
                """;
        @SuppressWarnings("unchecked")
        List<Object[]> rows = runQuery(sql, params);
        return rows.stream()
                .map(row -> new HeatmapEntry(toUuid(row[1]), null, (String) row[0], ((Number) row[2]).longValue()))
                .toList();
    }

    private List<HeatmapEntry> countHeatmapByParish(DashboardFilter filter) {
        Map<String, Object> params = new java.util.HashMap<>();
        String sql = """
                SELECT l.name, s.district_id, s.parish_id, COUNT(*)
                FROM submissions s
                JOIN locations l ON l.id = s.parish_id
                """ + DashboardFilterSqlSupport.whereClause(filter, params) + """
                 GROUP BY l.name, s.district_id, s.parish_id
                 ORDER BY COUNT(*) DESC, l.name ASC
                """;
        @SuppressWarnings("unchecked")
        List<Object[]> rows = runQuery(sql, params);
        return rows.stream()
                .map(row -> new HeatmapEntry(
                        toUuid(row[1]),
                        toUuid(row[2]),
                        (String) row[0],
                        ((Number) row[3]).longValue()
                ))
                .toList();
    }

    private List<DistrictCount> mapDistrictRows(List<Object[]> rows) {
        return rows.stream()
                .map(row -> new DistrictCount(
                        (String) row[0],
                        toUuid(row[1]),
                        ((Number) row[2]).longValue()
                ))
                .toList();
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
}
