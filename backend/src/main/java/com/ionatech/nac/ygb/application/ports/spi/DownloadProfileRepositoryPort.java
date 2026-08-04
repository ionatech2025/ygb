package com.ionatech.nac.ygb.application.ports.spi;

import com.ionatech.nac.ygb.domain.model.DownloadProfile;

import java.util.Optional;
import java.util.UUID;

public interface DownloadProfileRepositoryPort {
    DownloadProfile save(DownloadProfile profile);

    Optional<DownloadProfile> findById(UUID id);
}
