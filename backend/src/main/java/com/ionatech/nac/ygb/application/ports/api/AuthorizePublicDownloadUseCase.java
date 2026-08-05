package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.model.DownloadSession;
import com.ionatech.nac.ygb.domain.valueobjects.ExportFormat;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDownloadDataset;

public interface AuthorizePublicDownloadUseCase {
    DownloadSession authorizeAndRecord(
            String sessionToken,
            PublicDownloadDataset dataset,
            ExportFormat format,
            String filterFingerprint
    );
}
