package com.ionatech.nac.ygb.domain.service;

import com.ionatech.nac.ygb.domain.exceptions.PublicPiiExposureException;
import com.ionatech.nac.ygb.domain.model.BudgetPrioritySubmission;
import com.ionatech.nac.ygb.domain.model.BypSubmission;
import com.ionatech.nac.ygb.domain.model.IypSubmission;
import com.ionatech.nac.ygb.domain.model.LgoBudgetAllocation;
import com.ionatech.nac.ygb.domain.model.LgoSubmission;
import com.ionatech.nac.ygb.domain.model.PcSubmission;
import com.ionatech.nac.ygb.domain.model.Submission;
import com.ionatech.nac.ygb.domain.valueobjects.FiscalYearRecord;
import com.ionatech.nac.ygb.domain.valueobjects.NarrativeText;
import com.ionatech.nac.ygb.domain.valueobjects.ToolDownloadDataset;
import com.ionatech.nac.ygb.domain.valueobjects.ToolFieldExportInput;
import com.ionatech.nac.ygb.domain.valueobjects.ToolFieldExportRow;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Builds tool hub tabular rows: common header (names only) + all answer columns including free-text.
 * Hard-blocks identity columns from the export surface.
 */
public final class ToolFieldDataProjector {

    public static final List<String> COMMON_HEADERS = List.of(
            "Dataset",
            "District",
            "Sub-county",
            "Parish",
            "Gender",
            "Age Group",
            "Financial Year Period",
            "Form Completed At"
    );

    private static final Set<String> BLOCKED_HEADER_KEYS = Set.of(
            "id",
            "rowid",
            "status",
            "respondentname",
            "respondentphone",
            "phone",
            "phonenumber",
            "fullname",
            "name",
            "collector",
            "collectorid",
            "collectorname",
            "devicesubmissionid",
            "districtid",
            "subcountyid",
            "parishid",
            "villageid",
            "locationid",
            "submissionid",
            "lbaid",
            "bpid",
            "demographicdata",
            "demographic_data"
    );

    private static final DateTimeFormatter COMPLETED_AT = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    private final ToolDownloadCatalogue catalogue;

    public ToolFieldDataProjector(ToolDownloadCatalogue catalogue) {
        this.catalogue = Objects.requireNonNull(catalogue, "catalogue must not be null");
    }

    public ToolFieldExportRow project(ToolFieldExportInput input) {
        Objects.requireNonNull(input, "input must not be null");
        assertHeadersSafe(input.answers().keySet());
        LinkedHashMap<String, String> columns = new LinkedHashMap<>();
        columns.put("Dataset", catalogue.displayLabel(input.dataset()));
        columns.put("District", blankToEmpty(input.districtName()));
        columns.put("Sub-county", blankToEmpty(input.subcountyName()));
        columns.put("Parish", blankToEmpty(input.parishName()));
        columns.put("Gender", blankToEmpty(input.gender()));
        columns.put("Age Group", blankToEmpty(input.ageGroup()));
        columns.put("Financial Year Period", blankToEmpty(input.financialYearPeriod()));
        columns.put("Form Completed At", formatCompletedAt(input.formCompletedAt()));
        columns.putAll(input.answers());
        assertHeadersSafe(columns.keySet());
        return new ToolFieldExportRow(columns);
    }

    public ToolFieldExportRow projectByp(BypSubmission submission, String districtName, String subcountyName, String parishName) {
        LinkedHashMap<String, String> answers = new LinkedHashMap<>();
        answers.put("Fund Receipt Duration", text(submission.getFundReceiptDuration()));
        answers.put("Fund Receipt Duration Specify", text(submission.getFundReceiptDurationSpecify()));
        answers.put("Received Actual Amount Requested", bool(submission.getReceivedActualAmountRequested()));
        answers.put("Cash Amount Received", number(submission.getCashAmountReceived()));
        answers.put("Money Used For", narrative(submission.getMoneyUsedFor()));
        answers.put("Instalment Period", text(submission.getInstalmentPeriod()));
        answers.put("Instalment Period Specify", text(submission.getInstalmentPeriodSpecify()));
        answers.put("Service Rating", enumName(submission.getServiceRating()));
        answers.put("Loan Repaid", bool(submission.getLoanRepaid()));
        answers.put("Loan Repayment Duration", text(submission.getLoanRepaymentDuration()));
        answers.put("Performance Rating", enumName(submission.getPerformanceRating()));
        answers.put("Group Organized Transparently", bool(submission.getGroupOrganizedTransparently()));
        answers.put("Received BDS", bool(submission.getReceivedBds()));
        answers.put("BDS Services", join(submission.getBdsServices()));
        answers.put("Improvement Suggestion", narrative(submission.getImprovementSuggestion()));
        return project(fromSubmission(ToolDownloadDataset.BYP, submission, districtName, subcountyName, parishName, answers));
    }

