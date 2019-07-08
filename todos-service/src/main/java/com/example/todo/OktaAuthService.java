package com.example.todo;

import com.linecorp.armeria.common.HttpRequest;
import com.linecorp.armeria.common.HttpResponse;
import com.linecorp.armeria.common.HttpStatus;
import com.linecorp.armeria.server.Service;
import com.linecorp.armeria.server.ServiceRequestContext;
import com.linecorp.armeria.server.SimpleDecoratingService;
import com.okta.jwt.AccessTokenVerifier;
import com.okta.jwt.Jwt;
import com.okta.jwt.JwtVerificationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

public class OktaAuthService extends SimpleDecoratingService<HttpRequest, HttpResponse> {
    private static Logger logger = LoggerFactory.getLogger(OktaAuthService.class);
    private final AccessTokenVerifier accessTokenVerifier;

    OktaAuthService(Service<HttpRequest, HttpResponse> delegate,
                    AccessTokenVerifier accessTokenVerifier) {
        super(delegate);
        this.accessTokenVerifier = accessTokenVerifier;
    }

    @Override
    public HttpResponse serve(ServiceRequestContext ctx, HttpRequest req) throws Exception {
        String authorization = req.headers().get("authorization");
        if (authorization == null) {
            logger.info("no authorization header");
            return HttpResponse.of(HttpStatus.UNAUTHORIZED);
        }
        try {
            Jwt jwt = accessTokenVerifier.decode(authorization);
            jwt.getClaims().forEach((key, value) -> {
                logger.info("claim key: {}, value: {}", key, value);
            });
            List<String> groups = (List<String>) jwt.getClaims().get("groups");
            List<GrantedAuthority> authorities = groups.stream()
                    .map(group -> "ROLE_" + group.toUpperCase())
                    .map(group -> new SimpleGrantedAuthority(group))
                    .collect(Collectors.toList());

            SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                    jwt.getClaims().get("sub"), authorization, authorities

            ));
        } catch (JwtVerificationException e) {
            logger.warn("auth failed", e);
            SecurityContextHolder.clearContext();
            return HttpResponse.of(HttpStatus.UNAUTHORIZED);
        }

        return this.delegate().serve(ctx, req);
    }

    public static Function<Service<HttpRequest, HttpResponse>, OktaAuthService> newInstance(AccessTokenVerifier accessTokenVerifier) {
        return (delegate) -> {
            return new OktaAuthService(delegate, accessTokenVerifier);
        };
    }
}
