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

    @Bean
    public DashboardFilterHierarchyValidator dashboardFilterHierarchyValidator(
            LocationHierarchyPort locationHierarchyPort
    ) {
        return new DashboardFilterHierarchyValidator(locationHierarchyPort);
    }

    @Bean
    public GetDashboardAggregatesQuery getDashboardAggregatesQuery(
            DashboardAggregationRepositoryPort dashboardAggregationRepositoryPort,
            DashboardFilterHierarchyValidator dashboardFilterHierarchyValidator
    ) {
        return new GetDashboardAggregatesService(
                dashboardAggregationRepositoryPort,
                dashboardFilterHierarchyValidator
        );
    }

    @Bean
    public GetDashboardFilterOptionsQuery getDashboardFilterOptionsQuery(
            DashboardFilterOptionsRepositoryPort dashboardFilterOptionsRepositoryPort,
            UserRepositoryPort userRepositoryPort
    ) {
        return new GetDashboardFilterOptionsService(dashboardFilterOptionsRepositoryPort, userRepositoryPort);
    }

    @Bean
    public ListSubmissionsQuery listSubmissionsQuery(
            SubmissionRepositoryPort submissionRepositoryPort,
            DashboardFilterHierarchyValidator dashboardFilterHierarchyValidator
    ) {
        return new ListSubmissionsService(submissionRepositoryPort, dashboardFilterHierarchyValidator);
    }

    @Bean
    public GetSubmissionDetailQuery getSubmissionDetailQuery(
            SubmissionRepositoryPort submissionRepositoryPort
    ) {
        return new GetSubmissionDetailService(submissionRepositoryPort);
    }

    @Bean
    public ExportSubmissionsQuery exportSubmissionsQuery(
            SubmissionRepositoryPort submissionRepositoryPort,
            DashboardAggregationRepositoryPort dashboardAggregationRepositoryPort,
            DashboardFilterHierarchyValidator dashboardFilterHierarchyValidator,
            ExportGeneratorPort exportGeneratorPort
    ) {
        return new ExportSubmissionsService(
                submissionRepositoryPort,
                dashboardAggregationRepositoryPort,
                dashboardFilterHierarchyValidator,
                exportGeneratorPort
        );
    }
}
