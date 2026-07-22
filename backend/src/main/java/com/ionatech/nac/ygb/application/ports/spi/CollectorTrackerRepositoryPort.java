package com.ionatech.nac.ygb.application.ports.spi;

import com.ionatech.nac.ygb.domain.valueobjects.CollectorLeaderboardEntry;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;

import java.util.List;

public interface CollectorTrackerRepositoryPort {
    List<CollectorLeaderboardEntry> findLeaderboard(DashboardFilter filter);
}
