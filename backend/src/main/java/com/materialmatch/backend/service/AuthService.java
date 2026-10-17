
package com.materialmatch.backend.service;

import com.materialmatch.backend.dto.AuthResponse;
import com.materialmatch.backend.dto.LoginRequest;
import com.materialmatch.backend.dto.RegisterRequest;
import com.materialmatch.backend.model.Industry;
import com.materialmatch.backend.model.UserAccount;
import com.materialmatch.backend.repository.IndustryRepository;
import com.materialmatch.backend.repository.UserAccountRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Service
public class AuthService {

    private final IndustryRepository industryRepository;
    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            IndustryRepository industryRepository,
            UserAccountRepository userAccountRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.industryRepository = industryRepository;
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);

        if (userAccountRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(
                    CONFLICT, "An account with this email already exists.");
        }

        Industry industry = new Industry(
                request.getIndustryName().trim(),
                request.getIndustryType().trim(),
                request.getLocation().trim(),
                request.getContactName().trim(),
                email,
                request.getPhone() == null ? "" : request.getPhone().trim()
        );

        Industry savedIndustry = industryRepository.save(industry);

        UserAccount account = new UserAccount(
                email,
                passwordEncoder.encode(request.getPassword()),
                savedIndustry.getId()
        );

        UserAccount savedAccount = userAccountRepository.save(account);

        String token = jwtService.generateToken(
                savedAccount.getId(),
                savedAccount.getEmail(),
                savedAccount.getIndustryId()
        );

        return new AuthResponse(
                token,
                savedAccount.getId(),
                savedIndustry.getId(),
                savedAccount.getEmail(),
                savedIndustry.getIndustryName()
        );
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);

        UserAccount account = userAccountRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(
                        UNAUTHORIZED, "Invalid email or password."));

        if (!passwordEncoder.matches(
                request.getPassword(), account.getPasswordHash())) {
            throw new ResponseStatusException(
                    UNAUTHORIZED, "Invalid email or password.");
        }

        Industry industry = industryRepository.findById(account.getIndustryId())
                .orElseThrow(() -> new ResponseStatusException(
                        UNAUTHORIZED, "The linked industry account was not found."));

        String token = jwtService.generateToken(
                account.getId(),
                account.getEmail(),
                account.getIndustryId()
        );

        return new AuthResponse(
                token,
                account.getId(),
                account.getIndustryId(),
                account.getEmail(),
                industry.getIndustryName()
        );
    }
}

