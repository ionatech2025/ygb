package com.ionatech.nac.ygb.adapters.out.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "admin_locations")
@Getter
@Setter
@NoArgsConstructor
public class AdminLocationJpaEntity {

    @Id
    private UUID id;

    @Column(nullable = false)
    private String name;

    /** Null for top-level DISTRICT entries. */
    @Column(name = "parent_id")
    private UUID parentId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private com.ionatech.nac.ygb.domain.valueobjects.AdminLocationLevel level;
}
