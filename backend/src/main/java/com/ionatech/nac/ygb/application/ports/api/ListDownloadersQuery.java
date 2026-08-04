package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.DownloadUsageFilter;
import com.ionatech.nac.ygb.domain.valueobjects.DownloaderPage;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;

public interface ListDownloadersQuery {
    DownloaderPage list(DownloadUsageFilter filter, PageRequest pageRequest);
}
