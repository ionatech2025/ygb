package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.CollectorLeaderboardEntry;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;

import java.util.List;

public interface GetCollectorLeaderboardQuery {
    List<CollectorLeaderboardEntry> getLeaderboard(DashboardFilter filter);
}
