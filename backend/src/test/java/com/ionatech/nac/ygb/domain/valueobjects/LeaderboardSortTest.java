package com.ionatech.nac.ygb.domain.valueobjects;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class LeaderboardSortTest {

    @Test
    void shouldDefaultToTotalCountDescending() {
        assertThat(LeaderboardSort.defaultSort())
                .isEqualTo(new LeaderboardSort(LeaderboardSort.Key.TOTAL_COUNT, LeaderboardSort.Direction.DESC));
    }

    @Test
    void shouldParseCamelCaseKeysAndDirections() {
        assertThat(LeaderboardSort.of("fullName", "asc"))
                .isEqualTo(new LeaderboardSort(LeaderboardSort.Key.FULL_NAME, LeaderboardSort.Direction.ASC));
        assertThat(LeaderboardSort.of("totalCount", "desc"))
                .isEqualTo(new LeaderboardSort(LeaderboardSort.Key.TOTAL_COUNT, LeaderboardSort.Direction.DESC));
    }

    @Test
    void shouldDefaultDirectionByKeyWhenBlank() {
        assertThat(LeaderboardSort.of("fullName", null).direction()).isEqualTo(LeaderboardSort.Direction.ASC);
        assertThat(LeaderboardSort.of(null, null).direction()).isEqualTo(LeaderboardSort.Direction.DESC);
    }

    @Test
    void shouldRejectUnknownSortKey() {
        assertThatThrownBy(() -> LeaderboardSort.of("unknown", "asc"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Unsupported leaderboard sort key");
    }
}
