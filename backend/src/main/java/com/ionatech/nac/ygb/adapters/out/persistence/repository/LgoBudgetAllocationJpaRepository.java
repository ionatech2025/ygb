package com.ionatech.nac.ygb.adapters.out.persistence.repository;

import com.ionatech.nac.ygb.adapters.out.persistence.entity.LgoBudgetAllocationJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface LgoBudgetAllocationJpaRepository extends JpaRepository<LgoBudgetAllocationJpaEntity, UUID> {}
