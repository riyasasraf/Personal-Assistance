package com.nullbase.personalAssist.service;

import com.nullbase.personalAssist.dto.*;
import com.nullbase.personalAssist.entity.PasswordResetToken;
import com.nullbase.personalAssist.entity.User;
import com.nullbase.personalAssist.repository.PasswordResetTokenRepository;
import com.nullbase.personalAssist.repository.UserRepository;
import com.nullbase.personalAssist.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getFirstName(),
                request.getLastName()
        );

        userRepository.save(user);
        String token = jwtUtils.generateToken(user.getEmail());
        return new AuthResponse(token, user.getEmail(), user.getFirstName(), user.getLastName());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtUtils.generateToken(user.getEmail());
        return new AuthResponse(token, user.getEmail(), user.getFirstName(), user.getLastName());
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // Clean up any existing tokens for this user
            tokenRepository.deleteByUser(user);

            // Create new token (expires in 15 minutes)
            String token = UUID.randomUUID().toString();
            PasswordResetToken resetToken = new PasswordResetToken(token, user, 15);
            tokenRepository.save(resetToken);

            // Send reset email
            sendResetEmail(user.getEmail(), token);
        }
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid password reset token"));

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new IllegalArgumentException("Password reset token has expired");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Delete the token once used
        tokenRepository.delete(resetToken);
    }

    private void sendResetEmail(String email, String token) {
        String resetUrl = frontendUrl + "/reset-password?token=" + token;
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Reset Your Password - Personal Assist");
        message.setFrom("no-reply@personalassist.com");
        message.setText("Hello,\n\n" +
                "You have requested to reset your password for Personal Assist.\n" +
                "Please click the link below to set a new password. This link will expire in 15 minutes:\n\n" +
                resetUrl + "\n\n" +
                "If you did not request this, you can safely ignore this email.\n\n" +
                "Best regards,\n" +
                "Personal Assist Team");

        mailSender.send(message);
    }
}
