package com.ionatech.nac.ygb.domain.valueobjects;

import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

class BudgetPriorityDemographicsTest {

    private Map<String, Object> validDemographics() {
        Map<String, Object> demographics = new HashMap<>();
        demographics.put(BudgetPriorityDemographics.FULL_NAME, "Jane Nakato");
        demographics.put(BudgetPriorityDemographics.PHONE_NUMBER, "0772123456");
        demographics.put(BudgetPriorityDemographics.AGE_GROUP, "AGE_20_24");
        demographics.put(BudgetPriorityDemographics.GENDER, "FEMALE");
        demographics.put(BudgetPriorityDemographics.DISTRICT_ID, UUID.randomUUID().toString());
        return demographics;
    }

    @Test
    void shouldAcceptValidDemographics() {
        BudgetPriorityDemographics.validateRequiredFields(validDemographics());
    }

    @Test
    void shouldRejectMissingFullName() {
        Map<String, Object> demographics = validDemographics();
        demographics.put(BudgetPriorityDemographics.FULL_NAME, "  ");

        assertThatThrownBy(() -> BudgetPriorityDemographics.validateRequiredFields(demographics))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("fullName");
    }

    @Test
    void shouldRejectMissingDistrictId() {
        Map<String, Object> demographics = validDemographics();
        demographics.remove(BudgetPriorityDemographics.DISTRICT_ID);

        assertThatThrownBy(() -> BudgetPriorityDemographics.validateRequiredFields(demographics))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("districtId");
    }
}
