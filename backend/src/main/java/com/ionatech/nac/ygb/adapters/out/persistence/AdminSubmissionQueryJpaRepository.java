package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionPage;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionSummary;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
class AdminSubmissionQueryJpaRepository {

    @PersistenceContext
    private EntityManager entityManager;

    SubmissionPage findSummaries(DashboardFilter filter, PageRequest pageRequest) {
        Map<String, Object> params = new java.util.HashMap<>();
        String whereClause = DashboardFilterSqlSupport.whereClause(filter, params);
        long totalElements = countSummaries(whereClause, params);

        String sql = """
                SELECT s.id, s.form_type, s.respondent_name, s.district_id, d.name,
                       s.collector_id, u.name, s.form_completed_at, s.synced_at,
                       s.status, s.financial_year_period
                FROM submissions s
                JOIN locations d ON d.id = s.district_id
                JOIN users u ON u.id = s.collector_id
                """ + whereClause + """
                 ORDER BY s.form_completed_at DESC, s.id DESC
                 LIMIT :pageSize OFFSET :pageOffset
                """;
        params.put("pageSize", pageRequest.size());
        params.put("pageOffset", pageRequest.offset());

        @SuppressWarnings("unchecked")
        List<Object[]> rows = runQuery(sql, params);
        List<SubmissionSummary> items = rows.stream().map(this::mapSummaryRow).toList();
        return new SubmissionPage(items, totalElements, pageRequest.page(), pageRequest.size());
    }

    private long countSummaries(String whereClause, Map<String, Object> params) {
        Map<String, Object> countParams = new java.util.HashMap<>(params);
        String sql = "SELECT COUNT(*) FROM submissions s" + whereClause;
        var query = entityManager.createNativeQuery(sql);
        bindParams(query, countParams);
        return ((Number) query.getSingleResult()).longValue();
    }

    private SubmissionSummary mapSummaryRow(Object[] row) {
        return new SubmissionSummary(
                toUuid(row[0]),
                FormType.valueOf((String) row[1]),
                (String) row[2],
                toUuid(row[3]),
                (String) row[4],
                toUuid(row[5]),
                (String) row[6],
                toLocalDateTime(row[7]),
                toLocalDateTime(row[8]),
                (String) row[9],
                (String) row[10]
        );
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
        return LocalDateTime.parse(value.toString());
    }
}
