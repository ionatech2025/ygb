package com.ionatech.nac.ygb.domain.valueobjects;

import java.util.List;

public record CollectorBreakdown(List<FormTypeCount> byFormType, List<DistrictCount> byDistrict) {
    public CollectorBreakdown {
        if (byFormType == null) {
            throw new IllegalArgumentException("CollectorBreakdown byFormType must not be null.");
        }
        if (byDistrict == null) {
            throw new IllegalArgumentException("CollectorBreakdown byDistrict must not be null.");
        }
    }
}
