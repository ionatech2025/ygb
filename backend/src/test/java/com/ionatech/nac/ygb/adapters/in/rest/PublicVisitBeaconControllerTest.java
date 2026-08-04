package com.ionatech.nac.ygb.adapters.in.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ionatech.nac.ygb.adapters.in.rest.security.JwtAuthenticationFilter;
import com.ionatech.nac.ygb.adapters.in.rest.security.SecurityConfig;
import com.ionatech.nac.ygb.application.ports.api.RecordPublicVisitUseCase;
import com.ionatech.nac.ygb.application.ports.spi.TokenProviderPort;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.LinkedHashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PublicVisitBeaconController.class)
@AutoConfigureMockMvc
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class PublicVisitBeaconControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private RecordPublicVisitUseCase recordPublicVisitUseCase;

    @MockBean
    private TokenProviderPort tokenProviderPort;

    @Test
    void shouldAcceptVisitBeaconWithoutAuthenticationAndReturnNoContent() throws Exception {
        when(recordPublicVisitUseCase.record("anon-session-abc", "public-dashboard")).thenReturn(true);

        mockMvc.perform(post("/api/v1/public/analytics/visit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "anonymousSessionId", "anon-session-abc",
                                "routeGroup", "public-dashboard"
                        ))))
                .andExpect(status().isNoContent());

        verify(recordPublicVisitUseCase).record("anon-session-abc", "public-dashboard");
    }

    @Test
    void shouldIgnoreEmailAndNameFieldsAndStillRecordVisit() throws Exception {
        // Chosen rule: unknown / PII fields are ignored — only anonymousSessionId + routeGroup are used.
        when(recordPublicVisitUseCase.record("anon-2", "resources")).thenReturn(true);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("anonymousSessionId", "anon-2");
        body.put("routeGroup", "resources");
        body.put("email", "should-not-be-stored@example.com");
        body.put("name", "Should Not Persist");

        mockMvc.perform(post("/api/v1/public/analytics/visit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isNoContent());

        verify(recordPublicVisitUseCase).record(eq("anon-2"), eq("resources"));
    }

    @Test
    void shouldReturnNoContentWhenDedupeIsNoOp() throws Exception {
        when(recordPublicVisitUseCase.record("anon-1", "public-dashboard")).thenReturn(false);

        mockMvc.perform(post("/api/v1/public/analytics/visit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "anonymousSessionId", "anon-1",
                                "routeGroup", "public-dashboard"
                        ))))
                .andExpect(status().isNoContent());
    }

    @Test
    void shouldReturnBadRequestWhenRequiredFieldsMissing() throws Exception {
        mockMvc.perform(post("/api/v1/public/analytics/visit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "routeGroup", "public-dashboard"
                        ))))
                .andExpect(status().isBadRequest());
    }
}
