package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.AgeGroup;
import com.ionatech.nac.ygb.domain.valueobjects.FiscalYearRecord;
import com.ionatech.nac.ygb.domain.valueobjects.Rating;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public sealed interface SubmitSubmissionCommand 
        permits BypSubmitCommand, IypSubmitCommand, LgoSubmitCommand, PcSubmitCommand {
    UUID collectorId();
    UUID deviceSubmissionId();
    LocalDateTime formCompletedAt();
    UUID districtId();
    UUID subcountyId();
    UUID parishId();
    UUID villageId();
    String respondentName();
    String respondentPhone();
    String respondentGender();
    AgeGroup respondentAgeGroup();
}
