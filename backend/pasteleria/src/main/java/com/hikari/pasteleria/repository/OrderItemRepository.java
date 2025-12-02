package com.hikari.pasteleria.repository;

import com.hikari.pasteleria.models.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> { }
