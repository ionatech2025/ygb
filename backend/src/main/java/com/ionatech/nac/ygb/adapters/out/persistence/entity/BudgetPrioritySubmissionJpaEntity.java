package com.ionatech.nac.ygb.adapters.out.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "budget_priority_submissions")
@Getter
@Setter
@NoArgsConstructor
public class BudgetPrioritySubmissionJpaEntity {

    @Id
    @Column(name = "bp_id", nullable = false)
    private UUID bpId;

    @Column(name = "phone_number", nullable = false, length = 15)
    private String phoneNumber;

    @Column(name = "section", nullable = false, length = 20)
    private String section;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "priority_areas")
    private Map<String, Object> priorityAreas;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "demographic_data")
    private Map<String, Object> demographicData;

    @Column(name = "financial_year_period", nullable = false, length = 50)
    private String financialYearPeriod;

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;
}
