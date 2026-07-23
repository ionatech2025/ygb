package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.RecordLgoBudgetAllocationCommand;
import com.ionatech.nac.ygb.application.ports.api.RecordLgoBudgetAllocationResult;
import com.ionatech.nac.ygb.application.ports.api.RecordLgoBudgetAllocationUseCase;
import com.ionatech.nac.ygb.application.ports.spi.LgoBudgetAllocationRepositoryPort;
import com.ionatech.nac.ygb.application.ports.spi.SubmissionRepositoryPort;
import com.ionatech.nac.ygb.application.ports.spi.UserRepositoryPort;
import com.ionatech.nac.ygb.domain.exceptions.InvalidUserOperationException;
import com.ionatech.nac.ygb.domain.exceptions.UserNotFoundException;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.model.LgoBudgetAllocation;
import com.ionatech.nac.ygb.domain.model.LgoBudgetAllocationSubmission;
import com.ionatech.nac.ygb.domain.model.Role;
import com.ionatech.nac.ygb.domain.model.Submission;
import com.ionatech.nac.ygb.domain.valueobjects.Location;
import com.ionatech.nac.ygb.domain.valueobjects.PriorYearAllocationBreakdown;
import com.ionatech.nac.ygb.domain.valueobjects.Rationale;
import com.ionatech.nac.ygb.domain.valueobjects.Recommendation;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionMetadata;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionStatus;

import java.util.UUID;

public class RecordLgoBudgetAllocationService implements RecordLgoBudgetAllocationUseCase {

    private final UserRepositoryPort userRepositoryPort;
    private final SubmissionRepositoryPort submissionRepositoryPort;
    private final SaveLgoBudgetAllocationService saveLgoBudgetAllocationService;

    public RecordLgoBudgetAllocationService(
            UserRepositoryPort userRepositoryPort,
            SubmissionRepositoryPort submissionRepositoryPort,
            SaveLgoBudgetAllocationService saveLgoBudgetAllocationService
    ) {
        this.userRepositoryPort = userRepositoryPort;
        this.submissionRepositoryPort = submissionRepositoryPort;
        this.saveLgoBudgetAllocationService = saveLgoBudgetAllocationService;
    }

    @Override
    public RecordLgoBudgetAllocationResult record(RecordLgoBudgetAllocationCommand command) {
        verifyCollector(command.collectorUserId());

        return submissionRepositoryPort.findByDeviceSubmissionId(command.deviceSubmissionId())
                .map(existing -> resolveExistingSubmission(existing, command.collectorUserId()))
                .orElseGet(() -> createSubmissionAndAllocation(command));
    }

    private void verifyCollector(UUID collectorUserId) {
        var user = userRepositoryPort.findById(collectorUserId)
                .orElseThrow(() -> new UserNotFoundException(collectorUserId));
        if (user.getRole() != Role.DATA_COLLECTOR) {
            throw new InvalidUserOperationException("Only data collectors can record LGO budget allocations.");
        }
    }

    private RecordLgoBudgetAllocationResult resolveExistingSubmission(Submission existing, UUID collectorUserId) {
        if (existing.getFormType() != FormType.LGO_BUDGET_ALLOCATION) {
            throw new IllegalArgumentException("Device submission id is already associated with a different form type.");
        }
        if (!existing.getMetadata().collectorId().equals(collectorUserId)) {
            throw new InvalidUserOperationException("Device submission belongs to another collector.");
        }

        LgoBudgetAllocation allocation = saveLgoBudgetAllocationService.findBySubmissionId(existing.getId())
                .orElseThrow(() -> new IllegalStateException("Submission exists without a linked LGO budget allocation."));

        return toResult(existing, allocation);
    }

    private RecordLgoBudgetAllocationResult createSubmissionAndAllocation(RecordLgoBudgetAllocationCommand command) {
        SubmissionMetadata metadata = new SubmissionMetadata(
                command.collectorUserId(),
                command.deviceSubmissionId(),
                command.formCompletedAt()
        );
        Location location = new Location(
                command.districtId(),
                command.subcountyId(),
                command.parishId(),
                command.villageId()
        );

        LgoBudgetAllocationSubmission submission = new LgoBudgetAllocationSubmission(
                UUID.randomUUID(),
                metadata,
                location,
                command.respondentName().trim(),
                command.respondentPhone().trim(),
                command.respondentGender().trim(),
                command.respondentAgeGroup()
        );
        submission.validate();
        applySyncStatus(submission);

        Submission savedSubmission = submissionRepositoryPort.save(submission);

        LgoBudgetAllocation allocation = LgoBudgetAllocation.recordNew(
                savedSubmission.getId(),
                new PriorYearAllocationBreakdown(command.priorYearAllocations()),
                new Rationale(command.rationale()),
                new Recommendation(command.recommendations()),
                command.formCompletedAt()
        );

        LgoBudgetAllocation savedAllocation = saveLgoBudgetAllocationService.save(allocation);
        return toResult(savedSubmission, savedAllocation);
    }

    private void applySyncStatus(LgoBudgetAllocationSubmission submission) {
        boolean existsSynced = submissionRepositoryPort.existsByRespondentPhoneAndFormTypeAndFinancialYearPeriodAndStatus(
                submission.getRespondentPhone(),
                FormType.LGO_BUDGET_ALLOCATION,
                submission.getMetadata().financialYearPeriod().toString(),
                SubmissionStatus.SYNCED
        );
        submission.setStatus(existsSynced ? SubmissionStatus.FLAGGED : SubmissionStatus.SYNCED);
    }

    private static RecordLgoBudgetAllocationResult toResult(Submission submission, LgoBudgetAllocation allocation) {
        return new RecordLgoBudgetAllocationResult(
                submission.getId(),
                allocation.getLbaId(),
                submission.getStatus().name()
        );
    }
}
