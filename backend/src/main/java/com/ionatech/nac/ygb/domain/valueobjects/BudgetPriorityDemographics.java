package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.Map;
import java.util.Set;

public final class BudgetPriorityDemographics {

    public static final String FULL_NAME = "fullName";
    public static final String PHONE_NUMBER = "phoneNumber";
    public static final String AGE_GROUP = "ageGroup";
    public static final String GENDER = "gender";
    public static final String DISTRICT_ID = "districtId";

    private static final Set<String> REQUIRED_KEYS = Set.of(
            FULL_NAME,
            PHONE_NUMBER,
            AGE_GROUP,
            GENDER,
            DISTRICT_ID
    );

    private BudgetPriorityDemographics() {
    }

    public static void validateRequiredFields(Map<String, Object> demographics) {
        if (demographics == null || demographics.isEmpty()) {
            throw new IllegalArgumentException("Demographic data cannot be null or empty");
        }
        for (String key : REQUIRED_KEYS) {
            Object value = demographics.get(key);
            if (value == null || String.valueOf(value).trim().isEmpty()) {
                throw new IllegalArgumentException("Demographic field '%s' is required".formatted(key));
            }
        }
    }

    public static String extractPhoneNumber(Map<String, Object> demographics) {
        validateRequiredFields(demographics);
        return String.valueOf(demographics.get(PHONE_NUMBER)).trim();
    }
}
