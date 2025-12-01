package com.hikari.pasteleria.controller;

import com.hikari.pasteleria.model.Producto;
import com.hikari.pasteleria.service.ProductoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @PostMapping("/guardar")
    public Producto guardar(@RequestBody Producto producto) {
        return productoService.guardar(producto);
    }

    @GetMapping("/listar")
    public List<Producto> listar() {
        return productoService.listar();
    }

    @GetMapping("/{id}")
    public Producto obtenerPorId(@PathVariable Long id) {
        return productoService.obtenerPorId(id);
    }

    @GetMapping("/categoria/{cat}")
    public List<Producto> listarPorCategoria(@PathVariable String cat) {
        return productoService.listarPorCategoria(cat);
    }
}
