package com.ionatech.nac.ygb.adapters.out.persistence.repository;

import com.ionatech.nac.ygb.adapters.out.persistence.entity.BudgetPrioritySubmissionJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BudgetPrioritySubmissionJpaRepository extends JpaRepository<BudgetPrioritySubmissionJpaEntity, UUID> {

    boolean existsByPhoneNumberAndSectionAndFinancialYearPeriod(
            String phoneNumber,
            String section,
            String financialYearPeriod
    );
}
