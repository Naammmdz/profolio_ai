package com.naammm.portfolioservice.service;

import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Service
public class CVService {

    private final Tika tika = new Tika();

    /**
     * Extracts text from an uploaded CV file (PDF, DOCX, etc.)
     * 
     * @param file The uploaded multipart file
     * @return Extracted text content
     * @throws IOException If file reading fails
     */
    public String extractText(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        try (InputStream stream = file.getInputStream()) {
            return tika.parseToString(stream);
        } catch (TikaException e) {
            throw new IOException("Failed to parse document content", e);
        }
    }

    /**
     * Validates if the file type is supported (PDF or DOCX)
     * 
     * @param file The uploaded multipart file
     * @return true if supported
     */
    public boolean isSupportedFormat(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && (
                contentType.equals("application/pdf") || 
                contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
                contentType.equals("application/msword")
        );
    }
}
