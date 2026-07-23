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
@Table(name = "lgo_budget_allocations")
@Getter
@Setter
@NoArgsConstructor
public class LgoBudgetAllocationJpaEntity {

    @Id
    @Column(name = "lba_id", nullable = false)
    private UUID lbaId;

    @Column(name = "submission_id", nullable = false)
    private UUID submissionId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "previous_fy_allocations")
    private Map<String, Object> previousFyAllocations;

    @Column(name = "rationale", nullable = false, columnDefinition = "TEXT")
    private String rationale;

    @Column(name = "recommendations", nullable = false, columnDefinition = "TEXT")
    private String recommendations;

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;
}
