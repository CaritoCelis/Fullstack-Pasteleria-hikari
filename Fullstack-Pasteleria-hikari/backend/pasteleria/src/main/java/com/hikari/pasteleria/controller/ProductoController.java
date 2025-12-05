package com.hikari.pasteleria.controller;

import com.hikari.pasteleria.models.Producto;
import com.hikari.pasteleria.repository.ProductoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductoController {

    private final ProductoRepository productoRepo;

    public ProductoController(ProductoRepository productoRepo) {
        this.productoRepo = productoRepo;
    }

    @GetMapping
    public List<Producto> listar() {
        return productoRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerPorId(@PathVariable Long id) {
        return productoRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Producto> crear(@RequestBody Producto producto) {
        Producto guardado = productoRepo.save(producto);
        return ResponseEntity.ok(guardado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizar(@PathVariable Long id, @RequestBody Producto producto) {
        return productoRepo.findById(id)
                .map(p -> {
                    p.setName(producto.getName());
                    p.setDescription(producto.getDescription());
                    p.setPrice(producto.getPrice());
                    p.setImageUrl(producto.getImageUrl());
                    if (producto.getStock() != null) {
                        p.setStock(producto.getStock());
                    }
                    return ResponseEntity.ok(productoRepo.save(p));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        return productoRepo.findById(id)
                .map(p -> {
                    productoRepo.delete(p);
                    return ResponseEntity.ok(Map.of("message", "Producto eliminado"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/seed")
    public ResponseEntity<?> seedProducts() {
        try {
            if (productoRepo.count() > 0) {
                return ResponseEntity.ok(Map.of("message", "Ya hay " + productoRepo.count() + " productos en la BD"));
            }

            // Crear productos según tu archivo productos.js
            String[][] productos = {
                {"1", "Torta Cuadrada de Chocolate", "45000", "Una deliciosa torta cuadrada elaborada con chocolate premium y decorada con un suave acabado brillante.", "/img/50_4.jpg"},
                {"2", "Torta Circular de Vainilla", "40000", "Torta esponjosa de vainilla con un sabor delicado y decoración tradicional.", "/img/circular_vainilla_2.jpeg"},
                {"3", "Torta Cumpleaños", "55000", "Torta especial para celebraciones, con diseño festivo y sabores suaves que gustan a todos.", "/img/cumple_2.jpg"},
                {"4", "Galletas Veganas de Avena", "4500", "Crujientes galletas veganas hechas con avena natural, ligeras y nutritivas.", "/img/galletas_vegana_avena_2.jpeg"},
                {"5", "Cheesecake sin Azúcar", "47000", "Cheesecake cremoso y suave, preparado sin azúcar y con un equilibrio perfecto de sabor.", "/img/cheesecake_2.jpeg"},
                {"6", "Torta Dulce Tentación", "50000", "Torta llena de sabor con una combinación irresistible de cremas y decoraciones elegantes.", "/img/cumple_6.jpg"},
                {"7", "Torta de Boda", "135000", "Elegante torta de boda con diseño clásico y un delicado sabor ideal para grandes celebraciones.", "/img/boda_8.jpg"},
                {"8", "Tiramisú Clásico", "5500", "Postre italiano tradicional con capas de crema suave y toques de café.", "/img/tiramisu_1.jpeg"},
                {"9", "Torta Infantil de Dos Pisos", "46000", "Torta colorida y temática, ideal para celebraciones infantiles, con dos pisos decorados.", "/img/cumple_21.jpeg"},
                {"10", "Torta Rosa y Crema", "55000", "Hermosa torta decorada en tonos rosados con detalles en crema, perfecta para ocasiones especiales.", "/img/cumple_28.jpg"}
            };

            for (String[] p : productos) {
                Producto producto = new Producto();
                producto.setName(p[1]);
                producto.setPrice(new BigDecimal(p[2]));
                producto.setDescription(p[3]);
                producto.setImageUrl(p[4]);
                producto.setStock(100);
                productoRepo.save(producto);
            }

            return ResponseEntity.ok(Map.of(
                "message", "✅ Productos creados exitosamente",
                "count", productos.length
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}