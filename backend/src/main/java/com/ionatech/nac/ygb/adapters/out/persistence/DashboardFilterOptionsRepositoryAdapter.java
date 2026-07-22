package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.application.ports.spi.DashboardFilterOptionsRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.FilterLocationOption;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
public class DashboardFilterOptionsRepositoryAdapter implements DashboardFilterOptionsRepositoryPort {

    private final DashboardFilterOptionsJpaRepository jpaRepository;

    public DashboardFilterOptionsRepositoryAdapter(DashboardFilterOptionsJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public List<FilterLocationOption> findDistricts() {
        return jpaRepository.findDistricts();
    }

    @Override
    public List<FilterLocationOption> findSubcountiesByDistrict(UUID districtId) {
        return jpaRepository.findSubcountiesByDistrict(districtId);
    }

    @Override
    public List<FilterLocationOption> findParishesBySubcounty(UUID subcountyId) {
        return jpaRepository.findParishesBySubcounty(subcountyId);
    }

    @Override
    public List<String> findDistinctGenders() {
        return jpaRepository.findDistinctGenders();
    }

    @Override
    public List<String> findDistinctAgeGroups() {
        return jpaRepository.findDistinctAgeGroups();
    }

    @Override
    public List<String> findDistinctFinancialYearPeriods() {
        return jpaRepository.findDistinctFinancialYearPeriods();
    }
}
