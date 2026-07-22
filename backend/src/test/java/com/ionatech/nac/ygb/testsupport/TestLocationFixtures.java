package com.ionatech.nac.ygb.testsupport;

import com.ionatech.nac.ygb.domain.valueobjects.Location;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.UUID;

/**
 * Location UUIDs mirrored into {@code locations} by Flyway V11 from {@code admin_locations} (V9 seed).
 * Replaces legacy V3 Arua test IDs removed in V11.
 */
public final class TestLocationFixtures {

    public static final UUID KAMPALA_DISTRICT_ID = UUID.fromString("6a4ec61c-d428-4a51-8af0-721f7d03d492");
    public static final UUID KAMPALA_SUBCOUNTY_ID = UUID.fromString("168009f9-1188-49fb-88e8-70c93e1b7be0");
    public static final UUID KAMPALA_PARISH_ID = UUID.fromString("9ffcadf2-8a59-46d6-8f3d-01ee344828d6");
    public static final UUID KAMPALA_VILLAGE_ID = UUID.fromString("841802f1-87ab-4efd-83f2-c9156ed33459");

    public static final UUID NTUNGAMO_DISTRICT_ID = UUID.fromString("699711bf-2a18-46d7-8011-df048a4ae509");
    public static final UUID NTUNGAMO_SUBCOUNTY_ID = UUID.fromString("06fde045-e93c-4e36-8d42-03b6dacd461c");
    public static final UUID NTUNGAMO_PARISH_ID = UUID.fromString("88135553-37cd-413c-8b18-ab399d772f56");
    public static final UUID NTUNGAMO_VILLAGE_ID = UUID.fromString("9e735a79-fa41-4143-8e88-f9f07dfca1c4");

    public static final String KAMPALA_DISTRICT_NAME = "Kampala";
    public static final String NTUNGAMO_DISTRICT_NAME = "Ntungamo";

    public static Location kampalaLocation() {
        return new Location(KAMPALA_DISTRICT_ID, KAMPALA_SUBCOUNTY_ID, KAMPALA_PARISH_ID, KAMPALA_VILLAGE_ID);
    }

    public static Location ntungamoLocation() {
        return new Location(NTUNGAMO_DISTRICT_ID, NTUNGAMO_SUBCOUNTY_ID, NTUNGAMO_PARISH_ID, NTUNGAMO_VILLAGE_ID);
    }

    public static void clearAllSubmissions(JdbcTemplate jdbcTemplate) {
        jdbcTemplate.update("DELETE FROM submissions");
    }

    private TestLocationFixtures() {}
}
