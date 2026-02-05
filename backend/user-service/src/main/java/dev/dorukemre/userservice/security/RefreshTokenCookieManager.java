package dev.dorukemre.userservice.security;

import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletResponse;

@Service
public class RefreshTokenCookieManager {

  public void addRefreshTokenCookie(
      HttpServletResponse response,
      String refreshToken) {

    // dev
    response.addHeader(
        "Set-Cookie",
        "refreshToken=" + refreshToken
            + "; HttpOnly; Secure; SameSite=None; Path=/refresh; Max-Age=604800");

    // prod
    // response.addHeader(
    // "Set-Cookie",
    // "refreshToken=" + refreshToken
    // + "; HttpOnly; Secure; SameSite=Strict; Path=/refresh; Max-Age=604800");
  }

  public void removeRefreshTokenCookie(HttpServletResponse response) {

    response.addHeader(
        "Set-Cookie",
        "refreshToken=; HttpOnly; Secure; SameSite=None; Path=/refresh; Max-Age=0");
  }
}
