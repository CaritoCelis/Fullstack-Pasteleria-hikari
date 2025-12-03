package com.hikari.pasteleria.dto;

public record RegisterRequest(
    String username,
    String email, 
    String password,
    String nombre,          
    String apellido,       
    String fechaNacimiento   
) {}