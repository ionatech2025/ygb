package com.ionatech.nac.ygb.domain.valueobjects;

import com.ionatech.nac.ygb.domain.model.FormType;

public record FormTypeCount(FormType formType, long count) {
    public FormTypeCount {
        if (formType == null) {
            throw new IllegalArgumentException("FormTypeCount formType must not be null.");
        }
        if (count < 0) {
            throw new IllegalArgumentException("FormTypeCount count must not be negative.");
        }
    }
}
