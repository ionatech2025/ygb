package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class DashboardFilterSqlSupportTest {

    @Test
    void shouldBuildAndPredicateForDistrictAndFormType() {
        UUID districtId = UUID.randomUUID();
        DashboardFilter filter = new DashboardFilter(
                districtId, null, null, FormType.BYP, null, null, null, null, null, null
        );
        var params = new HashMap<String, Object>();

        String whereClause = DashboardFilterSqlSupport.whereClause(filter, params);

        assertThat(whereClause).contains("s.district_id = :districtId");
        assertThat(whereClause).contains("s.form_type = :formType");
        assertThat(params).containsEntry("districtId", districtId);
        assertThat(params).containsEntry("formType", "BYP");
    }

    @Test
    void emptyFilterShouldOnlyIncludeBasePredicate() {
        var params = new HashMap<String, Object>();

        String whereClause = DashboardFilterSqlSupport.whereClause(DashboardFilter.empty(), params);

        assertThat(whereClause).isEqualTo(" WHERE 1=1 ");
        assertThat(params).isEmpty();
    }
}
