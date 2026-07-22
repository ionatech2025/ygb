package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.PublicDashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.PublicHeatmap;

public interface GetPublicDashboardHeatmapQuery {
    PublicHeatmap getHeatmap(PublicDashboardFilter filter);
}
