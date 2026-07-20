package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.AuthenticateUserCommand;
import com.ionatech.nac.ygb.application.ports.api.AuthenticateUserUseCase;
import com.ionatech.nac.ygb.application.ports.api.AuthenticationResult;
import com.ionatech.nac.ygb.application.ports.spi.PasswordEncoderPort;
import com.ionatech.nac.ygb.application.ports.spi.TokenProviderPort;
import com.ionatech.nac.ygb.application.ports.spi.UserRepositoryPort;
import com.ionatech.nac.ygb.domain.exceptions.InvalidCredentialsException;
import com.ionatech.nac.ygb.domain.model.User;
public class AuthenticateUserService implements AuthenticateUserUseCase {

    private final UserRepositoryPort userRepositoryPort;
    private final PasswordEncoderPort passwordEncoderPort;
    private final TokenProviderPort tokenProviderPort;

    public AuthenticateUserService(UserRepositoryPort userRepositoryPort,
                                   PasswordEncoderPort passwordEncoderPort,
                                   TokenProviderPort tokenProviderPort) {
        this.userRepositoryPort = userRepositoryPort;
        this.passwordEncoderPort = passwordEncoderPort;
        this.tokenProviderPort = tokenProviderPort;
    }

    @Override
    public AuthenticationResult authenticate(AuthenticateUserCommand command) {
        User user = userRepositoryPort.findByPhoneNumber(command.phoneNumber())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid credentials"));

        if (!user.isActive()) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        if (!passwordEncoderPort.matches(command.password(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        String token = tokenProviderPort.generateToken(user.getId(), user.getRole());
        return new AuthenticationResult(token);
    }
}
