package com.example.controller; // Update to your package

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SignupController {

    @GetMapping("/signup")
    public String signup() {
        return "signup"; // Maps to src/main/resources/templates/signup.html
    }
}

