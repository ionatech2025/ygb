package com.ionatech.nac.ygb.adapters.in.rest.mapper;

import com.ionatech.nac.ygb.adapters.in.rest.dto.CollectorBreakdownResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.CollectorLeaderboardEntryDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.CollectorLeaderboardPageResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.DistrictCountDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.FormTypeCountDto;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorBreakdown;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorLeaderboardEntry;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorLeaderboardPage;
import org.springframework.stereotype.Component;

@Component
public class CollectorTrackerRestMapper {

    public CollectorLeaderboardPageResponseDto toLeaderboardResponse(CollectorLeaderboardPage page) {
        return new CollectorLeaderboardPageResponseDto(
                page.items().stream().map(this::toEntryDto).toList(),
                page.totalElements(),
                page.page(),
                page.size(),
                page.totalPages()
        );
    }

    private CollectorLeaderboardEntryDto toEntryDto(CollectorLeaderboardEntry entry) {
        return new CollectorLeaderboardEntryDto(
                entry.collectorId(),
                entry.fullName(),
                entry.totalCount()
        );
    }

    public CollectorBreakdownResponseDto toBreakdownResponse(CollectorBreakdown breakdown) {
        return new CollectorBreakdownResponseDto(
                breakdown.byFormType().stream()
                        .map(row -> new FormTypeCountDto(row.formType().name(), row.count()))
                        .toList(),
                breakdown.byDistrict().stream()
                        .map(row -> new DistrictCountDto(row.districtName(), row.districtId(), row.count()))
                        .toList()
        );
    }
}
