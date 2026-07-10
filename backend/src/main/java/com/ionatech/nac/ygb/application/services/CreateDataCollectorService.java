package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.CreateDataCollectorCommand;
import com.ionatech.nac.ygb.application.ports.api.CreateDataCollectorUseCase;
import com.ionatech.nac.ygb.application.ports.spi.PasswordEncoderPort;
import com.ionatech.nac.ygb.application.ports.spi.UserRepositoryPort;
import com.ionatech.nac.ygb.domain.exceptions.UserAlreadyExistsException;
import com.ionatech.nac.ygb.domain.model.Role;
import com.ionatech.nac.ygb.domain.model.User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class CreateDataCollectorService implements CreateDataCollectorUseCase {

    private final UserRepositoryPort userRepositoryPort;
    private final PasswordEncoderPort passwordEncoderPort;

    public CreateDataCollectorService(UserRepositoryPort userRepositoryPort, PasswordEncoderPort passwordEncoderPort) {
        this.userRepositoryPort = userRepositoryPort;
        this.passwordEncoderPort = passwordEncoderPort;
    }

    @Override
    public User createDataCollector(CreateDataCollectorCommand command) {
        if (userRepositoryPort.findByPhoneNumber(command.phoneNumber()).isPresent()) {
            throw new UserAlreadyExistsException("A user with phone number " + command.phoneNumber() + " already exists.");
        }

        String encodedPassword = passwordEncoderPort.encode(command.password());

        User user = new User(
                UUID.randomUUID(),
                command.name(),
                command.phoneNumber(),
                encodedPassword,
                Role.DATA_COLLECTOR,
                true,
                LocalDateTime.now()
        );

        return userRepositoryPort.save(user);
    }
}
