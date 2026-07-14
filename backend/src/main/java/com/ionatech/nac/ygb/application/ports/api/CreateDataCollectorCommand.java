package com.ionatech.nac.ygb.application.ports.api;

public record CreateDataCollectorCommand(String name, String phoneNumber, String password) {
}
