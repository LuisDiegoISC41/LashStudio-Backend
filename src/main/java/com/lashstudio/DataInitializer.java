package com.lashstudio;

import com.lashstudio.entity.Admin;
import com.lashstudio.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository   adminRepository;
    private final PasswordEncoder   passwordEncoder;

    @Override
    public void run(String... args) {
        try {
            for (Admin admin : adminRepository.findAll()) {
                String pwd = admin.getPassword();
                if (pwd != null && !pwd.startsWith("$2")) {
                    admin.setPassword(passwordEncoder.encode(pwd));
                    adminRepository.save(admin);
                    System.out.println("[DataInitializer] Contraseña re-encriptada para admin: " + admin.getCorreo());
                }
            }
        } catch (Exception e) {
            System.err.println("[DataInitializer] No se pudo re-encriptar contraseñas: " + e.getMessage());
            System.err.println("[DataInitializer] Ejecuta en Supabase: ALTER TABLE \"Admin\" ALTER COLUMN \"Password\" TYPE varchar(100);");
        }
    }
}
