package com.ionatech.nac.ygb.adapters.out.persistence.repository;

import com.ionatech.nac.ygb.adapters.out.persistence.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserJpaRepository extends JpaRepository<UserEntity, UUID> {
    Optional<UserEntity> findByPhoneNumber(String phoneNumber);
}
