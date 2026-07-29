package com.ionatech.nac.ygb.application.ports.api;

import java.util.UUID;

public record SetActiveFiscalYearCommand(String fiscalYearLabel, UUID adminUserId) {}
