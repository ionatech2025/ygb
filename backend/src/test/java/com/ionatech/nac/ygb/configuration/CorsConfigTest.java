package com.ionatech.nac.ygb.configuration;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class CorsConfigTest {

    @Test
    void parseOrigins_splitsCommaSeparatedValuesAndTrimsWhitespace() {
        assertThat(CorsConfig.parseOrigins(
            "https://ygb-gules.vercel.app, https://*.vercel.app ,http://localhost:5173"
        )).containsExactly(
            "https://ygb-gules.vercel.app",
            "https://*.vercel.app",
            "http://localhost:5173"
        );
    }

    @Test
    void parseOrigins_ignoresEmptyEntries() {
        assertThat(CorsConfig.parseOrigins("https://example.com,, ,http://localhost:5173"))
            .isEqualTo(List.of("https://example.com", "http://localhost:5173"));
    }
}
