package com.ionatech.nac.ygb.domain.service;

import com.ionatech.nac.ygb.domain.exceptions.PublicPiiExposureException;
import com.ionatech.nac.ygb.domain.model.BypSubmission;
import com.ionatech.nac.ygb.domain.valueobjects.AgeGroup;
import com.ionatech.nac.ygb.domain.valueobjects.Location;
import com.ionatech.nac.ygb.domain.valueobjects.NarrativeText;
import com.ionatech.nac.ygb.domain.valueobjects.Rating;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionMetadata;
import com.ionatech.nac.ygb.domain.valueobjects.ToolDownloadDataset;
import com.ionatech.nac.ygb.domain.valueobjects.ToolFieldExportInput;
import com.ionatech.nac.ygb.domain.valueobjects.ToolFieldExportRow;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ToolFieldDataProjectorTest {

    private ToolFieldDataProjector projector;
    private ToolDownloadCatalogue catalogue;

    @BeforeEach
    void setUp() {
        catalogue = new ToolDownloadCatalogue();
        projector = new ToolFieldDataProjector(catalogue);
    }

    @Test
    void shouldEmitCommonHeaderThenAnswersInOrder() {
        LinkedHashMap<String, String> answers = new LinkedHashMap<>();
        answers.put("Fund Receipt Duration", "ONE_WEEK");
        answers.put("Money Used For", "I used the money to buy farming inputs.");

        ToolFieldExportRow row = projector.project(ToolFieldExportInput.of(
                ToolDownloadDataset.BYP,
                "Kampala",
                "Central",
                "Nakasero",
                "FEMALE",
                "AGE_18_24",
                "JAN_JUN_2026",
                LocalDateTime.of(2026, 3, 15, 10, 0),
                answers
        ));

        assertThat(row.headers()).startsWith(
                "Dataset",
                "District",
                "Sub-county",
                "Parish",
                "Gender",
                "Age Group",
                "Financial Year Period",
                "Form Completed At"
        );
        assertThat(row.get("Dataset")).isEqualTo("BYP");
        assertThat(row.get("District")).isEqualTo("Kampala");
        assertThat(row.get("Sub-county")).isEqualTo("Central");
        assertThat(row.get("Parish")).isEqualTo("Nakasero");
        assertThat(row.get("Fund Receipt Duration")).isEqualTo("ONE_WEEK");
        assertThat(row.get("Money Used For")).isEqualTo("I used the money to buy farming inputs.");
        assertThat(row.headers()).doesNotContain(
                "ID", "Status", "Collector", "Collector Id", "Respondent Name", "Respondent Phone",
                "Device Submission Id", "District Id"
        );
    }

    @Test
    void shouldBlankMissingCommonHeaderFields() {
        ToolFieldExportRow row = projector.project(ToolFieldExportInput.of(
                ToolDownloadDataset.BUDGET_PRIORITIES,
                "Gulu",
                null,
                null,
                "MALE",
                "AGE_25_30",
                "JUL_DEC_2025",
                LocalDateTime.of(2025, 8, 1, 9, 0),
                new LinkedHashMap<>(Map.of("Section", "health", "Priority Areas", "roads|water"))
        ));

        assertThat(row.get("Dataset")).isEqualTo("Budget Priorities");
        assertThat(row.get("District")).isEqualTo("Gulu");
        assertThat(row.get("Sub-county")).isEmpty();
        assertThat(row.get("Parish")).isEmpty();
    }

    @Test
    void shouldRejectBlockedPiiAnswerHeaders() {
        LinkedHashMap<String, String> answers = new LinkedHashMap<>();
        answers.put("Collector Name", "Alice");

        assertThatThrownBy(() -> projector.project(ToolFieldExportInput.of(
                ToolDownloadDataset.BYP,
                "Kampala",
                "Central",
                "Nakasero",
                "FEMALE",
                "AGE_18_24",
                "JAN_JUN_2026",
                LocalDateTime.of(2026, 3, 15, 10, 0),
                answers
        ))).isInstanceOf(PublicPiiExposureException.class)
                .hasMessageContaining("Collector Name");
    }

    @Test
    void shouldRejectBlockedCommonStyleHeadersInAnswers() {
        LinkedHashMap<String, String> answers = new LinkedHashMap<>();
        answers.put("Respondent Phone", "0772000000");

        assertThatThrownBy(() -> projector.assertHeadersSafe(answers.keySet()))
                .isInstanceOf(PublicPiiExposureException.class);
    }

    @Test
    void shouldProjectBypSubmissionWithoutExposingIdentity() {
        BypSubmission byp = sampleByp();
        ToolFieldExportRow row = projector.projectByp(
                byp,
                "Kampala",
                "Central Division",
                "Nakasero"
        );

        assertThat(row.get("Dataset")).isEqualTo("BYP");
        assertThat(row.get("District")).isEqualTo("Kampala");
        assertThat(row.get("Money Used For")).contains("farming inputs");
        assertThat(row.get("Improvement Suggestion")).contains("technical support");
        assertThat(row.values()).noneMatch(v -> v != null && (v.contains("Jane Doe") || v.contains("0772111222")));
        assertThat(row.headers()).noneMatch(h -> h.toLowerCase().contains("collector")
                || h.toLowerCase().contains("respondent")
                || h.toLowerCase().contains("device"));
        projector.assertHeadersSafe(row.headers());
    }

    @Test
    void commonHeaderKeysMustNeverBeDeniedAsBlocked() {
        projector.assertHeadersSafe(ToolFieldDataProjector.COMMON_HEADERS);
    }

    private static BypSubmission sampleByp() {
        return new BypSubmission(
                UUID.randomUUID(),
                new SubmissionMetadata(UUID.randomUUID(), UUID.randomUUID(), LocalDateTime.of(2026, 3, 15, 10, 0)),
                new Location(UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID()),
                "Jane Doe",
                "0772111222",
                "FEMALE",
                AgeGroup.AGE_18_24,
                "ONE_WEEK",
                null,
                true,
                500000L,
                new NarrativeText("I used the money to buy farming inputs."),
                "MONTHLY",
                null,
                Rating.VERY_GOOD,
                false,
                null,
                Rating.GOOD,
                true,
                true,
                List.of("TRAINING", "MARKET_LINKAGES"),
                new NarrativeText("Provide more technical support and early training.")
        );
    }
}
