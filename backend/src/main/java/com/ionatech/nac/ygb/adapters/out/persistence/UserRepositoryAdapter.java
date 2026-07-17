package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.persistence.entity.UserEntity;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.UserJpaRepository;
import com.ionatech.nac.ygb.adapters.out.persistence.mapper.UserMapper;
import com.ionatech.nac.ygb.application.ports.spi.UserRepositoryPort;
import com.ionatech.nac.ygb.domain.model.User;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
public class UserRepositoryAdapter implements UserRepositoryPort {

    private final UserJpaRepository jpaRepository;
    private final UserMapper mapper;

    public UserRepositoryAdapter(UserJpaRepository jpaRepository, UserMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Optional<User> findByPhoneNumber(String phoneNumber) {
        return jpaRepository.findByPhoneNumber(phoneNumber)
                .map(mapper::toDomain);
    }

    @Override
    public Optional<User> findById(UUID id) {
        return jpaRepository.findById(id)
                .map(mapper::toDomain);
    }

    @Override
    public User save(User user) {
        UserEntity entity = mapper.toEntity(user);
        UserEntity saved = jpaRepository.save(entity);
        return mapper.toDomain(saved);
    }
}
