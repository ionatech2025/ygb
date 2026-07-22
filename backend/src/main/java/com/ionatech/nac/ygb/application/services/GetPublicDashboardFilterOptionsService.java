package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.GetPublicDashboardFilterOptionsQuery;
import com.ionatech.nac.ygb.application.ports.spi.DashboardFilterOptionsRepositoryPort;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.valueobjects.FilterLocationOption;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDashboardFilterOptions;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

public class GetPublicDashboardFilterOptionsService implements GetPublicDashboardFilterOptionsQuery {

    private final DashboardFilterOptionsRepositoryPort optionsRepositoryPort;

    public GetPublicDashboardFilterOptionsService(DashboardFilterOptionsRepositoryPort optionsRepositoryPort) {
        this.optionsRepositoryPort = optionsRepositoryPort;
    }

    @Override
    public PublicDashboardFilterOptions getOptions(UUID districtId, UUID subcountyId) {
        List<FilterLocationOption> subcounties = districtId == null
                ? List.of()
                : optionsRepositoryPort.findSubcountiesByDistrict(districtId);
        List<FilterLocationOption> parishes = subcountyId == null
                ? List.of()
                : optionsRepositoryPort.findParishesBySubcounty(subcountyId);

        List<String> formTypes = Arrays.stream(FormType.values()).map(Enum::name).toList();

        // Programme area filter reserved — no persisted column yet (SRS PUB-03).
        return new PublicDashboardFilterOptions(
                optionsRepositoryPort.findDistricts(),
                subcounties,
                parishes,
                formTypes,
                optionsRepositoryPort.findDistinctGenders(),
                optionsRepositoryPort.findDistinctAgeGroups(),
                optionsRepositoryPort.findDistinctFinancialYearPeriods(),
                List.of()
        );
    }
}
