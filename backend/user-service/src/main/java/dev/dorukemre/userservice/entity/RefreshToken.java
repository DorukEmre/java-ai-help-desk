package dev.dorukemre.userservice.entity;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "refresh_tokens")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@CompoundIndexes({
    @CompoundIndex(name = "token_hash_idx", def = "{'tokenHash': 1}", unique = true)
})
public class RefreshToken {

  @Id
  private String id;

  @NotBlank(message = "User ID cannot be blank")
  private String userId;

  @NotBlank(message = "Token hash cannot be blank")
  private String tokenHash;

  @NotNull(message = "expiresAt cannot be null")
  @Indexed(name = "expires_at_ttl_idx", expireAfter = "0s")
  private Instant expiresAt;

  @NotNull(message = "createdAt cannot be null")
  private Instant createdAt;

  @Builder.Default
  private boolean revoked = false;

}
