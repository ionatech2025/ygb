## Objective

Establish the security infrastructure for the backend by configuring Spring Security, password hashing (BCrypt), and setting up JWT-based authentication filters. This satisfies the foundation for US-AUTH-02 and US-AUTH-04.

## Architectural Context

- **Configuration**: Create `SecurityConfig` to define endpoint access rules (RBAC). Setup the `AuthenticationManager` and password encoder.
- **Adapters (Inbound)**: Create the `JwtAuthenticationFilter` to intercept requests, parse the JWT, and set the security context. Create a `JwtService` or utility class to handle token generation and validation.

## Technical Constraints & Clean Code

- **Security**: Access tokens expire in 24 hours. Passwords must be hashed using BCrypt.
- **Clean Architecture**: Security is an infrastructure concern. Keep all security annotations and configurations contained within the adapters or configuration layers, away from the Core Domain.

## Acceptance Criteria & TDD Checklist

- [ ] Write **Adapter Tests** using `@WebMvcTest` or `@SpringBootTest` to verify that secured endpoints reject unauthorized requests (401/403).
- [ ] Implement the minimal production code to configure Spring Security, password hashing, and the JWT filter.
- [ ] Refactor for clean separation of security concerns.

## Blocked by

None - can start immediately
