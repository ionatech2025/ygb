package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.persistence.mapper.DownloadSessionMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.DownloadSessionJpaRepository;
import com.ionatech.nac.ygb.application.ports.spi.DownloadSessionRepositoryPort;
import com.ionatech.nac.ygb.domain.model.DownloadSession;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DownloadSessionRepositoryAdapter implements DownloadSessionRepositoryPort {

    private final DownloadSessionJpaRepository jpaRepository;
    private final DownloadSessionMapper mapper;

    public DownloadSessionRepositoryAdapter(
            DownloadSessionJpaRepository jpaRepository,
            DownloadSessionMapper mapper
    ) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public DownloadSession save(DownloadSession session) {
        return mapper.toDomain(jpaRepository.save(mapper.toEntity(session)));
    }

    @Override
    public Optional<DownloadSession> findByToken(String token) {
        return jpaRepository.findByToken(token).map(mapper::toDomain);
    }
}
