package com.arpon007.shortner.Service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.arpon007.shortner.dtos.LoginRequest;
import com.arpon007.shortner.jwt.JwtAuthenticationResponse;
import com.arpon007.shortner.jwt.JwtUtils;
import com.arpon007.shortner.models.User;
import com.arpon007.shortner.repo.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserService {

    private PasswordEncoder passwordEncoder;
    private UserRepository userRepository;
    private AuthenticationManager authenticationManager;
    private JwtUtils jwtUtils;

    public void registerUser(User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    public JwtAuthenticationResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String jwt = jwtUtils.generateToken(userDetails);
        return new JwtAuthenticationResponse(jwt);

    }

    public User findByUserName(String name) {
        return userRepository.findByUsername(name)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + name));
    }
}
