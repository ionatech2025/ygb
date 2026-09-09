package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.CollectorLeaderboardPage;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.LeaderboardSort;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;

public interface GetCollectorLeaderboardQuery {
    CollectorLeaderboardPage getLeaderboard(
            DashboardFilter filter,
            PageRequest pageRequest,
            LeaderboardSort sort
    );
}
