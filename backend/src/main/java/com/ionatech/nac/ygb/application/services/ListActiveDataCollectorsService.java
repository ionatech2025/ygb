package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.ListActiveDataCollectorsUseCase;
import com.ionatech.nac.ygb.application.ports.spi.UserRepositoryPort;
import com.ionatech.nac.ygb.domain.model.Role;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
import com.ionatech.nac.ygb.domain.valueobjects.UserPage;

public class ListActiveDataCollectorsService implements ListActiveDataCollectorsUseCase {

    private final UserRepositoryPort userRepositoryPort;

    public ListActiveDataCollectorsService(UserRepositoryPort userRepositoryPort) {
        this.userRepositoryPort = userRepositoryPort;
    }

    @Override
    public UserPage listActiveDataCollectors(PageRequest pageRequest) {
        PageRequest effective = pageRequest != null ? pageRequest : PageRequest.of(0, 25);
        return userRepositoryPort.findActiveByRole(Role.DATA_COLLECTOR, effective);
    }
}
