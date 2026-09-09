package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.mapper.ToolFieldDataFilterRequestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.security.JwtAuthenticationFilter;
import com.ionatech.nac.ygb.adapters.in.rest.security.SecurityConfig;
import com.ionatech.nac.ygb.application.ports.api.AuthorizePublicDownloadUseCase;
import com.ionatech.nac.ygb.application.ports.api.ExportToolFieldDataQuery;
import com.ionatech.nac.ygb.application.ports.spi.TokenProviderPort;
import com.ionatech.nac.ygb.domain.exceptions.InvalidDownloadSessionException;
import com.ionatech.nac.ygb.domain.model.DownloadSession;
import com.ionatech.nac.ygb.domain.service.ToolDownloadCatalogue;
import com.ionatech.nac.ygb.domain.valueobjects.ExportFormat;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDownloadDataset;
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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.io.OutputStream;
import java.time.LocalDateTime;
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

@WebMvcTest(PublicToolDownloadController.class)
@AutoConfigureMockMvc
@Import({
        SecurityConfig.class,
        JwtAuthenticationFilter.class,
        ToolDownloadCatalogue.class,
        ToolFieldDataFilterRequestMapper.class,
        DownloadSessionExceptionHandler.class
})
class PublicToolDownloadControllerTest {

    private static final String VALID_SESSION = "valid-download-session";

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthorizePublicDownloadUseCase authorizePublicDownloadUseCase;

    @MockBean
    private ExportToolFieldDataQuery exportToolFieldDataQuery;

    @MockBean
    private TokenProviderPort tokenProviderPort;

    @BeforeEach
    void stubDownloadSessionAuthorization() {
        when(authorizePublicDownloadUseCase.authorizeAndRecord(any(), any(), any(), any()))
                .thenAnswer(invocation -> {
                    String token = invocation.getArgument(0);
                    if (token == null || token.isBlank()) {
                        throw new InvalidDownloadSessionException(
                                "Download session required. Register a download profile first.");
                    }
                    if ("unknown-token".equals(token) || "expired-token".equals(token)) {
                        throw new InvalidDownloadSessionException(
                                "unknown-token".equals(token)
                                        ? "Unknown or invalid download session."
                                        : "Download session has expired. Register again to continue.");
                    }
                    return DownloadSession.issue(
                            UUID.randomUUID(),
                            token,
                            LocalDateTime.of(2026, 8, 4, 12, 0)
                    );
                });
        doAnswer(invocation -> {
            OutputStream output = invocation.getArgument(3);
            output.write("Dataset,District\nBYP,Kampala\n".getBytes());
            return null;
        }).when(exportToolFieldDataQuery).export(any(), any(), any(), any());
    }

    @Test
    void shouldStreamCsvWhenSessionValidAndRecordFineGrainedDataset() throws Exception {
        UUID districtId = UUID.randomUUID();
        MvcResult asyncResult = mockMvc.perform(get("/api/v1/public/downloads/BYP/csv")
                        .header(DownloadSessionHeaders.HEADER, VALID_SESSION)
                        .param("districtId", districtId.toString())
                        .param("gender", "FEMALE"))
                .andExpect(request().asyncStarted())
                .andReturn();

        mockMvc.perform(asyncDispatch(asyncResult))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.CONTENT_TYPE, MediaType.parseMediaType("text/csv").toString()))
                .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION,
                        org.hamcrest.Matchers.containsString("tool-field-data-byp-")));

        verify(authorizePublicDownloadUseCase).authorizeAndRecord(
                VALID_SESSION, PublicDownloadDataset.BYP, ExportFormat.CSV, null);
        verify(exportToolFieldDataQuery).export(
                eq(ToolDownloadDataset.BYP),
                eq(new ToolFieldDataFilter(districtId, null, null, "FEMALE", null, null)),
                eq(ExportFormat.CSV),
                any(OutputStream.class)
        );
    }

    @Test
    void shouldStreamExcelForBudgetAllocations() throws Exception {
        MvcResult asyncResult = mockMvc.perform(get("/api/v1/public/downloads/LGO_BUDGET_ALLOCATION/excel")
                        .header(DownloadSessionHeaders.HEADER, VALID_SESSION))
                .andExpect(request().asyncStarted())
                .andReturn();

        mockMvc.perform(asyncDispatch(asyncResult))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.CONTENT_TYPE,
                        MediaType.parseMediaType(ExportFormat.XLSX.contentType()).toString()));

        verify(authorizePublicDownloadUseCase).authorizeAndRecord(
                VALID_SESSION, PublicDownloadDataset.LGO_BUDGET_ALLOCATION, ExportFormat.XLSX, null);
    }

    @Test
    void shouldRejectLegacyPdmAsHubDataset() throws Exception {
        mockMvc.perform(get("/api/v1/public/downloads/PDM/csv")
                        .header(DownloadSessionHeaders.HEADER, VALID_SESSION))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("PDM")));

        verify(exportToolFieldDataQuery, never()).export(any(), any(), any(), any());
        verify(authorizePublicDownloadUseCase, never()).authorizeAndRecord(any(), any(), any(), any());
    }

    @Test
    void shouldRequireDownloadSession() throws Exception {
        mockMvc.perform(get("/api/v1/public/downloads/BYP/csv"))
                .andExpect(status().isUnauthorized());

        verify(exportToolFieldDataQuery, never()).export(any(), any(), any(), any());
    }

    @Test
    void shouldRejectUnknownSession() throws Exception {
        mockMvc.perform(get("/api/v1/public/downloads/IYP/csv")
                        .header(DownloadSessionHeaders.HEADER, "unknown-token"))
                .andExpect(status().isUnauthorized());
    }
}
