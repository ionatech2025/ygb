package com.ionatech.nac.ygb.application.ports.spi;

import com.ionatech.nac.ygb.domain.model.PublicVisitEvent;

public interface PublicVisitEventRepositoryPort {
    PublicVisitEvent save(PublicVisitEvent event);
}
