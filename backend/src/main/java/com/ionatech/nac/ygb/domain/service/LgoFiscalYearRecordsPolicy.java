package com.ionatech.nac.ygb.domain.service;

import com.ionatech.nac.ygb.domain.valueobjects.FiscalYearRecord;
import com.ionatech.nac.ygb.domain.valueobjects.LgoFiscalYearCatalog;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public final class LgoFiscalYearRecordsPolicy {

    public void validate(List<FiscalYearRecord> records, String currentLabel, String priorLabel) {
        if (currentLabel == null || currentLabel.isBlank()) {
            throw new IllegalArgumentException("Active fiscal year is not configured.");
        }

        if (priorLabel == null || priorLabel.isBlank()) {
            requireSingleCurrentRecord(records, currentLabel);
        } else {
            requireCurrentAndPriorRecords(records, currentLabel, priorLabel);
        }

        for (FiscalYearRecord record : records) {
            validateRecord(record);
        }
    }

    private void requireSingleCurrentRecord(List<FiscalYearRecord> records, String currentLabel) {
        if (records == null || records.size() != 1) {
            throw new IllegalArgumentException(
                    "Exactly one fiscal year record is required when no prior fiscal year exists."
            );
        }
        if (!currentLabel.equals(records.getFirst().fiscalYearLabel())) {
            throw new IllegalArgumentException(
                    "Fiscal year record must match the active fiscal year: " + currentLabel
            );
        }
    }

    private void requireCurrentAndPriorRecords(
            List<FiscalYearRecord> records,
            String currentLabel,
            String priorLabel
    ) {
        if (records == null || records.size() != 2) {
            throw new IllegalArgumentException(
                    "Exactly two fiscal year records are required: " + currentLabel + " and " + priorLabel
            );
        }

        Set<String> labels = records.stream()
                .map(FiscalYearRecord::fiscalYearLabel)
                .collect(Collectors.toSet());

        if (!labels.equals(Set.of(currentLabel, priorLabel))) {
            throw new IllegalArgumentException(
                    "Fiscal year records must include " + currentLabel + " and " + priorLabel
            );
        }
    }

    private void validateRecord(FiscalYearRecord record) {
        if (!LgoFiscalYearCatalog.isSupported(record.fiscalYearLabel())) {
            throw new IllegalArgumentException("Unsupported fiscal year label: " + record.fiscalYearLabel());
        }
        if (record.fundedParishesCount() > record.totalParishesCount()) {
            throw new IllegalArgumentException(
                    "Parishes that received PDM funds cannot exceed total parishes in the district for "
                            + record.fiscalYearLabel()
            );
        }
        if (record.beneficiaryYoungWomenCount() + record.beneficiaryYoungMenCount()
                > record.beneficiariesUnder30Count()) {
            throw new IllegalArgumentException(
                    "Beneficiary young women and young men counts cannot exceed beneficiaries under 30 for "
                            + record.fiscalYearLabel()
            );
        }
    }
}
