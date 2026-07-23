package com.ionatech.nac.ygb.adapters.in.rest.mapper;

import com.ionatech.nac.ygb.adapters.in.rest.dto.LgoBudgetAllocationRequestDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.LgoBudgetAllocationResponseDto;
import com.ionatech.nac.ygb.application.ports.api.RecordLgoBudgetAllocationCommand;
import com.ionatech.nac.ygb.application.ports.api.RecordLgoBudgetAllocationResult;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.UUID;

@Mapper(componentModel = "spring")
public interface LgoBudgetAllocationRestMapper {

    @Mapping(target = "collectorUserId", source = "collectorUserId")
    @Mapping(target = "deviceSubmissionId", source = "request.deviceSubmissionId")
    @Mapping(target = "formCompletedAt", source = "request.formCompletedAt")
    @Mapping(target = "respondentName", source = "request.respondent.name")
    @Mapping(target = "respondentPhone", source = "request.respondent.phone")
    @Mapping(target = "respondentGender", source = "request.respondent.gender")
    @Mapping(target = "respondentAgeGroup", source = "request.respondent.ageGroup")
    @Mapping(target = "districtId", source = "request.respondent.districtId")
    @Mapping(target = "subcountyId", source = "request.respondent.subcountyId")
    @Mapping(target = "parishId", source = "request.respondent.parishId")
    @Mapping(target = "villageId", source = "request.respondent.villageId")
    @Mapping(target = "priorYearAllocations", source = "request.priorYearAllocations")
    @Mapping(target = "rationale", source = "request.rationale")
    @Mapping(target = "recommendations", source = "request.recommendations")
    RecordLgoBudgetAllocationCommand toCommand(LgoBudgetAllocationRequestDto request, UUID collectorUserId);

    LgoBudgetAllocationResponseDto toResponse(RecordLgoBudgetAllocationResult result);
}
