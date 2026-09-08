package com.bytepath.service;

import com.bytepath.model.User;
import com.bytepath.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Spring Security UserDetailsService implementation.
 * Loads a User by loginId (which is the Spring Security "username").
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepo;

    public UserDetailsServiceImpl(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String loginId) throws UsernameNotFoundException {
        return userRepo.findByLoginId(loginId)
            .orElseThrow(() ->
                new UsernameNotFoundException("User not found with loginId: " + loginId));
    }
}
