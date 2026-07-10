package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.model.User;

public interface CreateDataCollectorUseCase {
    User createDataCollector(CreateDataCollectorCommand command);
}
