package com.naammm.portfolioservice;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.naammm.portfolioservice.dto.SuggestedQuestionDto;
import org.junit.jupiter.api.Test;

import java.util.UUID;

public class JacksonTest {

    @Test
    public void test() throws Exception {
        SuggestedQuestionDto dto = SuggestedQuestionDto.builder()
                .id(UUID.randomUUID())
                .question("Test")
                .isDefault(true)
                .build();
        ObjectMapper mapper = new ObjectMapper();
        System.out.println("JSON: " + mapper.writeValueAsString(dto));
    }
}
