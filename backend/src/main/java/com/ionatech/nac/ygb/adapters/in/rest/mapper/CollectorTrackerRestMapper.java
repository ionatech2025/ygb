package com.ionatech.nac.ygb.adapters.in.rest.mapper;

import com.ionatech.nac.ygb.adapters.in.rest.dto.CollectorBreakdownResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.CollectorLeaderboardEntryDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.DistrictCountDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.FormTypeCountDto;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorBreakdown;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorLeaderboardEntry;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CollectorTrackerRestMapper {

    public List<CollectorLeaderboardEntryDto> toLeaderboardResponse(List<CollectorLeaderboardEntry> entries) {
        return entries.stream()
                .map(entry -> new CollectorLeaderboardEntryDto(
                        entry.collectorId(),
                        entry.fullName(),
                        entry.totalCount()
                ))
                .toList();
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
