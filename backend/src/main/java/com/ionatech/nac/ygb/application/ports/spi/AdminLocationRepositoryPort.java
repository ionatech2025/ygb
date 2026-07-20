package com.ionatech.nac.ygb.application.ports.spi;

import com.ionatech.nac.ygb.domain.valueobjects.AdminLocation;

import java.util.List;

/**
 * Output port: contract for retrieving all administrative location entries
 * from whatever infrastructure store backs the dataset.
 */
public interface AdminLocationRepositoryPort {
    List<AdminLocation> findAll();
}
