package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.dto.AdminReceiptStatusResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.AdminReceiptStatusRestMapper;
import com.ionatech.nac.ygb.application.ports.api.GetAdminReceiptStatusQuery;
import com.ionatech.nac.ygb.domain.valueobjects.AdminReceiptStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/sync")
public class AdminSyncController {

    private final GetAdminReceiptStatusQuery getAdminReceiptStatusQuery;
    private final AdminReceiptStatusRestMapper restMapper;

    public AdminSyncController(
            GetAdminReceiptStatusQuery getAdminReceiptStatusQuery,
            AdminReceiptStatusRestMapper restMapper
    ) {
        this.getAdminReceiptStatusQuery = getAdminReceiptStatusQuery;
        this.restMapper = restMapper;
    }

    @GetMapping("/receipt-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminReceiptStatusResponseDto> getReceiptStatus() {
        AdminReceiptStatus status = getAdminReceiptStatusQuery.getReceiptStatus();
        return ResponseEntity.ok(restMapper.toResponse(status));
    }
}
