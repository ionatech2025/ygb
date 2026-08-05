package com.ionatech.nac.ygb.application.ports.api;

public interface RegisterDownloadProfileUseCase {
    RegisteredDownloadSessionView register(RegisterDownloadProfileCommand command);
}
