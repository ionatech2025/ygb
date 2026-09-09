package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.domain.valueobjects.CollectorLeaderboardEntry;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorLeaderboardPage;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.LeaderboardSort;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
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

    CollectorLeaderboardPage findLeaderboard(
            DashboardFilter filter,
            PageRequest pageRequest,
            LeaderboardSort sort
    ) {
        Map<String, Object> params = new java.util.HashMap<>();
        String submissionFilters = DashboardFilterSqlSupport.andPredicates(filter, params, "s");
        String orderBy = orderByClause(sort);

        String countSql = """
                SELECT COUNT(*)
                FROM users u
                WHERE u.role = 'DATA_COLLECTOR'
                """;
        Number total = (Number) entityManager.createNativeQuery(countSql).getSingleResult();

        String sql = """
                SELECT u.id, u.name, COUNT(s.id)
                FROM users u
                LEFT JOIN submissions s ON s.collector_id = u.id
                """ + submissionFilters + """
                 WHERE u.role = 'DATA_COLLECTOR'
                 GROUP BY u.id, u.name
                 """ + orderBy + """
                 LIMIT :pageSize OFFSET :pageOffset
                """;
        params.put("pageSize", pageRequest.size());
        params.put("pageOffset", pageRequest.offset());

        @SuppressWarnings("unchecked")
        List<Object[]> rows = runQuery(sql, params);
        List<CollectorLeaderboardEntry> items = rows.stream()
                .map(row -> new CollectorLeaderboardEntry(
                        toUuid(row[0]),
                        (String) row[1],
                        ((Number) row[2]).longValue()
                ))
                .toList();

        return new CollectorLeaderboardPage(items, total.longValue(), pageRequest.page(), pageRequest.size());
    }

    private static String orderByClause(LeaderboardSort sort) {
        String direction = sort.direction() == LeaderboardSort.Direction.ASC ? "ASC" : "DESC";
        if (sort.key() == LeaderboardSort.Key.FULL_NAME) {
            return " ORDER BY u.name " + direction;
        }
        return " ORDER BY COUNT(s.id) " + direction + ", u.name ASC";
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
