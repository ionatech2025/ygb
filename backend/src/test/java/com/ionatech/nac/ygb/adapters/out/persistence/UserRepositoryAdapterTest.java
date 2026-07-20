package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.persistence.repository.UserJpaRepository;
import com.ionatech.nac.ygb.adapters.out.persistence.mapper.UserMapper;
import com.ionatech.nac.ygb.application.ports.spi.UserRepositoryPort;
import com.ionatech.nac.ygb.domain.model.Role;
import com.ionatech.nac.ygb.domain.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserRepositoryAdapterTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private UserJpaRepository userJpaRepository;

    private UserRepositoryPort userRepositoryPort;

    @BeforeEach
    void setUp() {
        userRepositoryPort = new UserRepositoryAdapter(userJpaRepository, UserMapper.INSTANCE);
    }

    @Test
    void shouldSaveAndFindUserByPhoneNumber() {
        User user = new User(
                UUID.randomUUID(),
                "Jane Doe",
                "0772222222",
                "hashed_pwd",
                Role.DATA_COLLECTOR,
                true,
                LocalDateTime.now()
        );

        userRepositoryPort.save(user);

        Optional<User> found = userRepositoryPort.findByPhoneNumber("0772222222");

        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Jane Doe");
        assertThat(found.get().getRole()).isEqualTo(Role.DATA_COLLECTOR);
    }

    @Test
    void shouldReturnEmptyWhenPhoneNumberNotFound() {
        Optional<User> found = userRepositoryPort.findByPhoneNumber("999999999");
        assertThat(found).isEmpty();
    }

    @Test
    void shouldFindSeededAdminUser() {
        Optional<User> admin = userRepositoryPort.findByPhoneNumber("0770000000");
        assertThat(admin).isPresent();
        assertThat(admin.get().getRole()).isEqualTo(Role.ADMIN);
    }

    @Test
    void shouldFindActiveDataCollectorsFromSeedData() {
        List<User> collectors = userRepositoryPort.findActiveByRole(Role.DATA_COLLECTOR);

        assertThat(collectors).isNotEmpty();
        assertThat(collectors).allMatch(user -> user.getRole() == Role.DATA_COLLECTOR);
        assertThat(collectors).allMatch(User::isActive);
        assertThat(collectors).extracting(User::getPhoneNumber).contains("0771111111");
    }
}
