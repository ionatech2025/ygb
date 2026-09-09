package com.ionatech.nac.ygb.adapters.in.rest.mapper;

import com.ionatech.nac.ygb.domain.valueobjects.ToolFieldDataFilter;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class ToolFieldDataFilterRequestMapper {

    public ToolFieldDataFilter toFilter(
            UUID districtId,
            UUID subcountyId,
            UUID parishId,
            String gender,
            String ageGroup,
            String financialYearPeriod
    ) {
        return new ToolFieldDataFilter(
                districtId,
                subcountyId,
                parishId,
                blankToNull(gender),
                blankToNull(ageGroup),
                blankToNull(financialYearPeriod)
        );
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
