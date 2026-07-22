package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.GetDashboardFilterOptionsQuery;
import com.ionatech.nac.ygb.application.ports.spi.DashboardFilterOptionsRepositoryPort;
import com.ionatech.nac.ygb.application.ports.spi.UserRepositoryPort;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.model.Role;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilterOptions;
import com.ionatech.nac.ygb.domain.valueobjects.FilterCollectorOption;
import com.ionatech.nac.ygb.domain.valueobjects.FilterLocationOption;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

public class GetDashboardFilterOptionsService implements GetDashboardFilterOptionsQuery {

    private final DashboardFilterOptionsRepositoryPort optionsRepositoryPort;
    private final UserRepositoryPort userRepositoryPort;

    public GetDashboardFilterOptionsService(
            DashboardFilterOptionsRepositoryPort optionsRepositoryPort,
            UserRepositoryPort userRepositoryPort
    ) {
        this.optionsRepositoryPort = optionsRepositoryPort;
        this.userRepositoryPort = userRepositoryPort;
    }

    @Override
    public DashboardFilterOptions getOptions(UUID districtId, UUID subcountyId) {
        List<FilterLocationOption> subcounties = districtId == null
                ? List.of()
                : optionsRepositoryPort.findSubcountiesByDistrict(districtId);
        List<FilterLocationOption> parishes = subcountyId == null
                ? List.of()
                : optionsRepositoryPort.findParishesBySubcounty(subcountyId);

        List<FilterCollectorOption> collectors = userRepositoryPort.findActiveByRole(Role.DATA_COLLECTOR).stream()
                .map(user -> new FilterCollectorOption(user.getId(), user.getName()))
                .toList();

        List<String> formTypes = Arrays.stream(FormType.values()).map(Enum::name).toList();

        return new DashboardFilterOptions(
                optionsRepositoryPort.findDistricts(),
                subcounties,
                parishes,
                formTypes,
                optionsRepositoryPort.findDistinctGenders(),
                optionsRepositoryPort.findDistinctAgeGroups(),
                collectors,
                optionsRepositoryPort.findDistinctFinancialYearPeriods()
        );
    }
}
