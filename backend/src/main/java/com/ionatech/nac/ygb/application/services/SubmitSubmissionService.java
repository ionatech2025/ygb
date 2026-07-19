package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.*;
import com.ionatech.nac.ygb.application.ports.spi.SubmissionRepositoryPort;
import com.ionatech.nac.ygb.domain.exceptions.DuplicateSyncedSubmissionException;
import com.ionatech.nac.ygb.domain.model.*;
import com.ionatech.nac.ygb.domain.valueobjects.*;

import java.util.UUID;

public class SubmitSubmissionService implements SubmitSubmissionUseCase {

    // Total attempts = 1 initial + 2 retries, covering realistic multi-device race conditions.
    private static final int MAX_ATTEMPTS = 3;

    private final SubmissionRepositoryPort repositoryPort;

    public SubmitSubmissionService(SubmissionRepositoryPort repositoryPort) {
        this.repositoryPort = repositoryPort;
    }

    @Override
    public Submission submit(SubmitSubmissionCommand command) {
        Submission submission = mapToDomain(command);
        submission.validate();
        return saveWithRetry(submission, MAX_ATTEMPTS);
    }

    /**
     * Attempts to determine the correct status (SYNCED vs FLAGGED) and persist the submission.
     * On a DB-level unique-index violation (concurrent race condition), the existence check is
     * re-evaluated and the save is retried. After all attempts are exhausted the exception propagates.
     */
    private Submission saveWithRetry(Submission submission, int remainingAttempts) {
        boolean existsSynced = repositoryPort.existsByRespondentPhoneAndFormTypeAndFinancialYearPeriodAndStatus(
                submission.getRespondentPhone(),
                submission.getFormType(),
                submission.getMetadata().financialYearPeriod().toString(),
                SubmissionStatus.SYNCED
        );

        submission.setStatus(existsSynced ? SubmissionStatus.FLAGGED : SubmissionStatus.SYNCED);

        try {
            return repositoryPort.save(submission);
        } catch (DuplicateSyncedSubmissionException ex) {
            if (remainingAttempts > 1) {
                return saveWithRetry(submission, remainingAttempts - 1);
            }
            throw ex;
        }
    }

    private Submission mapToDomain(SubmitSubmissionCommand command) {
        SubmissionMetadata metadata = new SubmissionMetadata(
                command.collectorId(),
                command.deviceSubmissionId(),
                command.formCompletedAt()
        );

        Location location = new Location(
                command.districtId(),
                command.subcountyId(),
                command.parishId(),
                command.villageId()
        );

        return switch (command) {
            case BypSubmitCommand byp -> new BypSubmission(
                    UUID.randomUUID(),
                    metadata,
                    location,
                    byp.respondentName(),
                    byp.respondentPhone(),
                    byp.respondentGender(),
                    byp.respondentAgeGroup(),
                    new Age(byp.exactAge()),
                    byp.fundReceiptDuration(),
                    byp.fundReceiptDurationSpecify(),
                    byp.receivedActualAmountRequested(),
                    byp.cashAmountReceived(),
                    byp.instalmentPeriod(),
                    byp.instalmentPeriodSpecify(),
                    byp.serviceRating(),
                    byp.performanceRating(),
                    byp.groupOrganizedTransparently(),
                    byp.receivedBds(),
                    byp.bdsServices(),
                    byp.improvementSuggestion() != null ? new NarrativeText(byp.improvementSuggestion()) : null
            );
            case IypSubmitCommand iyp -> new IypSubmission(
                    UUID.randomUUID(),
                    metadata,
                    location,
                    iyp.respondentName(),
                    iyp.respondentPhone(),
                    iyp.respondentGender(),
                    iyp.respondentAgeGroup(),
                    iyp.awareOfPdm(),
                    iyp.eligibleCriteriaAware(),
                    iyp.appliedForFund(),
                    iyp.accessedFund(),
                    iyp.rejectionNarrative() != null ? new NarrativeText(iyp.rejectionNarrative()) : null,
                    iyp.reasonsForNotApplying(),
                    iyp.informationChannels(),
                    iyp.difficultiesFaced(),
                    iyp.limitationExplanation() != null ? new NarrativeText(iyp.limitationExplanation()) : null,
                    iyp.improvementSuggestion() != null ? new NarrativeText(iyp.improvementSuggestion()) : null
            );
            case LgoSubmitCommand lgo -> new LgoSubmission(
                    UUID.randomUUID(),
                    metadata,
                    location,
                    lgo.respondentName(),
                    lgo.respondentPhone(),
                    lgo.respondentGender(),
                    lgo.respondentAgeGroup(),
                    lgo.fiscalYearRecords(),
                    lgo.fundsSpentAsRequired(),
                    lgo.fundsSpentExplanation() != null ? new NarrativeText(lgo.fundsSpentExplanation()) : null,
                    lgo.economicTransformation(),
                    lgo.economicTransformationExplanation() != null ? new NarrativeText(lgo.economicTransformationExplanation()) : null,
                    lgo.improvementSuggestion() != null ? new NarrativeText(lgo.improvementSuggestion()) : null
            );
            case PcSubmitCommand pc -> new PcSubmission(
                    UUID.randomUUID(),
                    metadata,
                    location,
                    pc.respondentName(),
                    pc.respondentPhone(),
                    pc.respondentGender(),
                    pc.respondentAgeGroup(),
                    pc.amountExpected(),
                    pc.amountReceived(),
                    pc.totalBeneficiaries(),
                    pc.youthBeneficiaries(),
                    pc.youngWomenBeneficiaries(),
                    pc.obstaclesDescription() != null ? new NarrativeText(pc.obstaclesDescription()) : null,
                    pc.spendingTargetedToMostInNeed(),
                    pc.pdcTotalMembers(),
                    pc.pdcYouthMembers(),
                    pc.pdcWomenMembers(),
                    pc.pdcTrainingReceived(),
                    pc.pdcTrainingAreas(),
                    pc.pdcEffectivenessRating(),
                    pc.monitoredBy(),
                    pc.monitoredByOthersSpecify(),
                    pc.monitoringMethod() != null ? new NarrativeText(pc.monitoringMethod()) : null,
                    pc.reportSharedWithRespondent(),
                    pc.improvementsSeen(),
                    pc.improvementsSeenExplanation() != null ? new NarrativeText(pc.improvementsSeenExplanation()) : null,
                    pc.progressReportsSubmitted(),
                    pc.progressReportsSubmittedExplanation() != null ? new NarrativeText(pc.progressReportsSubmittedExplanation()) : null,
                    pc.selfRelianceBeneficiariesCount(),
                    pc.selfRelianceGroupProjectsCount()
            );
        };
    }
}
