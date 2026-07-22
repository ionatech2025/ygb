package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.ResetPasswordResult;
import com.ionatech.nac.ygb.application.ports.api.ResetUserPasswordCommand;
import com.ionatech.nac.ygb.application.ports.api.ResetUserPasswordUseCase;
import com.ionatech.nac.ygb.application.ports.spi.PasswordEncoderPort;
import com.ionatech.nac.ygb.application.ports.spi.UserRepositoryPort;
import com.ionatech.nac.ygb.domain.exceptions.UserNotFoundException;
import com.ionatech.nac.ygb.domain.model.User;

import java.security.SecureRandom;
import java.util.UUID;

public class ResetUserPasswordService implements ResetUserPasswordUseCase {

    private static final String TEMP_PASSWORD_ALPHABET =
            "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    private static final int TEMP_PASSWORD_LENGTH = 12;

    private final UserRepositoryPort userRepositoryPort;
    private final PasswordEncoderPort passwordEncoderPort;
    private final SecureRandom secureRandom = new SecureRandom();

    public ResetUserPasswordService(
            UserRepositoryPort userRepositoryPort,
            PasswordEncoderPort passwordEncoderPort
    ) {
        this.userRepositoryPort = userRepositoryPort;
        this.passwordEncoderPort = passwordEncoderPort;
    }

    @Override
    public ResetPasswordResult resetPassword(UUID userId, ResetUserPasswordCommand command) {
        User user = userRepositoryPort.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        String plainPassword = command != null && command.hasPassword()
                ? command.password()
                : generateTemporaryPassword();
        String encodedPassword = passwordEncoderPort.encode(plainPassword);
        User updatedUser = user.withPasswordHash(encodedPassword);
        userRepositoryPort.save(updatedUser);

        return new ResetPasswordResult(plainPassword);
    }

    private String generateTemporaryPassword() {
        StringBuilder password = new StringBuilder(TEMP_PASSWORD_LENGTH);
        for (int index = 0; index < TEMP_PASSWORD_LENGTH; index++) {
            password.append(TEMP_PASSWORD_ALPHABET.charAt(
                    secureRandom.nextInt(TEMP_PASSWORD_ALPHABET.length())
            ));
        }
        return password.toString();
    }
}
