package com.pl.premier_zone.security;

import com.pl.premier_zone.user.AppUser;
import com.pl.premier_zone.user.AppUserRepository;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AppUserDetailsService implements UserDetailsService {

    private final AppUserRepository appUserRepository;

    public AppUserDetailsService(
            AppUserRepository appUserRepository
    ) {
        this.appUserRepository = appUserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        AppUser appUser = appUserRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "No account was found for this email."
                        )
                );

        return User.builder()
                .username(appUser.getEmail())
                .password(appUser.getPasswordHash())
                .roles(appUser.getRole().name())
                .build();
    }
}