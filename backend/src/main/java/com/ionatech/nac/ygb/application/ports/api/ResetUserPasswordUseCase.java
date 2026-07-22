package com.ionatech.nac.ygb.application.ports.api;

import java.util.UUID;

public interface ResetUserPasswordUseCase {
    ResetPasswordResult resetPassword(UUID userId, ResetUserPasswordCommand command);
}
