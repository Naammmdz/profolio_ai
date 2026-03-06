package com.naammm.portfolioservice.controller;

import com.naammm.portfolioservice.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileDownloadUri = fileService.storeFile(file);
        return ResponseEntity.ok(Map.of("url", fileDownloadUri, "filename", file.getOriginalFilename()));
    }
}
