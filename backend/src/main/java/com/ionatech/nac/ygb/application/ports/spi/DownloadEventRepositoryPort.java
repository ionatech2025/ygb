package com.ionatech.nac.ygb.application.ports.spi;

import com.ionatech.nac.ygb.domain.model.DownloadEvent;

public interface DownloadEventRepositoryPort {
    DownloadEvent save(DownloadEvent event);
}
