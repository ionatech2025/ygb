package com.ionatech.nac.ygb.application.ports.spi;

import java.util.Optional;
import java.util.UUID;

public interface LocationHierarchyPort {
    Optional<UUID> findParentId(UUID locationId);
}
