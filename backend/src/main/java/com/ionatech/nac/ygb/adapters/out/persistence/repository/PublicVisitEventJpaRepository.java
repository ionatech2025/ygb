package com.ionatech.nac.ygb.adapters.out.persistence.repository;

import com.ionatech.nac.ygb.adapters.out.persistence.entity.PublicVisitEventJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PublicVisitEventJpaRepository extends JpaRepository<PublicVisitEventJpaEntity, UUID> {
}
