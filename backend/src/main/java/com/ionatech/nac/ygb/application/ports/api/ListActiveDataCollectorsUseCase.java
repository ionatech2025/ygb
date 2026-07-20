package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.model.User;

import java.util.List;

public interface ListActiveDataCollectorsUseCase {
    List<User> listActiveDataCollectors();
}
