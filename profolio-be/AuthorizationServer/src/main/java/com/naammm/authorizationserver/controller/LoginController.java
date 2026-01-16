package com.naammm.authorizationserver.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controller to serve the login page
 * Spring Security will handle POST /login for authentication
 */
@Controller
public class LoginController {

    @Value("${app.frontend.base-url:http://localhost:3000}")
    private String frontendBaseUrl;

    @Value("${app.frontend.register-url:http://localhost:3000/?tab=signup}")
    private String frontendRegisterUrl;

    /**
     * Serve the login page template
     * This is called when user is redirected to /login by Spring Security
     */
    @GetMapping("/login")
    public String login(Model model) {
        model.addAttribute("frontendBaseUrl", frontendBaseUrl);
        model.addAttribute("frontendRegisterUrl", frontendRegisterUrl);
        return "login"; // Returns login.html template from templates folder
    }
}
