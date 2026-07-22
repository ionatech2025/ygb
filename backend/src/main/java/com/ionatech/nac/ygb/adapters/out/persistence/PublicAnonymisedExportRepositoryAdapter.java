package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.application.ports.spi.PublicAnonymisedExportRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
import com.ionatech.nac.ygb.domain.valueobjects.PublicAnonymisedRecordPage;
import org.springframework.stereotype.Component;

@Component
public class PublicAnonymisedExportRepositoryAdapter implements PublicAnonymisedExportRepositoryPort {

    private final PublicAnonymisedExportJpaRepository jpaRepository;

    public PublicAnonymisedExportRepositoryAdapter(PublicAnonymisedExportJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public PublicAnonymisedRecordPage findRecordsByFilter(DashboardFilter filter, PageRequest pageRequest) {
        return jpaRepository.findRecords(filter, pageRequest);
    }
}
