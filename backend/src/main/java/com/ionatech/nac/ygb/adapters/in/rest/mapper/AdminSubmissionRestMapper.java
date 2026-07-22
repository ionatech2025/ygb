package com.ionatech.nac.ygb.adapters.in.rest.mapper;

import com.ionatech.nac.ygb.adapters.in.rest.dto.AdminSubmissionDetailDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.SubmissionPageResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.SubmissionSummaryDto;
import com.ionatech.nac.ygb.domain.model.User;
import com.ionatech.nac.ygb.domain.valueobjects.AdminSubmissionDetail;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionPage;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionSummary;
import org.springframework.stereotype.Component;

@Component
public class AdminSubmissionRestMapper {

    private final AdminSubmissionPayloadMapper payloadMapper;

    public AdminSubmissionRestMapper(AdminSubmissionPayloadMapper payloadMapper) {
        this.payloadMapper = payloadMapper;
    }

    public SubmissionPageResponseDto toResponse(SubmissionPage page) {
        return new SubmissionPageResponseDto(
                page.items().stream().map(this::toSummaryDto).toList(),
                page.totalElements(),
                page.page(),
                page.size(),
                page.totalPages()
        );
    }

    public AdminSubmissionDetailDto toDetailResponse(AdminSubmissionDetail detail, User collector) {
        var submission = detail.submission();
        return new AdminSubmissionDetailDto(
                submission.getId(),
                submission.getMetadata().collectorId(),
                collector.getName(),
                submission.getStatus().name(),
                submission.getMetadata().formCompletedAt(),
                detail.syncedAt(),
                detail.financialYearPeriod(),
                payloadMapper.toPayload(submission)
        );
    }

    private SubmissionSummaryDto toSummaryDto(SubmissionSummary summary) {
        return new SubmissionSummaryDto(
                summary.id(),
                summary.formType(),
                summary.respondentName(),
                summary.districtId(),
                summary.districtName(),
                summary.collectorId(),
                summary.collectorName(),
                summary.formCompletedAt(),
                summary.syncedAt(),
                summary.status(),
                summary.financialYearPeriod()
        );
    }
}
