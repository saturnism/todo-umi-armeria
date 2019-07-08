package com.example.todo;

import com.linecorp.armeria.common.HttpRequest;
import com.linecorp.armeria.common.HttpResponse;
import com.linecorp.armeria.common.grpc.GrpcSerializationFormats;
import com.linecorp.armeria.server.ServiceWithRoutes;
import com.linecorp.armeria.server.docs.DocService;
import com.linecorp.armeria.server.grpc.GrpcServiceBuilder;
import com.linecorp.armeria.server.logging.LoggingService;
import com.linecorp.armeria.spring.ArmeriaServerConfigurator;
import com.okta.jwt.AccessTokenVerifier;
import com.okta.jwt.JwtVerifiers;
import io.grpc.protobuf.services.ProtoReflectionService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.time.temporal.ChronoUnit;

@SpringBootApplication
public class Application {
    @Bean
    AccessTokenVerifier accessTokenVerifier(@Value("${okta.issuer}") String issuer) {
        return JwtVerifiers.accessTokenVerifierBuilder()
                .setIssuer(issuer)
                .setAudience("api://default")      // defaults to 'api://default'
                .setConnectionTimeout(Duration.of(1, ChronoUnit.SECONDS)) // defaults to 1000ms
                .setReadTimeout(Duration.of(1, ChronoUnit.SECONDS))       // defaults to 1000ms
                .build();

    }

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}



@Configuration
class ArmeriaConfiguration {
    private final TodoServiceImpl todoService;

    ArmeriaConfiguration(TodoServiceImpl todoService) {
        this.todoService = todoService;
    }

    /**
     * A user can configure the server by providing an ArmeriaServerConfigurator bean.
     */
    @Bean
    public ArmeriaServerConfigurator armeriaServerConfigurator(AccessTokenVerifier accessTokenVerifier) {
        // Customize the server using the given ServerBuilder. For example:
        return builder -> {
            ServiceWithRoutes<HttpRequest, HttpResponse> grpcServices = new GrpcServiceBuilder()
                    .addService(todoService)
                    .addService(ProtoReflectionService.newInstance())
                    .enableUnframedRequests(true)
                    .supportedSerializationFormats(GrpcSerializationFormats.values())
                    .build();

            builder.service(grpcServices,
                    LoggingService.newDecorator(),
                    OktaAuthService.newInstance(accessTokenVerifier)
            );
            builder.serviceUnder("/docs", new DocService());

        };
    }
}
