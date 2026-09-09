package com.ionatech.nac.ygb.application.ports.api;

import java.util.UUID;

public interface DeleteDataCollectorUseCase {
    void delete(UUID userId);
}
