package com.ionatech.nac.ygb.adapters.out.persistence.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "lgo_budget_allocation_submissions")
@DiscriminatorValue("LGO_BUDGET_ALLOCATION")
@Getter
@Setter
@NoArgsConstructor
public class LgoBudgetAllocationSubmissionJpaEntity extends SubmissionJpaEntity {
}
