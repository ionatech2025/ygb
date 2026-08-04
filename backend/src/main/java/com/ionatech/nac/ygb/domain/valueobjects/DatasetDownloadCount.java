package com.ionatech.nac.ygb.domain.valueobjects;

public record DatasetDownloadCount(String dataset, long count) {
    public DatasetDownloadCount {
        if (dataset == null) {
            throw new IllegalArgumentException("DatasetDownloadCount dataset must not be null.");
        }
        if (count < 0) {
            throw new IllegalArgumentException("DatasetDownloadCount count must not be negative.");
        }
    }
}
