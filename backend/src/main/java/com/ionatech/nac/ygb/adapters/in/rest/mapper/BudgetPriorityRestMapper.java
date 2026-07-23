package com.ionatech.nac.ygb.adapters.in.rest.mapper;

import com.ionatech.nac.ygb.adapters.in.rest.dto.BudgetPriorityDemographicsDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.BudgetPrioritySubmissionRequestDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.BudgetPrioritySubmissionResponseDto;
import com.ionatech.nac.ygb.application.ports.api.SubmitBudgetPriorityCommand;
import com.ionatech.nac.ygb.domain.model.BudgetPrioritySection;
import com.ionatech.nac.ygb.domain.model.BudgetPrioritySubmission;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityDemographics;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.LinkedHashMap;
import java.util.Map;

@Mapper(componentModel = "spring")
public interface BudgetPriorityRestMapper {

    default SubmitBudgetPriorityCommand toCommand(
            BudgetPrioritySection section,
            BudgetPrioritySubmissionRequestDto request
    ) {
        return new SubmitBudgetPriorityCommand(
                section,
                toDemographicsMap(request.demographics()),
                request.priorityAreas()
        );
    }

    default Map<String, Object> toDemographicsMap(BudgetPriorityDemographicsDto demographics) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put(BudgetPriorityDemographics.FULL_NAME, demographics.fullName());
        map.put(BudgetPriorityDemographics.PHONE_NUMBER, demographics.phoneNumber());
        map.put(BudgetPriorityDemographics.AGE_GROUP, demographics.ageGroup());
        map.put(BudgetPriorityDemographics.GENDER, demographics.gender());
        map.put(BudgetPriorityDemographics.DISTRICT_ID, demographics.districtId());
        return map;
    }

    @Mapping(target = "status", constant = "SUBMITTED")
    @Mapping(target = "section", expression = "java(submission.getSection().toApiSegment())")
    @Mapping(target = "financialYearPeriod", expression = "java(submission.getFinancialYearPeriod().toString())")
    @Mapping(target = "bpId", source = "bpId")
    BudgetPrioritySubmissionResponseDto toResponse(BudgetPrioritySubmission submission);
}
