package com.ionatech.nac.ygb.application.ports.spi;

import com.ionatech.nac.ygb.domain.valueobjects.CollectorLeaderboardPage;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.LeaderboardSort;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;

public interface CollectorTrackerRepositoryPort {
    CollectorLeaderboardPage findLeaderboard(
            DashboardFilter filter,
            PageRequest pageRequest,
            LeaderboardSort sort
    );
}
