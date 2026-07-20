package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.persistence.entity.AdminLocationJpaEntity;
import com.ionatech.nac.ygb.adapters.out.persistence.mapper.AdminLocationMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.AdminLocationJpaRepository;
import com.ionatech.nac.ygb.application.ports.spi.AdminLocationRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.AdminLocation;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AdminLocationRepositoryAdapter implements AdminLocationRepositoryPort {

    private final AdminLocationJpaRepository jpaRepository;
    private final AdminLocationMapper mapper;

    public AdminLocationRepositoryAdapter(AdminLocationJpaRepository jpaRepository, AdminLocationMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public List<AdminLocation> findAll() {
        List<AdminLocationJpaEntity> entities = jpaRepository.findAll();
        return mapper.toDomainList(entities);
    }
}
