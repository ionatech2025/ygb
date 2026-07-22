package com.ionatech.nac.ygb.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

public class User {
    private final UUID id;
    private final String name;
    private final String phoneNumber;
    private final String passwordHash;
    private final Role role;
    private boolean isActive;
    private final LocalDateTime createdAt;

    public User(UUID id, String name, String phoneNumber, String passwordHash, Role role, boolean isActive, LocalDateTime createdAt) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be null or blank");
        }
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("Phone number cannot be null or blank");
        }

        this.id = id;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.passwordHash = passwordHash;
        this.role = role;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getPasswordHash() { return passwordHash; }
    public Role getRole() { return role; }
    public boolean isActive() { return isActive; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void activate() {
        this.isActive = true;
    }

    public void deactivate() {
        this.isActive = false;
    }

    public User withPasswordHash(String newPasswordHash) {
        if (newPasswordHash == null || newPasswordHash.isBlank()) {
            throw new IllegalArgumentException("Password hash cannot be null or blank");
        }
        return new User(id, name, phoneNumber, newPasswordHash, role, isActive, createdAt);
    }
}
