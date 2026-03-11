package com.naammm.portfolioservice.service;

import com.naammm.portfolioservice.model.AIPersonality;
import com.naammm.portfolioservice.model.Portfolio;
import com.naammm.portfolioservice.model.ToolboxConfig;
import com.naammm.portfolioservice.repository.AIPersonalityRepository;
import com.naammm.portfolioservice.repository.PortfolioRepository;
import com.naammm.portfolioservice.repository.ToolboxConfigRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ChatModel chatModel;
    private final PortfolioRepository portfolioRepository;
    private final AIPersonalityRepository personalityRepository;
    private final ToolboxConfigRepository toolboxConfigRepository;

    public String generateResponse(String slug, String userMessage, List<Map<String, String>> history) {
        Portfolio portfolio = portfolioRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Portfolio not found for slug: " + slug));

        AIPersonality personality = personalityRepository.findByPortfolio(portfolio)
                .orElseGet(() -> AIPersonality.builder().temperature(50).build());

        Optional<ToolboxConfig> toolboxOpt = toolboxConfigRepository.findByPortfolio(portfolio);

        // Block all chat if global toggle is off
        if (toolboxOpt.isPresent()) {
            ToolboxConfig tc = toolboxOpt.get();
            if (Boolean.FALSE.equals(tc.getIsGlobalEnabled())) {
                return "I'm not available for chat right now. Please check back later.";
            }
        }

        String systemPrompt = buildSystemPrompt(portfolio, personality, toolboxOpt.orElse(null));

        List<Message> messages = new ArrayList<>();
        messages.add(new SystemMessage(systemPrompt));

        if (history != null) {
            for (Map<String, String> entry : history) {
                if ("user".equals(entry.get("role"))) {
                    messages.add(new UserMessage(entry.get("content")));
                } else if ("assistant".equals(entry.get("role"))) {
                    messages.add(new AssistantMessage(entry.get("content")));
                }
            }
        }

        messages.add(new UserMessage(userMessage));

        Prompt prompt = new Prompt(messages);

        try {
            return chatModel.call(prompt).getResult().getOutput().getText();
        } catch (Exception e) {
            log.error("Error calling Gemini API", e);
            return "Sorry, I'm having trouble thinking right now. Please try again later.";
        }
    }

    private String buildSystemPrompt(Portfolio portfolio, AIPersonality p, ToolboxConfig tc) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are acting as the personal AI representative of ").append(portfolio.getHeadline()).append(".\n");
        sb.append("YOUR GOAL: Answer questions from visitors to my portfolio in a way that truly represents me.\n");
        sb.append("STRICT RULE: Always answer in the FIRST PERSON ('I', 'me', 'my'). Never say you are an AI. You ARE ").append(portfolio.getHeadline()).append(".\n\n");

        sb.append("### CONTEXT ABOUT ME (FROM MY CV):\n");
        sb.append(p.getCvText() != null ? p.getCvText() : "Information is being updated.").append("\n\n");

        sb.append("### MY PROFESSIONAL IDENTITY:\n");
        sb.append(p.getProfessionalBio() != null ? p.getProfessionalBio() : "").append("\n");

        // Skills — only if enabled
        if (tc == null || !Boolean.FALSE.equals(tc.getIsSkillsEnabled())) {
            sb.append("My Skills: ").append(p.getSkills() != null ? p.getSkills() : "").append("\n");
        }
        sb.append("\n");

        sb.append("### MY PERSONALITY & STYLE:\n");
        sb.append("Communication Style: ").append(p.getCommunicationStyle() != null ? p.getCommunicationStyle() : "Professional and friendly").append("\n");
        sb.append("Interests: ").append(p.getInterests() != null ? p.getInterests() : "").append("\n");
        sb.append("General Context: ").append(p.getGeneralContext() != null ? p.getGeneralContext() : "").append("\n\n");

        // Tool-gated context sections
        if (tc != null) {
            // Me info
            if (!Boolean.FALSE.equals(tc.getIsMeEnabled()) && tc.getMeIntroduction() != null) {
                sb.append("### ABOUT ME:\n");
                sb.append(tc.getMeIntroduction()).append("\n");
                if (tc.getMeTags() != null && !tc.getMeTags().isEmpty()) {
                    sb.append("Tags/Keywords: ").append(String.join(", ", tc.getMeTags())).append("\n");
                }
                sb.append("\n");
            }

            // Contact
            if (!Boolean.FALSE.equals(tc.getIsContactEnabled())) {
                sb.append("### CONTACT:\n");
                if (tc.getContactEmail() != null) sb.append("Email: ").append(tc.getContactEmail()).append("\n");
                if (tc.getContactPhone() != null) sb.append("Phone: ").append(tc.getContactPhone()).append("\n");
                if (tc.getContactHandle() != null) sb.append("Handle: ").append(tc.getContactHandle()).append("\n");
                sb.append("\n");
            } else {
                sb.append("RULE: Do NOT share any contact information in this session.\n\n");
            }

            // Location
            if (!Boolean.FALSE.equals(tc.getIsLocationEnabled())) {
                if (tc.getLocationCity() != null || tc.getLocationCountry() != null) {
                    sb.append("### LOCATION:\n");
                    sb.append("Based in: ").append(tc.getLocationCity() != null ? tc.getLocationCity() : "").append(", ").append(tc.getLocationCountry() != null ? tc.getLocationCountry() : "").append("\n\n");
                }
            } else {
                sb.append("RULE: Do NOT share location information in this session.\n\n");
            }

            // Resume
            if (!Boolean.FALSE.equals(tc.getIsResumeEnabled()) && tc.getResumeFileUrl() != null) {
                sb.append("### RESUME:\n");
                if (tc.getResumeDescription() != null) sb.append(tc.getResumeDescription()).append("\n");
                sb.append("Download link: ").append(tc.getResumeFileUrl()).append("\n\n");
            } else if (Boolean.FALSE.equals(tc.getIsResumeEnabled())) {
                sb.append("RULE: Do NOT share resume or CV links in this session.\n\n");
            }

            // Video
            if (!Boolean.FALSE.equals(tc.getIsVideoEnabled()) && tc.getVideoUrl() != null) {
                sb.append("### VIDEO INTRODUCTION:\n");
                if (tc.getVideoTitle() != null) sb.append(tc.getVideoTitle()).append("\n");
                sb.append("Link: ").append(tc.getVideoUrl()).append("\n\n");
            } else if (Boolean.FALSE.equals(tc.getIsVideoEnabled())) {
                sb.append("RULE: Do NOT share video links in this session.\n\n");
            }

            // Hobbies
            if (!Boolean.FALSE.equals(tc.getIsHobbiesEnabled()) && tc.getHobbiesDescription() != null) {
                sb.append("### HOBBIES & INTERESTS:\n");
                sb.append(tc.getHobbiesDescription()).append("\n\n");
            } else if (Boolean.FALSE.equals(tc.getIsHobbiesEnabled())) {
                sb.append("RULE: Do NOT discuss hobbies or personal interests in this session.\n\n");
            }
        }

        sb.append("### GUIDELINES:\n");
        sb.append("- Be concise but helpful.\n");
        if (p.getCommunicationStyle() != null) {
            sb.append("- Maintain a '").append(p.getCommunicationStyle()).append("' tone throughout the conversation.\n");
        }
        sb.append("- If you don't know something based on the context, answer gracefully in character, perhaps saying you'd love to discuss that more in a real interview.\n");

        return sb.toString();
    }
}
