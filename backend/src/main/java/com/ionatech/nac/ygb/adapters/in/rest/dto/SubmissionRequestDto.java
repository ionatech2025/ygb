package com.ionatech.nac.ygb.adapters.in.rest.dto;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.ionatech.nac.ygb.domain.valueobjects.AgeGroup;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.UUID;

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.EXISTING_PROPERTY,
    property = "formType",
    visible = true
)
@JsonSubTypes({
    @JsonSubTypes.Type(value = BypSubmissionRequestDto.class, name = "BYP"),
    @JsonSubTypes.Type(value = IypSubmissionRequestDto.class, name = "IYP"),
    @JsonSubTypes.Type(value = LgoSubmissionRequestDto.class, name = "LGO"),
    @JsonSubTypes.Type(value = PcSubmissionRequestDto.class, name = "PC")
})
public abstract class SubmissionRequestDto {
    @NotBlank
    private String formType;

    @NotNull
    private UUID deviceSubmissionId;

    @NotNull
    private LocalDateTime formCompletedAt;

    @NotNull
    private UUID districtId;

    @NotNull
    private UUID subcountyId;

    @NotNull
    private UUID parishId;

    @NotNull
    private UUID villageId;

    @NotBlank
    private String respondentName;

    @NotBlank
    private String respondentPhone;

    @NotBlank
    private String respondentGender;

    @NotNull
    private AgeGroup respondentAgeGroup;

    protected SubmissionRequestDto() {}

    protected SubmissionRequestDto(
            String formType,
            UUID deviceSubmissionId,
            LocalDateTime formCompletedAt,
            UUID districtId,
            UUID subcountyId,
            UUID parishId,
            UUID villageId,
            String respondentName,
            String respondentPhone,
            String respondentGender,
            AgeGroup respondentAgeGroup
    ) {
        this.formType = formType;
        this.deviceSubmissionId = deviceSubmissionId;
        this.formCompletedAt = formCompletedAt;
        this.districtId = districtId;
        this.subcountyId = subcountyId;
        this.parishId = parishId;
        this.villageId = villageId;
        this.respondentName = respondentName;
        this.respondentPhone = respondentPhone;
        this.respondentGender = respondentGender;
        this.respondentAgeGroup = respondentAgeGroup;
    }

    public String getFormType() { return formType; }
    public UUID getDeviceSubmissionId() { return deviceSubmissionId; }
    public LocalDateTime getFormCompletedAt() { return formCompletedAt; }
    public UUID getDistrictId() { return districtId; }
    public UUID getSubcountyId() { return subcountyId; }
    public UUID getParishId() { return parishId; }
    public UUID getVillageId() { return villageId; }
    public String getRespondentName() { return respondentName; }
    public String getRespondentPhone() { return respondentPhone; }
    public String getRespondentGender() { return respondentGender; }
    public AgeGroup getRespondentAgeGroup() { return respondentAgeGroup; }
}