    public ToolFieldExportRow projectIyp(IypSubmission submission, String districtName, String subcountyName, String parishName) {
        LinkedHashMap<String, String> answers = new LinkedHashMap<>();
        answers.put("Aware Of PDM", bool(submission.isAwareOfPdm()));
        answers.put("Eligible Criteria Aware", bool(submission.getEligibleCriteriaAware()));
        answers.put("Applied For Fund", bool(submission.getAppliedForFund()));
        answers.put("Accessed Fund", bool(submission.isAccessedFund()));
        answers.put("Rejection Narrative", narrative(submission.getRejectionNarrative()));
        answers.put("Reasons For Not Applying", join(submission.getReasonsForNotApplying()));
        answers.put("Information Channels", join(submission.getInformationChannels()));
        answers.put("Difficulties Faced", join(submission.getDifficultiesFaced()));
        answers.put("Limitation Explanation", narrative(submission.getLimitationExplanation()));
        answers.put("Improvement Suggestion", narrative(submission.getImprovementSuggestion()));
        return project(fromSubmission(ToolDownloadDataset.IYP, submission, districtName, subcountyName, parishName, answers));
    }

    public ToolFieldExportRow projectLgo(LgoSubmission submission, String districtName, String subcountyName, String parishName) {
        LinkedHashMap<String, String> answers = new LinkedHashMap<>();
        answers.put("Fiscal Year Records", formatFiscalYearRecords(submission.getFiscalYearRecords()));
        answers.put("Funds Allocated Equitably", bool(submission.getFundsAllocatedEquitably()));
        answers.put("Allocated Funds Sufficient", bool(submission.getAllocatedFundsSufficient()));
        answers.put("Adequate Utilisation Oversight", bool(submission.getAdequateUtilisationOversight()));
        answers.put("Transparent Beneficiary Selection", bool(submission.getTransparentBeneficiarySelection()));
        answers.put("Funds Spent As Required", bool(submission.getFundsSpentAsRequired()));
        answers.put("Funds Spent Explanation", narrative(submission.getFundsSpentExplanation()));
        answers.put("Economic Transformation", bool(submission.getEconomicTransformation()));
        answers.put("Economic Transformation Explanation", narrative(submission.getEconomicTransformationExplanation()));
        answers.put("Improvement Suggestion", narrative(submission.getImprovementSuggestion()));
        return project(fromSubmission(ToolDownloadDataset.LGO, submission, districtName, subcountyName, parishName, answers));
    }

    public ToolFieldExportRow projectPc(PcSubmission submission, String districtName, String subcountyName, String parishName) {
        LinkedHashMap<String, String> answers = new LinkedHashMap<>();
        answers.put("Amount Expected", number(submission.getAmountExpected()));
        answers.put("Amount Received", number(submission.getAmountReceived()));
        answers.put("Total Beneficiaries", number(submission.getTotalBeneficiaries()));
        answers.put("Youth Beneficiaries", number(submission.getYouthBeneficiaries()));
        answers.put("Young Women Beneficiaries", number(submission.getYoungWomenBeneficiaries()));
        answers.put("Young Men Beneficiaries", number(submission.getYoungMenBeneficiaries()));
        answers.put("Obstacles Description", narrative(submission.getObstaclesDescription()));
        answers.put("Spending Targeted To Most In Need", bool(submission.getSpendingTargetedToMostInNeed()));
        answers.put("PDC Total Members", number(submission.getPdcTotalMembers()));
        answers.put("PDC Youth Members", number(submission.getPdcYouthMembers()));
        answers.put("PDC Women Members", number(submission.getPdcWomenMembers()));
        answers.put("PDC Training Received", bool(submission.getPdcTrainingReceived()));
        answers.put("PDC Training Areas", join(submission.getPdcTrainingAreas()));
        answers.put("PDC Effectiveness Rating", enumName(submission.getPdcEffectivenessRating()));
        answers.put("Programme Monitored", bool(submission.getProgrammeMonitored()));
        answers.put("Monitored By", join(submission.getMonitoredBy()));
        answers.put("Monitored By Others Specify", text(submission.getMonitoredByOthersSpecify()));
        answers.put("Monitoring Method", narrative(submission.getMonitoringMethod()));
        answers.put("Report Shared With Respondent", bool(submission.getReportSharedWithRespondent()));
        answers.put("Improvements Seen", bool(submission.getImprovementsSeen()));
        answers.put("Improvements Seen Explanation", narrative(submission.getImprovementsSeenExplanation()));
        answers.put("Progress Reports Submitted", bool(submission.getProgressReportsSubmitted()));
        answers.put("Progress Reports Submitted Explanation", narrative(submission.getProgressReportsSubmittedExplanation()));
        answers.put("Self Reliance Beneficiaries Count", number(submission.getSelfRelianceBeneficiariesCount()));
        answers.put("Self Reliance Stable Income Count", number(submission.getSelfRelianceStableIncomeCount()));
        answers.put("Self Reliance Trained Count", number(submission.getSelfRelianceTrainedCount()));
        answers.put("Self Reliance Group Projects Count", number(submission.getSelfRelianceGroupProjectsCount()));
        answers.put("Programme Improvement Suggestion", narrative(submission.getProgrammeImprovementSuggestion()));
        return project(fromSubmission(ToolDownloadDataset.PC, submission, districtName, subcountyName, parishName, answers));
    }

