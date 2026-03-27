package com.lashstudio;

import com.lashstudio.entity.Admin;
import com.lashstudio.repository.AdminRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final AdminRepository   adminRepository;
    private final PasswordEncoder   passwordEncoder;
    
    private boolean initialized = false;

    @PostConstruct
    public void init() {
        // Evitar ejecución múltiple
        if (initialized) {
            return;
        }
        
        try {
            log.info("🚀 Iniciando DataInitializer...");
            
            // Pequeña pausa para asegurar que la DB está lista
            Thread.sleep(2000);
            
            // Verificar si hay admins
            long adminCount = adminRepository.count();
            log.info("📊 Total de admins encontrados: {}", adminCount);
            
            for (Admin admin : adminRepository.findAll()) {
                String pwd = admin.getPassword();
                if (pwd != null && !pwd.startsWith("$2")) {
                    admin.setPassword(passwordEncoder.encode(pwd));
                    adminRepository.save(admin);
                    log.info("✅ Contraseña re-encriptada para admin: {}", admin.getCorreo());
                }
            }
            
            initialized = true;
            log.info("✅ DataInitializer completado exitosamente");
            
        } catch (Exception e) {
            // NO lanzar la excepción, solo loguear
            log.error("❌ Error en DataInitializer: {}", e.getMessage());
            log.error("Si es error de columna, ejecuta en Supabase: ALTER TABLE \"Admin\" ALTER COLUMN \"Password\" TYPE varchar(100);");
            // La aplicación continuará ejecutándose
        }
    }
}