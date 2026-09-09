package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
import com.ionatech.nac.ygb.domain.valueobjects.UserPage;

public interface ListActiveDataCollectorsUseCase {
    UserPage listActiveDataCollectors(PageRequest pageRequest);
}
