package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.domain.valueobjects.CollectorReceiptMetrics;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorReceiptMetricsPage;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
class AdminReceiptStatusQueryJpaRepository {

    @PersistenceContext
    private EntityManager entityManager;

    CollectorReceiptMetricsPage findReceiptMetricsByCollector(PageRequest pageRequest) {
        Number total = (Number) entityManager.createNativeQuery("""
                SELECT COUNT(*)
                FROM users u
                WHERE u.role = 'DATA_COLLECTOR'
                """).getSingleResult();

        String sql = """
                SELECT u.id,
                       u.name,
                       COALESCE(SUM(CASE WHEN s.status = 'SYNCED' THEN 1 ELSE 0 END), 0),
                       COALESCE(SUM(CASE WHEN s.status = 'FLAGGED' THEN 1 ELSE 0 END), 0),
                       COALESCE(SUM(CASE WHEN s.status = 'DUPLICATE' THEN 1 ELSE 0 END), 0),
                       MAX(CASE WHEN s.status = 'SYNCED' THEN s.synced_at END)
                FROM users u
                LEFT JOIN submissions s ON s.collector_id = u.id
                WHERE u.role = 'DATA_COLLECTOR'
                GROUP BY u.id, u.name
                ORDER BY u.name ASC
                LIMIT :pageSize OFFSET :pageOffset
                """;
        @SuppressWarnings("unchecked")
        List<Object[]> rows = entityManager.createNativeQuery(sql)
                .setParameter("pageSize", pageRequest.size())
                .setParameter("pageOffset", pageRequest.offset())
                .getResultList();

        return new CollectorReceiptMetricsPage(
                rows.stream().map(this::toMetrics).toList(),
                total.longValue(),
                pageRequest.page(),
                pageRequest.size()
        );
    }

    private CollectorReceiptMetrics toMetrics(Object[] row) {
        return new CollectorReceiptMetrics(
                toUuid(row[0]),
                (String) row[1],
                ((Number) row[2]).longValue(),
                ((Number) row[3]).longValue(),
                ((Number) row[4]).longValue(),
                toLocalDateTime(row[5])
        );
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
