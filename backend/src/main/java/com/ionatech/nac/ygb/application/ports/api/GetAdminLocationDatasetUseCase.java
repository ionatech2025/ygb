package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.AdminLocation;

import java.util.List;

/**
 * Input port: returns the complete Uganda administrative location dataset
 * (all districts, sub-counties, parishes, and villages).
 */
public interface GetAdminLocationDatasetUseCase {
    List<AdminLocation> getDataset();
}
