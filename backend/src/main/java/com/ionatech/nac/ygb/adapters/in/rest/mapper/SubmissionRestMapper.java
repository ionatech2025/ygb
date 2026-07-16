package com.ionatech.nac.ygb.adapters.in.rest.mapper;

import com.ionatech.nac.ygb.adapters.in.rest.dto.*;
import com.ionatech.nac.ygb.application.ports.api.*;
import com.ionatech.nac.ygb.domain.model.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.UUID;

@Mapper(componentModel = "spring")
public abstract class SubmissionRestMapper {

    public SubmitSubmissionCommand toCommand(SubmissionRequestDto dto, UUID collectorId) {
        if (dto == null) {
            return null;
        }
        return switch (dto) {
            case BypSubmissionRequestDto byp -> toBypCommand(byp, collectorId);
            case IypSubmissionRequestDto iyp -> toIypCommand(iyp, collectorId);
            case LgoSubmissionRequestDto lgo -> toLgoCommand(lgo, collectorId);
            case PcSubmissionRequestDto pc -> toPcCommand(pc, collectorId);
            default -> throw new IllegalArgumentException("Unknown DTO type: " + dto.getClass());
        };
    }

    public abstract BypSubmitCommand toBypCommand(BypSubmissionRequestDto dto, UUID collectorId);
    public abstract IypSubmitCommand toIypCommand(IypSubmissionRequestDto dto, UUID collectorId);
    public abstract LgoSubmitCommand toLgoCommand(LgoSubmissionRequestDto dto, UUID collectorId);
    public abstract PcSubmitCommand toPcCommand(PcSubmissionRequestDto dto, UUID collectorId);

    @Mapping(target = "status", expression = "java(domain.getStatus().name())")
    @Mapping(target = "formCompletedAt", source = "metadata.formCompletedAt")
    @Mapping(target = "formType", expression = "java(mapFormType(domain))")
    public abstract SubmissionResponseDto toResponse(Submission domain);

    protected String mapFormType(Submission domain) {
        return switch (domain) {
            case BypSubmission b -> "BYP";
            case IypSubmission i -> "IYP";
            case LgoSubmission l -> "LGO";
            case PcSubmission p -> "PC";
            default -> "UNKNOWN";
        };
    }
}
