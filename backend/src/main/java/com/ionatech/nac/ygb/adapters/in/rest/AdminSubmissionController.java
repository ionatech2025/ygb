package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.dto.AdminSubmissionDetailDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.SubmissionPageResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.AdminSubmissionRestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.mapper.DashboardFilterRequestMapper;
import com.ionatech.nac.ygb.adapters.out.export.ExportFilenameBuilder;
import com.ionatech.nac.ygb.application.ports.api.ExportSubmissionsQuery;
import com.ionatech.nac.ygb.application.ports.api.GetSubmissionDetailQuery;
import com.ionatech.nac.ygb.application.ports.api.ListSubmissionsQuery;
import com.ionatech.nac.ygb.application.ports.spi.UserRepositoryPort;
import com.ionatech.nac.ygb.domain.exceptions.InvalidDashboardFilterException;
import com.ionatech.nac.ygb.domain.exceptions.SubmissionNotFoundException;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.model.User;
import com.ionatech.nac.ygb.domain.valueobjects.AdminSubmissionDetail;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.ExportFormat;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionPage;
import org.springframework.format.annotation.DateTimeFormat;
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

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/submissions")
public class AdminSubmissionController {

    private final ListSubmissionsQuery listSubmissionsQuery;
    private final GetSubmissionDetailQuery getSubmissionDetailQuery;
    private final ExportSubmissionsQuery exportSubmissionsQuery;
    private final UserRepositoryPort userRepositoryPort;
    private final DashboardFilterRequestMapper filterMapper;
    private final AdminSubmissionRestMapper restMapper;

    public AdminSubmissionController(
            ListSubmissionsQuery listSubmissionsQuery,
            GetSubmissionDetailQuery getSubmissionDetailQuery,
            ExportSubmissionsQuery exportSubmissionsQuery,
            UserRepositoryPort userRepositoryPort,
            DashboardFilterRequestMapper filterMapper,
            AdminSubmissionRestMapper restMapper
    ) {
        this.listSubmissionsQuery = listSubmissionsQuery;
        this.getSubmissionDetailQuery = getSubmissionDetailQuery;
        this.exportSubmissionsQuery = exportSubmissionsQuery;
        this.userRepositoryPort = userRepositoryPort;
        this.filterMapper = filterMapper;
        this.restMapper = restMapper;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SubmissionPageResponseDto> listSubmissions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size,
            @RequestParam(required = false) UUID districtId,
            @RequestParam(required = false) UUID subcountyId,
            @RequestParam(required = false) UUID parishId,
            @RequestParam(required = false) FormType formType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String ageGroup,
            @RequestParam(required = false) UUID collectorId,
            @RequestParam(required = false) String financialYearPeriod
    ) {
        DashboardFilter filter = filterMapper.toFilter(
                districtId,
                subcountyId,
                parishId,
                formType,
                dateFrom,
                dateTo,
                gender,
                ageGroup,
                collectorId,
                financialYearPeriod
        );
        SubmissionPage submissionPage = listSubmissionsQuery.list(filter, PageRequest.of(page, size));
        return ResponseEntity.ok(restMapper.toResponse(submissionPage));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminSubmissionDetailDto> getSubmissionDetail(@PathVariable UUID id) {
        AdminSubmissionDetail detail = getSubmissionDetailQuery.getById(id);
        User collector = userRepositoryPort.findById(detail.submission().getMetadata().collectorId())
                .orElseThrow(() -> new IllegalStateException(
                        "Collector not found for submission: " + detail.submission().getId()
                ));
        return ResponseEntity.ok(restMapper.toDetailResponse(detail, collector));
    }

    @GetMapping("/export")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StreamingResponseBody> exportSubmissions(
            @RequestParam String format,
            @RequestParam(required = false) UUID districtId,
            @RequestParam(required = false) UUID subcountyId,
            @RequestParam(required = false) UUID parishId,
            @RequestParam(required = false) FormType formType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String ageGroup,
            @RequestParam(required = false) UUID collectorId,
            @RequestParam(required = false) String financialYearPeriod
    ) {
        ExportFormat exportFormat = ExportFormat.fromParam(format);
        DashboardFilter filter = filterMapper.toFilter(
                districtId,
                subcountyId,
                parishId,
                formType,
                dateFrom,
                dateTo,
                gender,
                ageGroup,
                collectorId,
                financialYearPeriod
        );
        String filename = ExportFilenameBuilder.build(exportFormat);
        StreamingResponseBody body = output -> exportSubmissionsQuery.export(filter, exportFormat, output);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType(exportFormat.contentType()))
                .body(body);
    }

    @ExceptionHandler(InvalidDashboardFilterException.class)
    public ResponseEntity<Map<String, String>> handleInvalidDashboardFilter(InvalidDashboardFilterException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(SubmissionNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleSubmissionNotFound(SubmissionNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
    }
}
