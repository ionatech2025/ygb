package com.ionatech.nac.ygb.adapters.out.persistence.repository;

import com.ionatech.nac.ygb.adapters.out.persistence.entity.DownloadSessionJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface DownloadSessionJpaRepository extends JpaRepository<DownloadSessionJpaEntity, UUID> {
    Optional<DownloadSessionJpaEntity> findByToken(String token);
}
