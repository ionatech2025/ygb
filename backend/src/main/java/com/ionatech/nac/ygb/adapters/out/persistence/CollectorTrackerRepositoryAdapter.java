package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.application.ports.spi.CollectorTrackerRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorLeaderboardPage;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.LeaderboardSort;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
import org.springframework.stereotype.Component;

@Component
public class CollectorTrackerRepositoryAdapter implements CollectorTrackerRepositoryPort {

    private final CollectorTrackerJpaRepository jpaRepository;

    public CollectorTrackerRepositoryAdapter(CollectorTrackerJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public CollectorLeaderboardPage findLeaderboard(
            DashboardFilter filter,
            PageRequest pageRequest,
            LeaderboardSort sort
    ) {
        return jpaRepository.findLeaderboard(filter, pageRequest, sort);
    }
}
