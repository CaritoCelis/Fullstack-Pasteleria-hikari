package com.hikari.pasteleria.service;

import com.hikari.pasteleria.models.*;
import com.hikari.pasteleria.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;


@Service
public class PedidoService {
    private final ProductoRepository productoRepo;
    private final PedidoRepository pedidoRepo;
    private final OrderItemRepository itemRepo;
    private final InventarioRepository inventarioRepo;

    public PedidoService(ProductoRepository pr, PedidoRepository pd, OrderItemRepository ir, InventarioRepository inv) {
        this.productoRepo = pr;
        this.pedidoRepo = pd;
        this.itemRepo = ir;
        this.inventarioRepo = inv;
    }

    @Transactional
    public Pedido createPedido(Usuario usuario, List<OrderItem> items){
        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setStatus("PENDING");
        List<OrderItem> savedItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for(OrderItem it : items){
            Producto p = productoRepo.findById(it.getProducto().getId()).orElseThrow();

            if(p.getStock() < it.getQuantity())
                throw new RuntimeException("Stock insuficiente: " + p.getName());

            p.setStock(p.getStock() - it.getQuantity());
            productoRepo.save(p);

            Inventario inv = new Inventario();
            inv.setProducto(p);
            inv.setCantidad(it.getQuantity());
            inv.setTipo("OUT");
            inventarioRepo.save(inv);

            it.setPrice(p.getPrice());
            it.setPedido(pedido);
            savedItems.add(it);

            total = total.add(p.getPrice().multiply(BigDecimal.valueOf(it.getQuantity())));
        }

        pedido.setItems(savedItems);
        pedido.setTotal(total);
        pedidoRepo.save(pedido);
        itemRepo.saveAll(savedItems);

        return pedido;
    }

    // 🔥 MÉTODO NUEVO
    public List<Pedido> findPedidosByUsuario(String usuarioId) {
        return pedidoRepo.findByUsuarioId(usuarioId);
    }
}
