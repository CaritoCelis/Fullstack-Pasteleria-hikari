package com.hikari.pasteleria.repository;

import com.hikari.pasteleria.models.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByPaypalOrderId(String paypalOrderId);
}