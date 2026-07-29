package com.ionatech.nac.ygb.adapters.out.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "active_fiscal_year_settings")
public class ActiveFiscalYearSettingJpaEntity {

    public static final short SINGLETON_ID = 1;

    @Id
    private Short id = SINGLETON_ID;

    @Column(name = "fiscal_year_label", nullable = false, length = 16)
    private String fiscalYearLabel;

    @Column(name = "effective_from", nullable = false)
    private LocalDateTime effectiveFrom;

    @Column(name = "set_by_user_id")
    private UUID setByUserId;

    protected ActiveFiscalYearSettingJpaEntity() {}

    public ActiveFiscalYearSettingJpaEntity(
            String fiscalYearLabel,
            LocalDateTime effectiveFrom,
            UUID setByUserId
    ) {
        this.id = SINGLETON_ID;
        this.fiscalYearLabel = fiscalYearLabel;
        this.effectiveFrom = effectiveFrom;
        this.setByUserId = setByUserId;
    }

    public Short getId() {
        return id;
    }

    public String getFiscalYearLabel() {
        return fiscalYearLabel;
    }

    public void setFiscalYearLabel(String fiscalYearLabel) {
        this.fiscalYearLabel = fiscalYearLabel;
    }

    public LocalDateTime getEffectiveFrom() {
        return effectiveFrom;
    }

    public void setEffectiveFrom(LocalDateTime effectiveFrom) {
        this.effectiveFrom = effectiveFrom;
    }

    public UUID getSetByUserId() {
        return setByUserId;
    }

    public void setSetByUserId(UUID setByUserId) {
        this.setByUserId = setByUserId;
    }
}
