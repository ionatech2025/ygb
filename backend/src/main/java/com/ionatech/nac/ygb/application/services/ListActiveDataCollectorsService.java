package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.ListActiveDataCollectorsUseCase;
import com.ionatech.nac.ygb.application.ports.spi.UserRepositoryPort;
import com.ionatech.nac.ygb.domain.model.Role;
import com.ionatech.nac.ygb.domain.model.User;

import java.util.List;

public class ListActiveDataCollectorsService implements ListActiveDataCollectorsUseCase {

    private final UserRepositoryPort userRepositoryPort;

    public ListActiveDataCollectorsService(UserRepositoryPort userRepositoryPort) {
        this.userRepositoryPort = userRepositoryPort;
    }

    @Override
    public List<User> listActiveDataCollectors() {
        return userRepositoryPort.findActiveByRole(Role.DATA_COLLECTOR);
    }
}
