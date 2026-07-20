package com.ionatech.nac.ygb.adapters.out.persistence.repository;

import com.ionatech.nac.ygb.adapters.out.persistence.entity.AdminLocationJpaEntity;
import com.ionatech.nac.ygb.domain.valueobjects.AdminLocationLevel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AdminLocationJpaRepository extends JpaRepository<AdminLocationJpaEntity, UUID> {
    List<AdminLocationJpaEntity> findByLevel(AdminLocationLevel level);
}
