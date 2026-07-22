package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.domain.valueobjects.AdminLocation;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Comparator;
import java.util.HexFormat;
import java.util.List;
import java.util.stream.Collectors;

public final class AdminLocationDatasetEtag {

    private AdminLocationDatasetEtag() {
    }

    public static String compute(List<AdminLocation> dataset) {
        String payload = dataset.stream()
                .sorted(Comparator.comparing(AdminLocation::id))
                .map(loc -> loc.id() + "|" + loc.name() + "|" + loc.level())
                .collect(Collectors.joining("\n"));

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(payload.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("SHA-256 not available", ex);
        }
    }

    public static String normalize(String ifNoneMatch) {
        if (ifNoneMatch == null || ifNoneMatch.isBlank()) {
            return null;
        }
        return ifNoneMatch.replace("\"", "").replace("W/", "").trim();
    }
}
