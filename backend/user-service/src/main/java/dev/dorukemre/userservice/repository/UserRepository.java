package dev.dorukemre.userservice.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import dev.dorukemre.userservice.entity.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

  public Optional<User> findByUsername(String username);

  public boolean existsByUsername(String username);
}
