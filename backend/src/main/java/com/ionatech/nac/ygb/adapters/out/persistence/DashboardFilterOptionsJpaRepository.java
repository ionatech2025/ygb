package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.domain.valueobjects.FilterLocationOption;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
class DashboardFilterOptionsJpaRepository {

    @PersistenceContext
    private EntityManager entityManager;

    List<FilterLocationOption> findDistricts() {
        return mapLocationRows(runQuery(
                "SELECT id, name FROM locations WHERE type = 'DISTRICT' ORDER BY name ASC"
        ));
    }

    List<FilterLocationOption> findSubcountiesByDistrict(UUID districtId) {
        return mapLocationRows(runQuery(
                "SELECT id, name FROM locations WHERE type = 'SUBCOUNTY' AND parent_id = :parentId ORDER BY name ASC",
                "parentId",
                districtId
        ));
    }

    List<FilterLocationOption> findParishesBySubcounty(UUID subcountyId) {
        return mapLocationRows(runQuery(
                "SELECT id, name FROM locations WHERE type = 'PARISH' AND parent_id = :parentId ORDER BY name ASC",
                "parentId",
                subcountyId
        ));
    }

    List<String> findDistinctGenders() {
        return runStringQuery(
                "SELECT DISTINCT respondent_gender FROM submissions ORDER BY respondent_gender ASC"
        );
    }

    List<String> findDistinctAgeGroups() {
        return runStringQuery(
                "SELECT DISTINCT respondent_age_group FROM submissions ORDER BY respondent_age_group ASC"
        );
    }

    List<String> findDistinctFinancialYearPeriods() {
        return runStringQuery(
                "SELECT DISTINCT financial_year_period FROM submissions ORDER BY financial_year_period ASC"
        );
    }

    @SuppressWarnings("unchecked")
    private List<Object[]> runQuery(String sql) {
        return entityManager.createNativeQuery(sql).getResultList();
    }

    @SuppressWarnings("unchecked")
    private List<Object[]> runQuery(String sql, String paramName, UUID paramValue) {
        var query = entityManager.createNativeQuery(sql);
        query.setParameter(paramName, paramValue);
        return query.getResultList();
    }

    private List<FilterLocationOption> mapLocationRows(List<Object[]> rows) {
        return rows.stream()
                .map(row -> new FilterLocationOption(toUuid(row[0]), (String) row[1]))
                .toList();
    }

    @SuppressWarnings("unchecked")
    private List<String> runStringQuery(String sql) {
        return entityManager.createNativeQuery(sql).getResultList();
    }

    private static UUID toUuid(Object value) {
        if (value instanceof UUID uuid) {
            return uuid;
        }
        return UUID.fromString(value.toString());
    }
}
