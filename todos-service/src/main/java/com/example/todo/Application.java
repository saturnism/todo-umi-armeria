package com.example.todo;

import com.linecorp.armeria.common.HttpRequest;
import com.linecorp.armeria.common.HttpResponse;
import com.linecorp.armeria.common.grpc.GrpcSerializationFormats;
import com.linecorp.armeria.server.ServiceWithRoutes;
import com.linecorp.armeria.server.docs.DocService;
import com.linecorp.armeria.server.grpc.GrpcServiceBuilder;
import com.linecorp.armeria.server.logging.LoggingService;
import com.linecorp.armeria.spring.ArmeriaServerConfigurator;
import io.grpc.protobuf.services.ProtoReflectionService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.time.temporal.ChronoUnit;

@SpringBootApplication
public class Application {
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
    public ArmeriaServerConfigurator armeriaServerConfigurator() {
        // Customize the server using the given ServerBuilder. For example:
        return builder -> {
            ServiceWithRoutes<HttpRequest, HttpResponse> grpcServices = new GrpcServiceBuilder()
                    .addService(todoService)
                    .addService(ProtoReflectionService.newInstance())
                    .enableUnframedRequests(true)
                    .supportedSerializationFormats(GrpcSerializationFormats.values())
                    .build();

            builder.service(grpcServices,
                    LoggingService.newDecorator()
            );
            builder.serviceUnder("/docs", new DocService());

        };
    }
}
