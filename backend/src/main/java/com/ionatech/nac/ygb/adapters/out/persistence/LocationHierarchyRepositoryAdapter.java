package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.application.ports.spi.LocationHierarchyPort;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
public class LocationHierarchyRepositoryAdapter implements LocationHierarchyPort {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<UUID> findParentId(UUID locationId) {
        if (locationId == null) {
            return Optional.empty();
        }
        var query = entityManager.createNativeQuery("SELECT parent_id FROM locations WHERE id = :id");
        query.setParameter("id", locationId);
        @SuppressWarnings("unchecked")
        var results = query.getResultList();
        if (results.isEmpty()) {
            return Optional.empty();
        }
        Object result = results.get(0);
        if (result == null) {
            return Optional.empty();
        }
        if (result instanceof UUID uuid) {
            return Optional.of(uuid);
        }
        return Optional.of(UUID.fromString(result.toString()));
    }
}
