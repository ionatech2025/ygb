package com.ionatech.nac.ygb.domain.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class UserTest {

    @Test
    void shouldCreateUserWhenValidDataProvided() {
        User user = new User(
                UUID.randomUUID(),
                "John Doe",
                "0770000000",
                "hashed_password",
                Role.DATA_COLLECTOR,
                true,
                LocalDateTime.now()
        );

        assertThat(user).isNotNull();
        assertThat(user.getName()).isEqualTo("John Doe");
        assertThat(user.getPhoneNumber()).isEqualTo("0770000000");
        assertThat(user.getRole()).isEqualTo(Role.DATA_COLLECTOR);
        assertThat(user.isActive()).isTrue();
    }

    @Test
    void shouldThrowExceptionWhenNameIsNull() {
        assertThatThrownBy(() -> new User(UUID.randomUUID(), null, "0770000000", "hashed", Role.DATA_COLLECTOR, true, LocalDateTime.now()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Name cannot be null or blank");
    }

    @Test
    void shouldThrowExceptionWhenNameIsBlank() {
        assertThatThrownBy(() -> new User(UUID.randomUUID(), "   ", "0770000000", "hashed", Role.DATA_COLLECTOR, true, LocalDateTime.now()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Name cannot be null or blank");
    }

    @Test
    void shouldThrowExceptionWhenPhoneNumberIsNull() {
        assertThatThrownBy(() -> new User(UUID.randomUUID(), "John Doe", null, "hashed", Role.DATA_COLLECTOR, true, LocalDateTime.now()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Phone number cannot be null or blank");
    }

    @Test
    void shouldActivateAndDeactivateUser() {
        User user = new User(
                UUID.randomUUID(),
                "John Doe",
                "0770000000",
                "hashed_password",
                Role.DATA_COLLECTOR,
                false,
                LocalDateTime.now()
        );

        assertThat(user.isActive()).isFalse();

        user.activate();
        assertThat(user.isActive()).isTrue();

        user.deactivate();
        assertThat(user.isActive()).isFalse();
    }
}