    public ToolFieldExportRow projectBudgetPriorities(
            BudgetPrioritySubmission submission,
            String districtName,
            String subcountyName,
            String parishName
    ) {
        Map<String, Object> demographics = submission.getDemographicData();
        LinkedHashMap<String, String> answers = new LinkedHashMap<>();
        answers.put("Section", submission.getSection().toApiSegment());
        answers.put("Priority Areas", formatPriorityAreas(submission.getPriorityAreas()));
        return project(ToolFieldExportInput.of(
                ToolDownloadDataset.BUDGET_PRIORITIES,
                districtName,
                firstNonBlank(subcountyName, stringValue(demographics.get("subcountyName"))),
                firstNonBlank(parishName, stringValue(demographics.get("parishName"))),
                stringValue(demographics.get("gender")),
                stringValue(demographics.get("ageGroup")),
                submission.getFinancialYearPeriod() == null ? null : submission.getFinancialYearPeriod().toString(),
                submission.getSubmittedAt(),
                answers
        ));
    }

    public ToolFieldExportRow projectBudgetAllocations(
            Submission envelope,
            LgoBudgetAllocation allocation,
            String districtName,
            String subcountyName,
            String parishName
    ) {
        LinkedHashMap<String, String> answers = new LinkedHashMap<>();
        answers.put("Previous FY Allocations", String.valueOf(allocation.getPreviousFyAllocations()));
        answers.put("Rationale", text(allocation.getRationale()));
        answers.put("Recommendations", text(allocation.getRecommendations()));
        return project(fromSubmission(
                ToolDownloadDataset.LGO_BUDGET_ALLOCATION,
                envelope,
                districtName,
                subcountyName,
                parishName,
                answers
        ));
    }

    public void assertHeadersSafe(Iterable<String> headers) {
        for (String header : headers) {
            if (header != null && BLOCKED_HEADER_KEYS.contains(normalizeHeader(header))) {
                throw new PublicPiiExposureException("Tool field-data export must not expose PII field: " + header);
            }
        }
    }

    private ToolFieldExportInput fromSubmission(
            ToolDownloadDataset dataset,
            Submission submission,
            String districtName,
            String subcountyName,
            String parishName,
            LinkedHashMap<String, String> answers
    ) {
        return ToolFieldExportInput.of(
                dataset,
                districtName,
                subcountyName,
                parishName,
                submission.getRespondentGender(),
                submission.getRespondentAgeGroup() == null ? null : submission.getRespondentAgeGroup().name(),
                submission.getMetadata().financialYearPeriod().toString(),
                submission.getMetadata().formCompletedAt(),
                answers
        );
    }

    private static String formatFiscalYearRecords(List<FiscalYearRecord> records) {
        if (records == null || records.isEmpty()) {
            return "";
        }
        return records.stream()
                .map(r -> r.fiscalYearLabel()
                        + "|expected=" + r.expectedFunds()
                        + "|actual=" + r.actualFunds()
                        + "|beneficiaries=" + r.totalBeneficiaryCount())
                .collect(Collectors.joining("; "));
    }

    @SuppressWarnings("unchecked")
    private static String formatPriorityAreas(Map<String, Object> priorityAreas) {
        if (priorityAreas == null || priorityAreas.isEmpty()) {
            return "";
        }
        Object ranked = priorityAreas.get("rankedAreas");
        if (ranked instanceof Collection<?> collection) {
            return collection.stream().map(String::valueOf).collect(Collectors.joining("|"));
        }
        return String.valueOf(priorityAreas);
    }

    private static String formatCompletedAt(LocalDateTime value) {
        return value == null ? "" : COMPLETED_AT.format(value);
    }

    private static String blankToEmpty(String value) {
        return value == null ? "" : value;
    }

    private static String text(String value) {
        return value == null ? "" : value;
    }

    private static String narrative(NarrativeText value) {
        return value == null ? "" : value.getValue();
    }

    private static String bool(Boolean value) {
        return value == null ? "" : value.toString();
    }

    private static String number(Number value) {
        return value == null ? "" : value.toString();
    }

    private static String enumName(Enum<?> value) {
        return value == null ? "" : value.name();
    }

    private static String join(List<String> values) {
        if (values == null || values.isEmpty()) {
            return "";
        }
        return String.join("|", values);
    }

    private static String stringValue(Object value) {
        return value == null ? null : String.valueOf(value);
    }

    private static String firstNonBlank(String primary, String fallback) {
        if (primary != null && !primary.isBlank()) {
            return primary;
        }
        return fallback;
    }

    private static String normalizeHeader(String header) {
        return header.replace(" ", "").replace("_", "").replace("-", "").toLowerCase(Locale.ROOT);
    }
}
