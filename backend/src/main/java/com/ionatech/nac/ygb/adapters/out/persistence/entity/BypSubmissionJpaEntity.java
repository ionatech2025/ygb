package com.ionatech.nac.ygb.adapters.out.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.List;

@Entity
@Table(name = "byp_submissions")
@DiscriminatorValue("BYP")
@Getter
@Setter
@NoArgsConstructor
public class BypSubmissionJpaEntity extends SubmissionJpaEntity {
    @Column(name = "exact_age", nullable = false)
    private int exactAge;

    @Column(name = "fund_receipt_duration", nullable = false)
    private String fundReceiptDuration;

    @Column(name = "fund_receipt_duration_specify")
    private String fundReceiptDurationSpecify;

    @Column(name = "received_actual_amount_requested", nullable = false)
    private Boolean receivedActualAmountRequested;

    @Column(name = "cash_amount_received", nullable = false)
    private Long cashAmountReceived;

    @Column(name = "instalment_period", nullable = false)
    private String instalmentPeriod;

    @Column(name = "instalment_period_specify")
    private String instalmentPeriodSpecify;

    @Column(name = "service_rating", nullable = false)
    private String serviceRating;

    @Column(name = "performance_rating", nullable = false)
    private String performanceRating;

    @Column(name = "group_organized_transparently", nullable = false)
    private Boolean groupOrganizedTransparently;

    @Column(name = "received_bds", nullable = false)
    private Boolean receivedBds;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "bds_services")
    private List<String> bdsServices;

    @Column(name = "improvement_suggestion", nullable = false)
    private String improvementSuggestion;
}
