package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.persistence.mapper.DownloadProfileMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.DownloadProfileJpaRepository;
import com.ionatech.nac.ygb.application.ports.spi.DownloadProfileRepositoryPort;
import com.ionatech.nac.ygb.domain.model.DownloadProfile;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
public class DownloadProfileRepositoryAdapter implements DownloadProfileRepositoryPort {

    private final DownloadProfileJpaRepository jpaRepository;
    private final DownloadProfileMapper mapper;

    public DownloadProfileRepositoryAdapter(
            DownloadProfileJpaRepository jpaRepository,
            DownloadProfileMapper mapper
    ) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public DownloadProfile save(DownloadProfile profile) {
        return mapper.toDomain(jpaRepository.save(mapper.toEntity(profile)));
    }

    @Override
    public Optional<DownloadProfile> findById(UUID id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }
}
