package com.lashstudio.security;

import com.lashstudio.repository.AdminRepository;
import com.lashstudio.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final AdminRepository   adminRepository;
    private final ClienteRepository clienteRepository;

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {

        // Primero busca en admins
        return adminRepository.findByCorreo(correo)
                .map(admin -> (UserDetails) User.builder()
                        .username(admin.getCorreo())
                        .password(admin.getPassword())
                        .authorities(List.of(new SimpleGrantedAuthority("ROLE_ADMIN")))
                        .build())
                .orElseGet(() ->
                    // Si no es admin, busca en clientes
                    clienteRepository.findByCorreo(correo)
                            .map(cliente -> (UserDetails) User.builder()
                                    .username(cliente.getCorreo())
                                    .password(cliente.getPassword())
                                    .authorities(List.of(new SimpleGrantedAuthority("ROLE_CLIENTE")))
                                    .build())
                            .orElseThrow(() ->
                                new UsernameNotFoundException("Usuario no encontrado: " + correo)
                            )
                );
    }
}
