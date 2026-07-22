package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.LocationHierarchyPort;
import com.ionatech.nac.ygb.domain.exceptions.InvalidDashboardFilterException;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class DashboardFilterHierarchyValidatorTest {

    private LocationHierarchyPort locationHierarchyPort;
    private DashboardFilterHierarchyValidator validator;

    private final UUID districtId = UUID.randomUUID();
    private final UUID subcountyId = UUID.randomUUID();
    private final UUID parishId = UUID.randomUUID();
    private final UUID wrongSubcountyId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        locationHierarchyPort = mock(LocationHierarchyPort.class);
        validator = new DashboardFilterHierarchyValidator(locationHierarchyPort);
    }

    @Test
    void shouldAcceptConsistentLocationHierarchy() {
        when(locationHierarchyPort.findParentId(parishId)).thenReturn(Optional.of(subcountyId));
        when(locationHierarchyPort.findParentId(subcountyId)).thenReturn(Optional.of(districtId));

        DashboardFilter filter = new DashboardFilter(
                districtId, subcountyId, parishId, null, null, null, null, null, null, null
        );

        assertThatCode(() -> validator.validate(filter)).doesNotThrowAnyException();
    }

    @Test
    void shouldRejectParishThatDoesNotBelongToSelectedSubcounty() {
        when(locationHierarchyPort.findParentId(parishId)).thenReturn(Optional.of(wrongSubcountyId));

        DashboardFilter filter = new DashboardFilter(
                null, subcountyId, parishId, null, null, null, null, null, null, null
        );

        assertThatThrownBy(() -> validator.validate(filter))
                .isInstanceOf(InvalidDashboardFilterException.class)
                .hasMessageContaining("Parish does not belong to the selected sub-county");
    }
}
