package com.ionatech.nac.ygb.adapters.in.rest;

import com.ionatech.nac.ygb.adapters.in.rest.mapper.AdminLocationRestMapper;
import com.ionatech.nac.ygb.adapters.in.rest.security.JwtAuthenticationFilter;
import com.ionatech.nac.ygb.adapters.in.rest.security.SecurityConfig;
import com.ionatech.nac.ygb.application.ports.api.GetAdminLocationDatasetUseCase;
import com.ionatech.nac.ygb.application.ports.spi.TokenProviderPort;
import com.ionatech.nac.ygb.configuration.WebConfig;
import com.ionatech.nac.ygb.domain.valueobjects.AdminLocation;
import com.ionatech.nac.ygb.domain.valueobjects.AdminLocationLevel;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminLocationController.class)
@AutoConfigureMockMvc
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, WebConfig.class})
class AdminLocationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GetAdminLocationDatasetUseCase getDatasetUseCase;

    @MockBean
    private AdminLocationRestMapper mapper;

    @MockBean
    private TokenProviderPort tokenProviderPort; // Required because JwtAuthenticationFilter depends on it

    @Test
    void shouldReturnDatasetSuccessfullyAndBePubliclyAccessible() throws Exception {
        AdminLocation district = new AdminLocation(UUID.randomUUID(), "Kampala", null, AdminLocationLevel.DISTRICT);
        List<AdminLocation> dataset = List.of(district);

        com.ionatech.nac.ygb.adapters.in.rest.dto.AdminLocationDto dto =
                new com.ionatech.nac.ygb.adapters.in.rest.dto.AdminLocationDto(
                        district.id(), district.name(), district.parentId(), district.level().name()
                );

        when(getDatasetUseCase.getDataset()).thenReturn(dataset);
        when(mapper.toDtoList(dataset)).thenReturn(List.of(dto));

        MvcResult result = mockMvc.perform(get("/api/v1/locations/dataset")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(header().exists("ETag"))
                .andExpect(jsonPath("$.locations[0].id").value(district.id().toString()))
                .andExpect(jsonPath("$.locations[0].name").value("Kampala"))
                .andExpect(jsonPath("$.locations[0].level").value("DISTRICT"))
                .andReturn();

        String eTag = result.getResponse().getHeader("ETag");

        // Subsequent request with matching If-None-Match header should yield 304 Not Modified
        mockMvc.perform(get("/api/v1/locations/dataset")
                .header("If-None-Match", eTag)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotModified());

        verify(getDatasetUseCase, times(2)).getDataset();
    }
}
