package com.ionatech.nac.ygb.adapters.in.rest.mapper;

import com.ionatech.nac.ygb.adapters.in.rest.dto.UserResponse;
import com.ionatech.nac.ygb.domain.model.Role;
import com.ionatech.nac.ygb.domain.model.User;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class UserRestMapperTest {

    private final UserRestMapper mapper = Mappers.getMapper(UserRestMapper.class);

    @Test
    void shouldMapActiveFlagOnUserResponse() {
        User user = new User(
                UUID.randomUUID(),
                "Jane Doe",
                "0771234567",
                "hash",
                Role.DATA_COLLECTOR,
                true,
                LocalDateTime.now()
        );

        UserResponse response = mapper.toResponse(user);

        assertThat(response.isActive()).isTrue();
    }
}
