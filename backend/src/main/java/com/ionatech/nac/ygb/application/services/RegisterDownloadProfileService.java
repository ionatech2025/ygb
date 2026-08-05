package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.RegisterDownloadProfileCommand;
import com.ionatech.nac.ygb.application.ports.api.RegisterDownloadProfileUseCase;
import com.ionatech.nac.ygb.application.ports.api.RegisteredDownloadSessionView;
import com.ionatech.nac.ygb.application.ports.spi.DownloadProfileRepositoryPort;
import com.ionatech.nac.ygb.application.ports.spi.DownloadSessionRepositoryPort;
import com.ionatech.nac.ygb.domain.model.DownloadProfile;
import com.ionatech.nac.ygb.domain.model.DownloadSession;
import com.ionatech.nac.ygb.domain.valueobjects.AgeGroup;
import com.ionatech.nac.ygb.domain.valueobjects.EmailAddress;
import com.ionatech.nac.ygb.domain.valueobjects.FieldOfOperation;
import com.ionatech.nac.ygb.domain.valueobjects.Gender;
import com.ionatech.nac.ygb.domain.valueobjects.IsoCountryCode;

import java.security.SecureRandom;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.Base64;

public class RegisterDownloadProfileService implements RegisterDownloadProfileUseCase {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final int TOKEN_BYTES = 32;

    private final DownloadProfileRepositoryPort profileRepository;
    private final DownloadSessionRepositoryPort sessionRepository;
    private final Clock clock;

    public RegisterDownloadProfileService(
            DownloadProfileRepositoryPort profileRepository,
            DownloadSessionRepositoryPort sessionRepository,
            Clock clock
    ) {
        this.profileRepository = profileRepository;
        this.sessionRepository = sessionRepository;
        this.clock = clock;
    }

    @Override
    public RegisteredDownloadSessionView register(RegisterDownloadProfileCommand command) {
        LocalDateTime now = LocalDateTime.ofInstant(clock.instant(), clock.getZone());

        DownloadProfile profile = profileRepository.save(DownloadProfile.recordNew(
                EmailAddress.of(command.email()),
                command.optionalName(),
                IsoCountryCode.of(command.countryCode()),
                Gender.valueOf(command.gender().trim().toUpperCase()),
                AgeGroup.valueOf(command.ageGroup().trim().toUpperCase()),
                FieldOfOperation.valueOf(command.fieldOfOperation().trim().toUpperCase()),
                command.fieldOfOperationSpecify(),
                command.consentGiven(),
                now
        ));

        DownloadSession session = sessionRepository.save(
                DownloadSession.issue(profile.getId(), generateOpaqueToken(), now)
        );

        return new RegisteredDownloadSessionView(
                profile.getId(),
                session.getToken(),
                session.getExpiresAt()
        );
    }

    private static String generateOpaqueToken() {
        byte[] bytes = new byte[TOKEN_BYTES];
        SECURE_RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
