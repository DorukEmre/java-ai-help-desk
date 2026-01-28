package dev.dorukemre.ticketservice.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cloudinary.Cloudinary;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/ticket")
public class CloudinaryController {

  private final Cloudinary cloudinary;

  @Value("${cloudinary.api.key}")
  private String apiKey;

  @Value("${cloudinary.api.secret}")
  private String apiSecret;

  public CloudinaryController(Cloudinary cloudinary) {
    this.cloudinary = cloudinary;
  }

  @PostMapping("/cloudinary/signature")
  public Map<String, String> signUpload(@RequestBody Map<String, Object> body) {
    try {
      @SuppressWarnings("unchecked")
      Map<String, Object> paramsToSign = (Map<String, Object>) body.get("paramsToSign");

      String signature = cloudinary.apiSignRequest(
          paramsToSign,
          apiSecret,
          1);

      return Map.of("signature", signature, "apiKey", apiKey);

    } catch (Exception e) {
      throw new RuntimeException("Cloudinary signature failed", e);
    }
  }
}
