package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.application.ports.spi.CollectorTrackerRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorLeaderboardEntry;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CollectorTrackerRepositoryAdapter implements CollectorTrackerRepositoryPort {

    private final CollectorTrackerJpaRepository jpaRepository;

    public CollectorTrackerRepositoryAdapter(CollectorTrackerJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public List<CollectorLeaderboardEntry> findLeaderboard(DashboardFilter filter) {
        return jpaRepository.findLeaderboard(filter);
    }
}
