package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.mapper.ToolFieldDataFilterRequestMapper;
import com.ionatech.nac.ygb.adapters.out.export.ToolFieldExportFilenameBuilder;
import com.ionatech.nac.ygb.application.ports.api.ExportToolFieldDataQuery;
import com.ionatech.nac.ygb.domain.exceptions.InvalidDashboardFilterException;
import com.ionatech.nac.ygb.domain.service.ToolDownloadCatalogue;
import com.ionatech.nac.ygb.domain.valueobjects.ExportFormat;
import com.ionatech.nac.ygb.domain.valueobjects.ToolDownloadDataset;
import com.ionatech.nac.ygb.domain.valueobjects.ToolFieldDataFilter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/downloads")
public class AdminToolDownloadController {

    private final ToolDownloadCatalogue catalogue;
    private final ExportToolFieldDataQuery exportToolFieldDataQuery;
    private final ToolFieldDataFilterRequestMapper filterRequestMapper;

    public AdminToolDownloadController(
            ToolDownloadCatalogue catalogue,
            ExportToolFieldDataQuery exportToolFieldDataQuery,
            ToolFieldDataFilterRequestMapper filterRequestMapper
    ) {
        this.catalogue = catalogue;
        this.exportToolFieldDataQuery = exportToolFieldDataQuery;
        this.filterRequestMapper = filterRequestMapper;
    }

    @GetMapping("/{dataset}/csv")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StreamingResponseBody> downloadCsv(
            @PathVariable String dataset,
            @RequestParam(value = "districtId", required = false) UUID districtId,
            @RequestParam(value = "subcountyId", required = false) UUID subcountyId,
            @RequestParam(value = "parishId", required = false) UUID parishId,
            @RequestParam(value = "gender", required = false) String gender,
            @RequestParam(value = "ageGroup", required = false) String ageGroup,
            @RequestParam(value = "financialYearPeriod", required = false) String financialYearPeriod
    ) {
        return export(
                dataset,
                filterRequestMapper.toFilter(districtId, subcountyId, parishId, gender, ageGroup, financialYearPeriod),
                ExportFormat.CSV
        );
    }

    @GetMapping("/{dataset}/excel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StreamingResponseBody> downloadExcel(
            @PathVariable String dataset,
            @RequestParam(value = "districtId", required = false) UUID districtId,
            @RequestParam(value = "subcountyId", required = false) UUID subcountyId,
            @RequestParam(value = "parishId", required = false) UUID parishId,
            @RequestParam(value = "gender", required = false) String gender,
            @RequestParam(value = "ageGroup", required = false) String ageGroup,
            @RequestParam(value = "financialYearPeriod", required = false) String financialYearPeriod
    ) {
        return export(
                dataset,
                filterRequestMapper.toFilter(districtId, subcountyId, parishId, gender, ageGroup, financialYearPeriod),
                ExportFormat.XLSX
        );
    }

    @ExceptionHandler(InvalidDashboardFilterException.class)
    public ResponseEntity<Map<String, String>> handleInvalidDashboardFilter(InvalidDashboardFilterException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
    }

    private ResponseEntity<StreamingResponseBody> export(
            String datasetName,
            ToolFieldDataFilter filter,
            ExportFormat format
    ) {
        ToolDownloadDataset dataset = catalogue.requireHubDataset(datasetName);
        StreamingResponseBody body = output -> exportToolFieldDataQuery.export(dataset, filter, format, output);
        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + ToolFieldExportFilenameBuilder.build(dataset, format) + "\""
                )
                .contentType(MediaType.parseMediaType(format.contentType()))
                .body(body);
    }
}
