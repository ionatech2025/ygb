package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.AdminReceiptStatus;

public interface GetAdminReceiptStatusQuery {
    AdminReceiptStatus getReceiptStatus();
}
