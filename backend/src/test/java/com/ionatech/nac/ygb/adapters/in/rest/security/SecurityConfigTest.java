package com.ionatech.nac.ygb.adapters.in.rest.security;

import com.ionatech.nac.ygb.adapters.in.security.JwtAuthenticationFilter;
import com.ionatech.nac.ygb.adapters.in.security.SecurityConfig;
import com.ionatech.nac.ygb.application.ports.spi.TokenProviderPort;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = SecurityConfigTest.DummyController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, SecurityConfigTest.DummyController.class})
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TokenProviderPort tokenProviderPort;

    @Test
    void publicEndpointShouldBeAccessibleWithoutToken() throws Exception {
        mockMvc.perform(get("/api/v1/auth/test"))
                .andExpect(status().isOk());
    }

    @Test
    void protectedEndpointShouldReturnUnauthorizedWithoutToken() throws Exception {
        mockMvc.perform(get("/api/v1/protected/test"))
                .andExpect(status().isForbidden()); // By default Spring Security 6 without auth is 403 or 401. With HTTP Basic disabled it's 403.
    }

    @RestController
    static class DummyController {
        @GetMapping("/api/v1/auth/test")
        public String publicEndpoint() {
            return "Public";
        }

        @GetMapping("/api/v1/protected/test")
        public String protectedEndpoint() {
            return "Protected";
        }
    }
}
