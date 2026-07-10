package com.ionatech.nac.ygb.application.ports.api;

public interface AuthenticateUserUseCase {
    AuthenticationResult authenticate(AuthenticateUserCommand command);
}
