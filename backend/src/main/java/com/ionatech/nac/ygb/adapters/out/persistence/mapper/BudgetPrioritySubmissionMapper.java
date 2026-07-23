package com.ionatech.nac.ygb.adapters.out.persistence.mapper;

import com.ionatech.nac.ygb.adapters.out.persistence.entity.BudgetPrioritySubmissionJpaEntity;
import com.ionatech.nac.ygb.domain.model.BudgetPrioritySection;
import com.ionatech.nac.ygb.domain.model.BudgetPrioritySubmission;
import com.ionatech.nac.ygb.domain.valueobjects.FinancialYearPeriod;
import com.ionatech.nac.ygb.domain.valueobjects.PhoneNumber;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BudgetPrioritySubmissionMapper {

    @Mapping(target = "phoneNumber", expression = "java(submission.getPhoneNumber().getValue())")
    @Mapping(target = "section", expression = "java(submission.getSection().name())")
    @Mapping(target = "financialYearPeriod", expression = "java(submission.getFinancialYearPeriod().toString())")
    BudgetPrioritySubmissionJpaEntity toEntity(BudgetPrioritySubmission submission);

    default BudgetPrioritySubmission toDomain(BudgetPrioritySubmissionJpaEntity entity) {
        if (entity == null) {
            return null;
        }
        return BudgetPrioritySubmission.rehydrate(
                entity.getBpId(),
                PhoneNumber.of(entity.getPhoneNumber()),
                BudgetPrioritySection.valueOf(entity.getSection()),
                entity.getPriorityAreas(),
                entity.getDemographicData(),
                FinancialYearPeriod.fromPersistedString(entity.getFinancialYearPeriod()),
                entity.getSubmittedAt()
        );
    }
}
