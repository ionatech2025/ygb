package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.domain.valueobjects.AdminLocation;
import com.ionatech.nac.ygb.domain.valueobjects.AdminLocationLevel;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class AdminLocationDatasetEtagTest {

    private static final UUID KAMWOKYA_I_PARISH_ID =
            UUID.fromString("496f65c7-febe-4b6a-8f7e-aa23e0041597");

    @Test
    void etagChangesWhenLocationLabelIsCorrected() {
        AdminLocation legacy = new AdminLocation(
                KAMWOKYA_I_PARISH_ID,
                "Kamwokya I",
                UUID.fromString("168009f9-1188-49fb-88e8-70c93e1b7be0"),
                AdminLocationLevel.PARISH
        );
        AdminLocation corrected = new AdminLocation(
                KAMWOKYA_I_PARISH_ID,
                "Kamwokya i",
                legacy.parentId(),
                AdminLocationLevel.PARISH
        );

        String legacyEtag = AdminLocationDatasetEtag.compute(List.of(legacy));
        String correctedEtag = AdminLocationDatasetEtag.compute(List.of(corrected));

        assertThat(correctedEtag).isNotEqualTo(legacyEtag);
    }
}
