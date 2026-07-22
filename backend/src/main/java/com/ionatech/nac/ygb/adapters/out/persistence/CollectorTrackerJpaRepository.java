package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.domain.valueobjects.CollectorLeaderboardEntry;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
class CollectorTrackerJpaRepository {

    @PersistenceContext
    private EntityManager entityManager;

    List<CollectorLeaderboardEntry> findLeaderboard(DashboardFilter filter) {
        Map<String, Object> params = new java.util.HashMap<>();
        String submissionFilters = DashboardFilterSqlSupport.andPredicates(filter, params, "s");
        String sql = """
                SELECT u.id, u.name, COUNT(s.id)
                FROM users u
                LEFT JOIN submissions s ON s.collector_id = u.id
                """ + submissionFilters + """
                 WHERE u.role = 'DATA_COLLECTOR'
                 GROUP BY u.id, u.name
                 ORDER BY COUNT(s.id) DESC, u.name ASC
                """;
        @SuppressWarnings("unchecked")
        List<Object[]> rows = runQuery(sql, params);
        return rows.stream()
                .map(row -> new CollectorLeaderboardEntry(
                        toUuid(row[0]),
                        (String) row[1],
                        ((Number) row[2]).longValue()
                ))
                .toList();
    }

    @SuppressWarnings("unchecked")
    private List<Object[]> runQuery(String sql, Map<String, Object> params) {
        var query = entityManager.createNativeQuery(sql);
        params.forEach(query::setParameter);
        return query.getResultList();
    }

    private static UUID toUuid(Object value) {
        if (value instanceof UUID uuid) {
            return uuid;
        }
        return UUID.fromString(value.toString());
    }
}
