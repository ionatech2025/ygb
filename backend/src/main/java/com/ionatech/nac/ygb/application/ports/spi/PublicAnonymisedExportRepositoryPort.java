package com.ionatech.nac.ygb.application.ports.spi;

import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
import com.ionatech.nac.ygb.domain.valueobjects.PublicAnonymisedRecordPage;

public interface PublicAnonymisedExportRepositoryPort {
    PublicAnonymisedRecordPage findRecordsByFilter(DashboardFilter filter, PageRequest pageRequest);
}
