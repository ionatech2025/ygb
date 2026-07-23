package com.ionatech.nac.ygb.adapters.out.persistence.mapper;

import com.ionatech.nac.ygb.adapters.out.persistence.entity.LgoBudgetAllocationJpaEntity;
import com.ionatech.nac.ygb.domain.model.LgoBudgetAllocation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LgoBudgetAllocationMapper {

    @Mapping(target = "lbaId", source = "lbaId")
    @Mapping(target = "submissionId", source = "submissionId")
    @Mapping(target = "previousFyAllocations", source = "previousFyAllocations")
    @Mapping(target = "rationale", source = "rationale")
    @Mapping(target = "recommendations", source = "recommendations")
    @Mapping(target = "submittedAt", source = "submittedAt")
    LgoBudgetAllocationJpaEntity toEntity(LgoBudgetAllocation allocation);

    default LgoBudgetAllocation toDomain(LgoBudgetAllocationJpaEntity entity) {
        if (entity == null) {
            return null;
        }
        return LgoBudgetAllocation.rehydrate(
                entity.getLbaId(),
                entity.getSubmissionId(),
                entity.getPreviousFyAllocations(),
                entity.getRationale(),
                entity.getRecommendations(),
                entity.getSubmittedAt()
        );
    }
}
