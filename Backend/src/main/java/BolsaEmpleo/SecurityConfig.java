package BolsaEmpleo;

import BolsaEmpleo.data.UsuarioRepository;
import BolsaEmpleo.logic.Base.Usuario;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * SecurityConfig adaptada para REST API + React frontend.
 *
 * Cambios clave respecto a la versión MVC:
 *  - CORS global configurado para http://localhost:5173 (Vite dev server).
 *  - Las sesiones se mantienen (session-based auth) porque React enviará
 *    la cookie de sesión en cada request (credentials: 'include').
 *  - Los endpoints /api/** quedan protegidos por rol, igual que antes.
 *  - Login y logout ahora responden JSON en vez de redirect.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UsuarioRepository usuarioRepository;

    public SecurityConfig(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // ── Rutas públicas ──────────────────────────────────────
                .requestMatchers(
                    "/api/auth/login",
                    "/api/auth/logout",
                    "/api/auth/registro/empresa",
                    "/api/auth/registro/oferente",
                    "/api/public/**"
                ).permitAll()
                // ── Admin ───────────────────────────────────────────────
                .requestMatchers("/api/admin/**").hasRole("ADM")
                // ── Empresa ─────────────────────────────────────────────
                .requestMatchers("/api/empresa/**").hasRole("EMP")
                // ── Oferente ────────────────────────────────────────────
                .requestMatchers("/api/oferente/**").hasRole("OFE")
                .anyRequest().authenticated()
            )
            // Login vía JSON — el cliente React envía { username, clave }
            .formLogin(form -> form
                .loginProcessingUrl("/api/auth/login")
                .usernameParameter("username")
                .passwordParameter("clave")
                .successHandler((req, res, auth) -> {
                    res.setContentType("application/json");
                    String role = auth.getAuthorities().iterator().next().getAuthority();
                    String tipo = role.replace("ROLE_", "");
                    res.getWriter().write("{\"rol\":\"" + tipo + "\",\"username\":\"" + auth.getName() + "\"}");
                })
                .failureHandler((req, res, ex) -> {
                    res.setStatus(401);
                    res.setContentType("application/json");
                    res.getWriter().write("{\"error\":\"Usuario o contraseña incorrectos.\"}");
                })
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/api/auth/logout")
                .logoutSuccessHandler((req, res, auth) -> {
                    res.setContentType("application/json");
                    res.getWriter().write("{\"mensaje\":\"Sesión cerrada.\"}");
                })
                .invalidateHttpSession(true)
                .clearAuthentication(true)
                .permitAll()
            );

        return http.build();
    }

    /**
     * CORS: permite que React (localhost:5173) envíe cookies de sesión.
     * En producción reemplaza el origin por el dominio real.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true); // ← obligatorio para enviar cookie de sesión
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            Usuario usuario = usuarioRepository.findByUsernameOnly(username);
            if (usuario == null)
                throw new UsernameNotFoundException("Usuario no encontrado: " + username);
            return User.builder()
                .username(usuario.getUsername())
                .password(usuario.getClave())
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getTipo())))
                .build();
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
