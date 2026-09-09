package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.AdminReceiptStatus;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;

public interface GetAdminReceiptStatusQuery {
    AdminReceiptStatus getReceiptStatus(PageRequest pageRequest);
}
