package com.ionatech.nac.ygb.adapters.in.rest.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.ObjectPostProcessor;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.HeaderWriterFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> {})
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/locations/dataset").permitAll()
                .requestMatchers("/api/v1/public/dashboard/**").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/v1/submissions").hasRole("DATA_COLLECTOR")
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/v1/submissions/my-count").hasRole("DATA_COLLECTOR")
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/v1/submissions/my-sync-status").hasRole("DATA_COLLECTOR")
                .anyRequest().authenticated()
            )
            .headers(headers -> headers.addObjectPostProcessor(new ObjectPostProcessor<HeaderWriterFilter>() {
                @Override
                public HeaderWriterFilter postProcess(HeaderWriterFilter filter) {
                    // Avoid race with StreamingResponseBody async writes (MockMvc + export endpoints).
                    filter.setShouldWriteHeadersEagerly(true);
                    return filter;
                }
            }))
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
