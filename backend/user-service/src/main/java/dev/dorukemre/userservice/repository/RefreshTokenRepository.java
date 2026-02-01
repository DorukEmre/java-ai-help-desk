package dev.dorukemre.userservice.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import dev.dorukemre.userservice.entity.RefreshToken;

public interface RefreshTokenRepository
    extends MongoRepository<RefreshToken, String> {

  Optional<RefreshToken> findByTokenHashAndRevokedFalse(String tokenHash);

}
