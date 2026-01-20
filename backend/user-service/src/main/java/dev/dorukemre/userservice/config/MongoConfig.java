package dev.dorukemre.userservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import com.mongodb.ConnectionString;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

@Configuration
public class MongoConfig {

  @Bean
  public MongoClient mongoClient(Environment env) {
    String uri = env.getProperty("spring.data.mongodb.uri");
    if (uri == null || uri.isBlank()) {
      throw new IllegalStateException("spring.data.mongodb.uri is not set");
    }
    return MongoClients.create(new ConnectionString(uri));
  }
}