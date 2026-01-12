package com.naammm.agw;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication(exclude = {
    org.springframework.cloud.consul.serviceregistry.ConsulAutoServiceRegistrationAutoConfiguration.class
})
@EnableDiscoveryClient
public class AgwApplication {

    public static void main(String[] args) {
        SpringApplication.run(AgwApplication.class, args);
    }

}
