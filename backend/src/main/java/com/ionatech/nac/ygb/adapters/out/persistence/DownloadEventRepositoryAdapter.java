package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.persistence.mapper.DownloadEventMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.DownloadEventJpaRepository;
import com.ionatech.nac.ygb.application.ports.spi.DownloadEventRepositoryPort;
import com.ionatech.nac.ygb.domain.model.DownloadEvent;
import org.springframework.stereotype.Component;

@Component
public class DownloadEventRepositoryAdapter implements DownloadEventRepositoryPort {

    private final DownloadEventJpaRepository jpaRepository;
    private final DownloadEventMapper mapper;

    public DownloadEventRepositoryAdapter(
            DownloadEventJpaRepository jpaRepository,
            DownloadEventMapper mapper
    ) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public DownloadEvent save(DownloadEvent event) {
        return mapper.toDomain(jpaRepository.save(mapper.toEntity(event)));
    }
}
