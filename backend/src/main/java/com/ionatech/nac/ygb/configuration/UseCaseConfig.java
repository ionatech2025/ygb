package com.ionatech.nac.ygb.configuration;

import com.ionatech.nac.ygb.application.ports.api.*;
import com.ionatech.nac.ygb.application.ports.spi.*;
import com.ionatech.nac.ygb.application.services.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

@Configuration
public class UseCaseConfig {

    @Bean
    public AuthenticateUserUseCase authenticateUserUseCase(
            UserRepositoryPort userRepositoryPort,
            PasswordEncoderPort passwordEncoderPort,
            TokenProviderPort tokenProviderPort
    ) {
        return new AuthenticateUserService(userRepositoryPort, passwordEncoderPort, tokenProviderPort);
    }

    @Bean
    @Transactional
    public CreateDataCollectorUseCase createDataCollectorUseCase(
            UserRepositoryPort userRepositoryPort,
            PasswordEncoderPort passwordEncoderPort
    ) {
        return new CreateDataCollectorService(userRepositoryPort, passwordEncoderPort);
    }

    @Bean
    public ListActiveDataCollectorsUseCase listActiveDataCollectorsUseCase(
            UserRepositoryPort userRepositoryPort
    ) {
        return new ListActiveDataCollectorsService(userRepositoryPort);
    }

    @Bean
    public GetCollectorSubmissionCountQuery getCollectorSubmissionCountQuery(
            SubmissionRepositoryPort submissionRepositoryPort
    ) {
        return new GetCollectorSubmissionCountService(submissionRepositoryPort);
    }

    @Bean
    @Transactional
    public SubmitSubmissionUseCase submitSubmissionUseCase(
            SubmissionRepositoryPort submissionRepositoryPort
    ) {
        return new SubmitSubmissionService(submissionRepositoryPort);
    }

    @Bean
    public GetAdminLocationDatasetUseCase getAdminLocationDatasetUseCase(
            AdminLocationRepositoryPort adminLocationRepositoryPort
    ) {
        return new GetAdminLocationDatasetService(adminLocationRepositoryPort);
    }

    @Bean
    public GetCollectorSyncStatusQuery getCollectorSyncStatusQuery(
            SubmissionRepositoryPort submissionRepositoryPort
    ) {
        return new GetCollectorSyncStatusService(submissionRepositoryPort);
    }
}
