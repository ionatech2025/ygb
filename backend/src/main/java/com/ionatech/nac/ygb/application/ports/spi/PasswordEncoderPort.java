package com.ionatech.nac.ygb.application.ports.spi;

public interface PasswordEncoderPort {
    boolean matches(String rawPassword, String encodedPassword);
}
