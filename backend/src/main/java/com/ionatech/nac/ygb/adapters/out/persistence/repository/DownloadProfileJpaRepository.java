package com.ionatech.nac.ygb.adapters.out.persistence.repository;

import com.ionatech.nac.ygb.adapters.out.persistence.entity.DownloadProfileJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DownloadProfileJpaRepository extends JpaRepository<DownloadProfileJpaEntity, UUID> {
}
