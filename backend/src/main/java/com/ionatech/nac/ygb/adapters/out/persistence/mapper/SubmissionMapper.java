package com.ionatech.nac.ygb.adapters.out.persistence.mapper;

import com.ionatech.nac.ygb.adapters.out.persistence.entity.*;
import com.ionatech.nac.ygb.domain.model.*;
import com.ionatech.nac.ygb.domain.valueobjects.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class SubmissionMapper {

    public SubmissionJpaEntity toEntity(Submission submission) {
        if (submission == null) {
            return null;
        }
        return switch (submission) {
            case BypSubmission byp -> toBypEntity(byp);
            case IypSubmission iyp -> toIypEntity(iyp);
            case LgoSubmission lgo -> toLgoEntity(lgo);
            case PcSubmission pc -> toPcEntity(pc);
            default -> throw new IllegalArgumentException("Unknown submission type: " + submission.getClass());
        };
    }

    public Submission toDomain(SubmissionJpaEntity entity) {
        if (entity == null) {
            return null;
        }
        return switch (entity) {
            case BypSubmissionJpaEntity byp -> toBypDomain(byp);
            case IypSubmissionJpaEntity iyp -> toIypDomain(iyp);
            case LgoSubmissionJpaEntity lgo -> toLgoDomain(lgo);
            case PcSubmissionJpaEntity pc -> toPcDomain(pc);
            default -> throw new IllegalArgumentException("Unknown JPA entity type: " + entity.getClass());
        };
    }

    // ==========================================
    // BYP MAPPINGS
    // ==========================================
    @Mapping(target = "collectorId", source = "metadata.collectorId")
    @Mapping(target = "deviceSubmissionId", source = "metadata.deviceSubmissionId")
    @Mapping(target = "formCompletedAt", source = "metadata.formCompletedAt")
    @Mapping(target = "financialYearPeriod", expression = "java(submission.getMetadata().financialYearPeriod().toString())")
    @Mapping(target = "districtId", source = "location.districtId")
    @Mapping(target = "subcountyId", source = "location.subcountyId")
    @Mapping(target = "parishId", source = "location.parishId")
    @Mapping(target = "villageId", source = "location.villageId")
    @Mapping(target = "exactAge", source = "exactAge.value")
    @Mapping(target = "improvementSuggestion", source = "improvementSuggestion.value")
    protected abstract BypSubmissionJpaEntity toBypEntity(BypSubmission submission);

    @Mapping(target = "metadata", expression = "java(mapMetadata(entity))")
    @Mapping(target = "location", expression = "java(mapLocation(entity))")
    @Mapping(target = "exactAge", expression = "java(new Age(entity.getExactAge()))")
    @Mapping(target = "improvementSuggestion", expression = "java(new NarrativeText(entity.getImprovementSuggestion()))")
    protected abstract BypSubmission toBypDomain(BypSubmissionJpaEntity entity);

    // ==========================================
    // IYP MAPPINGS
    // ==========================================
    @Mapping(target = "collectorId", source = "metadata.collectorId")
    @Mapping(target = "deviceSubmissionId", source = "metadata.deviceSubmissionId")
    @Mapping(target = "formCompletedAt", source = "metadata.formCompletedAt")
    @Mapping(target = "financialYearPeriod", expression = "java(submission.getMetadata().financialYearPeriod().toString())")
    @Mapping(target = "districtId", source = "location.districtId")
    @Mapping(target = "subcountyId", source = "location.subcountyId")
    @Mapping(target = "parishId", source = "location.parishId")
    @Mapping(target = "villageId", source = "location.villageId")
    @Mapping(target = "rejectionNarrative", expression = "java(submission.getRejectionNarrative() != null ? submission.getRejectionNarrative().getValue() : null)")
    @Mapping(target = "limitationExplanation", expression = "java(submission.getLimitationExplanation() != null ? submission.getLimitationExplanation().getValue() : null)")
    @Mapping(target = "improvementSuggestion", source = "improvementSuggestion.value")
    protected abstract IypSubmissionJpaEntity toIypEntity(IypSubmission submission);

    @Mapping(target = "metadata", expression = "java(mapMetadata(entity))")
    @Mapping(target = "location", expression = "java(mapLocation(entity))")
    @Mapping(target = "rejectionNarrative", expression = "java(entity.getRejectionNarrative() != null ? new NarrativeText(entity.getRejectionNarrative()) : null)")
    @Mapping(target = "limitationExplanation", expression = "java(entity.getLimitationExplanation() != null ? new NarrativeText(entity.getLimitationExplanation()) : null)")
    @Mapping(target = "improvementSuggestion", expression = "java(new NarrativeText(entity.getImprovementSuggestion()))")
    protected abstract IypSubmission toIypDomain(IypSubmissionJpaEntity entity);

    // ==========================================
    // LGO MAPPINGS
    // ==========================================
    @Mapping(target = "collectorId", source = "metadata.collectorId")
    @Mapping(target = "deviceSubmissionId", source = "metadata.deviceSubmissionId")
    @Mapping(target = "formCompletedAt", source = "metadata.formCompletedAt")
    @Mapping(target = "financialYearPeriod", expression = "java(submission.getMetadata().financialYearPeriod().toString())")
    @Mapping(target = "districtId", source = "location.districtId")
    @Mapping(target = "subcountyId", source = "location.subcountyId")
    @Mapping(target = "parishId", source = "location.parishId")
    @Mapping(target = "villageId", source = "location.villageId")
    @Mapping(target = "fundsSpentExplanation", expression = "java(submission.getFundsSpentExplanation() != null ? submission.getFundsSpentExplanation().getValue() : null)")
    @Mapping(target = "economicTransformationExplanation", expression = "java(submission.getEconomicTransformationExplanation() != null ? submission.getEconomicTransformationExplanation().getValue() : null)")
    @Mapping(target = "improvementSuggestion", source = "improvementSuggestion.value")
    protected abstract LgoSubmissionJpaEntity toLgoEntity(LgoSubmission submission);

    @Mapping(target = "metadata", expression = "java(mapMetadata(entity))")
    @Mapping(target = "location", expression = "java(mapLocation(entity))")
    @Mapping(target = "fundsSpentExplanation", expression = "java(entity.getFundsSpentExplanation() != null ? new NarrativeText(entity.getFundsSpentExplanation()) : null)")
    @Mapping(target = "economicTransformationExplanation", expression = "java(entity.getEconomicTransformationExplanation() != null ? new NarrativeText(entity.getEconomicTransformationExplanation()) : null)")
    @Mapping(target = "improvementSuggestion", expression = "java(new NarrativeText(entity.getImprovementSuggestion()))")
    protected abstract LgoSubmission toLgoDomain(LgoSubmissionJpaEntity entity);

    // ==========================================
    // PC MAPPINGS
    // ==========================================
    @Mapping(target = "collectorId", source = "metadata.collectorId")
    @Mapping(target = "deviceSubmissionId", source = "metadata.deviceSubmissionId")
    @Mapping(target = "formCompletedAt", source = "metadata.formCompletedAt")
    @Mapping(target = "financialYearPeriod", expression = "java(submission.getMetadata().financialYearPeriod().toString())")
    @Mapping(target = "districtId", source = "location.districtId")
    @Mapping(target = "subcountyId", source = "location.subcountyId")
    @Mapping(target = "parishId", source = "location.parishId")
    @Mapping(target = "villageId", source = "location.villageId")
    @Mapping(target = "obstaclesDescription", source = "obstaclesDescription.value")
    @Mapping(target = "monitoringMethod", source = "monitoringMethod.value")
    @Mapping(target = "improvementsSeenExplanation", expression = "java(submission.getImprovementsSeenExplanation() != null ? submission.getImprovementsSeenExplanation().getValue() : null)")
    @Mapping(target = "progressReportsSubmittedExplanation", expression = "java(submission.getProgressReportsSubmittedExplanation() != null ? submission.getProgressReportsSubmittedExplanation().getValue() : null)")
    protected abstract PcSubmissionJpaEntity toPcEntity(PcSubmission submission);

    @Mapping(target = "metadata", expression = "java(mapMetadata(entity))")
    @Mapping(target = "location", expression = "java(mapLocation(entity))")
    @Mapping(target = "obstaclesDescription", expression = "java(new NarrativeText(entity.getObstaclesDescription()))")
    @Mapping(target = "monitoringMethod", expression = "java(new NarrativeText(entity.getMonitoringMethod()))")
    @Mapping(target = "improvementsSeenExplanation", expression = "java(entity.getImprovementsSeenExplanation() != null ? new NarrativeText(entity.getImprovementsSeenExplanation()) : null)")
    @Mapping(target = "progressReportsSubmittedExplanation", expression = "java(entity.getProgressReportsSubmittedExplanation() != null ? new NarrativeText(entity.getProgressReportsSubmittedExplanation()) : null)")
    protected abstract PcSubmission toPcDomain(PcSubmissionJpaEntity entity);

    // ==========================================
    // HELPER MAPPING METHODS
    // ==========================================
    protected SubmissionMetadata mapMetadata(SubmissionJpaEntity entity) {
        return new SubmissionMetadata(
                entity.getCollectorId(),
                entity.getDeviceSubmissionId(),
                entity.getFormCompletedAt());
    }

    protected Location mapLocation(SubmissionJpaEntity entity) {
        return new Location(
                entity.getDistrictId(),
                entity.getSubcountyId(),
                entity.getParishId(),
                entity.getVillageId());
    }
}
