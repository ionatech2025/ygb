package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.mapper.ToolFieldDataFilterRequestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.security.JwtAuthenticationFilter;
import com.ionatech.nac.ygb.adapters.in.rest.security.SecurityConfig;
import com.ionatech.nac.ygb.application.ports.api.ExportToolFieldDataQuery;
import com.ionatech.nac.ygb.application.ports.spi.TokenProviderPort;
import com.ionatech.nac.ygb.domain.model.Role;
import com.ionatech.nac.ygb.domain.service.ToolDownloadCatalogue;
import com.ionatech.nac.ygb.domain.valueobjects.ExportFormat;
import com.ionatech.nac.ygb.domain.valueobjects.ToolDownloadDataset;
import com.ionatech.nac.ygb.domain.valueobjects.ToolFieldDataFilter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.io.OutputStream;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.asyncDispatch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.request;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminToolDownloadController.class)
@AutoConfigureMockMvc
@Import({
        SecurityConfig.class,
        JwtAuthenticationFilter.class,
        ToolDownloadCatalogue.class,
        ToolFieldDataFilterRequestMapper.class
})
class AdminToolDownloadControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ExportToolFieldDataQuery exportToolFieldDataQuery;

    @MockBean
    private TokenProviderPort tokenProviderPort;

    @BeforeEach
    void stubExport() {
        doAnswer(invocation -> {
            OutputStream output = invocation.getArgument(3);
            output.write("Dataset,District\nPC,Gulu\n".getBytes());
            return null;
        }).when(exportToolFieldDataQuery).export(any(), any(), any(), any());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldStreamCsvForAdminWithoutDownloadSession() throws Exception {
        UUID parishId = UUID.randomUUID();
        MvcResult asyncResult = mockMvc.perform(get("/api/v1/admin/downloads/PC/csv")
                        .param("parishId", parishId.toString())
                        .param("ageGroup", "AGE_18_24"))
                .andExpect(request().asyncStarted())
                .andReturn();

        mockMvc.perform(asyncDispatch(asyncResult))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.CONTENT_TYPE, MediaType.parseMediaType("text/csv").toString()))
                .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION,
                        org.hamcrest.Matchers.containsString("tool-field-data-pc-")));

        verify(exportToolFieldDataQuery).export(
                eq(ToolDownloadDataset.PC),
                eq(new ToolFieldDataFilter(null, null, parishId, null, "AGE_18_24", null)),
                eq(ExportFormat.CSV),
                any(OutputStream.class)
        );
    }

    @Test
    void shouldStreamCsvWhenAuthenticatedViaJwtAcrossAsyncDispatch() throws Exception {
        when(tokenProviderPort.isTokenValid("admin-token")).thenReturn(true);
        when(tokenProviderPort.validateTokenAndGetUserId("admin-token")).thenReturn(Optional.of("admin-1"));
        when(tokenProviderPort.validateTokenAndGetRole("admin-token")).thenReturn(Optional.of(Role.ADMIN));

        MvcResult asyncResult = mockMvc.perform(get("/api/v1/admin/downloads/BYP/csv")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer admin-token"))
                .andExpect(request().asyncStarted())
                .andReturn();

        mockMvc.perform(asyncDispatch(asyncResult))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION,
                        org.hamcrest.Matchers.containsString("tool-field-data-byp-")));

        verify(exportToolFieldDataQuery).export(
                eq(ToolDownloadDataset.BYP),
                any(ToolFieldDataFilter.class),
                eq(ExportFormat.CSV),
                any(OutputStream.class)
        );
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldRejectLegacyPdm() throws Exception {
        mockMvc.perform(get("/api/v1/admin/downloads/PDM/excel"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("PDM")));

        verify(exportToolFieldDataQuery, never()).export(any(), any(), any(), any());
    }

    @Test
    @WithMockUser(roles = "DATA_COLLECTOR")
    void shouldForbidNonAdmin() throws Exception {
        mockMvc.perform(get("/api/v1/admin/downloads/BYP/csv"))
                .andExpect(status().isForbidden());

        verify(exportToolFieldDataQuery, never()).export(any(), any(), any(), any());
    }

    @Test
    void shouldRejectUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/v1/admin/downloads/BYP/csv"))
                .andExpect(status().isForbidden());
    }
}
