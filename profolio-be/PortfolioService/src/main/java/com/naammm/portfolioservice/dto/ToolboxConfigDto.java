package com.naammm.portfolioservice.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ToolboxConfigDto {
    private MeInfo meInfo;
    private HobbiesInfo hobbiesInfo;
    private ContactInfo contactInfo;
    private ResumeInfo resumeInfo;
    private VideoInfo videoInfo;
    private LocationInfo locationInfo;

    @Data
    @Builder
    public static class MeInfo {
        private String name;
        private String age;
        private String location;
        private String introduction;
        private List<String> tags;
        private String photoUrl;
    }

    @Data
    @Builder
    public static class HobbiesInfo {
        private String title;
        private String description;
        private List<String> photos;
    }

    @Data
    @Builder
    public static class ContactInfo {
        private String name;
        private String email;
        private String phone;
        private String handle;
        private String address;
        private List<String> socialPlatforms;
        private List<String> socialUrls;
    }

    @Data
    @Builder
    public static class ResumeInfo {
        private String title;
        private String description;
        private String fileUrl;
        private String fileName;
    }

    @Data
    @Builder
    public static class VideoInfo {
        private String title;
        private String url;
        private String description;
    }

    @Data
    @Builder
    public static class LocationInfo {
        private String city;
        private String country;
    }
}
