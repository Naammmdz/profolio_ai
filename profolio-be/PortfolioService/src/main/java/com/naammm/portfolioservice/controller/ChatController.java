package com.naammm.portfolioservice.controller;

import com.naammm.portfolioservice.dto.ApiResponse;
import com.naammm.portfolioservice.dto.ChatRequest;
import com.naammm.portfolioservice.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/public/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/{slug}")
    public ResponseEntity<ApiResponse<Map<String, String>>> chat(
            @PathVariable String slug,
            @RequestBody ChatRequest request
    ) {
        String response = chatService.generateResponse(slug, request.getMessage(), request.getHistory());
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "reply", response
        )));
    }
}
