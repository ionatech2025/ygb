package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.domain.model.BudgetPrioritySection;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityDashboardFilter;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

final class BudgetPriorityFilterSqlSupport {

    private BudgetPriorityFilterSqlSupport() {
    }

    static String whereClause(BudgetPriorityDashboardFilter filter, Map<String, Object> params) {
        return appendPredicates(filter, params, "bps");
    }

    private static String appendPredicates(
            BudgetPriorityDashboardFilter filter,
            Map<String, Object> params,
            String alias
    ) {
        StringBuilder where = new StringBuilder(" WHERE 1=1 ");
        if (filter.section() != null) {
            where.append(" AND ").append(alias).append(".section = :section ");
            params.put("section", filter.section().name());
        }
        appendJsonUuid(where, params, alias, "districtId", "districtId", filter.districtId());
        appendJsonUuid(where, params, alias, "subcountyId", "subcountyId", filter.subcountyId());
        appendJsonUuid(where, params, alias, "parishId", "parishId", filter.parishId());
        if (filter.gender() != null) {
            where.append(" AND ").append(alias).append(".demographic_data->>'gender' = :gender ");
            params.put("gender", filter.gender());
        }
        if (filter.ageGroup() != null) {
            where.append(" AND ").append(alias).append(".demographic_data->>'ageGroup' = :ageGroup ");
            params.put("ageGroup", filter.ageGroup());
        }
        if (filter.financialYearPeriod() != null) {
            where.append(" AND ").append(alias).append(".financial_year_period = :financialYearPeriod ");
            params.put("financialYearPeriod", filter.financialYearPeriod());
        }
        appendDateRange(where, params, alias, filter.dateFrom(), filter.dateTo());
        return where.toString();
    }

    private static void appendJsonUuid(
            StringBuilder where,
            Map<String, Object> params,
            String alias,
            String jsonKey,
            String paramName,
            UUID value
    ) {
        if (value == null) {
            return;
        }
        where.append(" AND (")
                .append(alias)
                .append(".demographic_data->>'")
                .append(jsonKey)
                .append("')::uuid = :")
                .append(paramName)
                .append(' ');
        params.put(paramName, value);
    }

    private static void appendDateRange(
            StringBuilder where,
            Map<String, Object> params,
            String alias,
            LocalDate dateFrom,
            LocalDate dateTo
    ) {
        if (dateFrom != null) {
            where.append(" AND ").append(alias).append(".submitted_at >= :dateFrom ");
            params.put("dateFrom", dateFrom.atStartOfDay());
        }
        if (dateTo != null) {
            where.append(" AND ").append(alias).append(".submitted_at < :dateToExclusive ");
            params.put("dateToExclusive", dateTo.plusDays(1).atStartOfDay());
        }
    }

    static String toApiSection(String dbSection) {
        return BudgetPrioritySection.valueOf(dbSection).toApiSegment();
    }
}
