package com.ionatech.nac.ygb.application.ports.api;

public record ResetUserPasswordCommand(String password) {
    public boolean hasPassword() {
        return password != null && !password.isBlank();
    }
}
