package com.naammm.portfolioservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.naammm.portfolioservice.dto.ai.CVExtractedData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.converter.BeanOutputConverter;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AICVExtractorService {

    private final ChatModel chatModel;
    private final ObjectMapper objectMapper;

    public CVExtractedData extract(String cvText) {
        BeanOutputConverter<CVExtractedData> converter = new BeanOutputConverter<>(CVExtractedData.class);

        String promptTemplate = """
            You are an expert technical recruiter and portfolio designer.
            I will provide you with the raw extracted text of a candidate's CV/Resume.
            Your task is to analyze it deeply and extract structured information to build their online portfolio.
            
            Be very creative. Do not just copy the text. Format the text logically, summarize, and adapt it for an engaging portfolio.
            
            Here is the CV text:
            ---
            {cvText}
            ---
            
            Please provide the result conforming to the following JSON structure:
            {format}
            
            Important rules for extraction:
            1. headline: A catchy welcome message (e.g., 'Hello everyone! I'm John').
            2. tagline: Their current core role or main identity (e.g., 'Senior Software Engineer').
            3. personality.biggestFlex: What is their most impressive achievement?
            4. personality.communicationStyle: How would they talk? (e.g., Direct, Analytical, Friendly).
            5. personality.generalContext: Anything else the AI should know when roleplaying as them to answer recruiters' questions.
            6. categories for skills: Group their skills logically (e.g., 'Frontend', 'Backend', 'Soft Skills').
            7. project tags: Extract 2-4 keywords or technologies per project. Look out for tech stack details.
            
            IMPORTANT: Return ONLY the raw JSON object. Do NOT wrap in markdown code blocks. Do NOT add any explanation text.
            """;

        String promptText = promptTemplate
                .replace("{cvText}", cvText)
                .replace("{format}", converter.getFormat());

        String rawResponse = null;
        try {
            Prompt prompt = new Prompt(promptText);
            rawResponse = chatModel.call(prompt).getResult().getOutput().getText();

            // Strip markdown code fences if AI wraps response
            String cleaned = cleanJson(rawResponse);

            // Try BeanOutputConverter first
            try {
                return converter.convert(cleaned);
            } catch (Exception converterEx) {
                log.warn("BeanOutputConverter failed, trying ObjectMapper directly: {}", converterEx.getMessage());
                // Fallback: parse directly with ObjectMapper
                return objectMapper.readValue(cleaned, CVExtractedData.class);
            }

        } catch (Exception e) {
            log.error("Failed to process CV extraction. Raw AI response:\n{}", rawResponse, e);
            throw new RuntimeException("Failed to analyze CV with AI: " + e.getMessage(), e);
        }
    }

    /** Strip markdown code fences: ```json ... ``` or ``` ... ``` */
    private String cleanJson(String raw) {
        if (raw == null) return "{}";
        String trimmed = raw.trim();
        // Remove opening fence: ```json or ```
        trimmed = trimmed.replaceAll("(?s)^```(?:json)?\\s*", "");
        // Remove closing fence
        trimmed = trimmed.replaceAll("(?s)\\s*```$", "");
        return trimmed.trim();
    }
}
