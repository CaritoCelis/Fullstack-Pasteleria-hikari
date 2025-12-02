package com.hikari.pasteleria.controller;

import com.hikari.pasteleria.models.Producto;
import com.hikari.pasteleria.service.ProductoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {
    private final ProductoService productoService;
    public ProductoController(ProductoService productoService){ this.productoService = productoService; }

    @GetMapping
    public ResponseEntity<List<Producto>> findAll(){ return ResponseEntity.ok(productoService.findAll()); }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id){
        return productoService.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Producto> create(@RequestBody Producto p){ return ResponseEntity.ok(productoService.save(p)); }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Producto p){
        return productoService.findById(id).map(prod -> {
            prod.setName(p.getName()); prod.setDescription(p.getDescription()); prod.setPrice(p.getPrice());
            prod.setStock(p.getStock()); prod.setImageUrl(p.getImageUrl());
            return ResponseEntity.ok(productoService.save(prod));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id){ productoService.delete(id); return ResponseEntity.ok().build(); }
}
