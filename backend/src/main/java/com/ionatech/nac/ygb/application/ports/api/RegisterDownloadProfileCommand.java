package com.ionatech.nac.ygb.application.ports.api;

public record RegisterDownloadProfileCommand(
        String email,
        String optionalName,
        String countryCode,
        String gender,
        String ageGroup,
        String fieldOfOperation,
        String fieldOfOperationSpecify,
        boolean consentGiven
) {
}
