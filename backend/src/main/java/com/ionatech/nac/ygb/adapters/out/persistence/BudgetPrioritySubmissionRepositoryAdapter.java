package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.persistence.mapper.BudgetPrioritySubmissionMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.BudgetPrioritySubmissionJpaRepository;
import com.ionatech.nac.ygb.application.ports.spi.BudgetPrioritySubmissionRepositoryPort;
import com.ionatech.nac.ygb.domain.exceptions.DuplicateBudgetPrioritySubmissionException;
import com.ionatech.nac.ygb.domain.model.BudgetPrioritySection;
import com.ionatech.nac.ygb.domain.model.BudgetPrioritySubmission;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;

@Component
public class BudgetPrioritySubmissionRepositoryAdapter implements BudgetPrioritySubmissionRepositoryPort {

    private final BudgetPrioritySubmissionJpaRepository jpaRepository;
    private final BudgetPrioritySubmissionMapper mapper;

    public BudgetPrioritySubmissionRepositoryAdapter(
            BudgetPrioritySubmissionJpaRepository jpaRepository,
            BudgetPrioritySubmissionMapper mapper
    ) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public BudgetPrioritySubmission save(BudgetPrioritySubmission submission) {
        try {
            return mapper.toDomain(jpaRepository.saveAndFlush(mapper.toEntity(submission)));
        } catch (DataIntegrityViolationException ex) {
            if (isDuplicatePhoneSectionPeriodViolation(ex)) {
                throw new DuplicateBudgetPrioritySubmissionException(
                        "A %s Budget Priorities submission for phone %s already exists in %s."
                                .formatted(
                                        submission.getSection().name().toLowerCase(),
                                        submission.getPhoneNumber().getValue(),
                                        submission.getFinancialYearPeriod()
                                ),
                        ex
                );
            }
            throw ex;
        }
    }

    @Override
    public boolean existsByPhoneSectionAndPeriod(
            String phoneNumber,
            BudgetPrioritySection section,
            String financialYearPeriod
    ) {
        return jpaRepository.existsByPhoneNumberAndSectionAndFinancialYearPeriod(
                phoneNumber,
                section.name(),
                financialYearPeriod
        );
    }

    private static boolean isDuplicatePhoneSectionPeriodViolation(DataIntegrityViolationException ex) {
        String message = ex.getMessage();
        return message != null && message.contains("uniq_bp_phone_section_period");
    }
}
