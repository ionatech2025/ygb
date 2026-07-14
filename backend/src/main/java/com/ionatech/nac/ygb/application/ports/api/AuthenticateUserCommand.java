package com.ionatech.nac.ygb.application.ports.api;

public record AuthenticateUserCommand(String phoneNumber, String password) {
}
