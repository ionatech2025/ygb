package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.persistence.mapper.PublicVisitEventMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.PublicVisitEventJpaRepository;
import com.ionatech.nac.ygb.application.ports.spi.PublicVisitEventRepositoryPort;
import com.ionatech.nac.ygb.domain.model.PublicVisitEvent;
import org.springframework.stereotype.Component;

@Component
public class PublicVisitEventRepositoryAdapter implements PublicVisitEventRepositoryPort {

    private final PublicVisitEventJpaRepository jpaRepository;
    private final PublicVisitEventMapper mapper;

    public PublicVisitEventRepositoryAdapter(
            PublicVisitEventJpaRepository jpaRepository,
            PublicVisitEventMapper mapper
    ) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public PublicVisitEvent save(PublicVisitEvent event) {
        return mapper.toDomain(jpaRepository.save(mapper.toEntity(event)));
    }
}
