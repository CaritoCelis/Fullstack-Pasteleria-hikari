package com.hikari.pasteleria.dto;
import java.util.List;
public class OrderRequest {
    public static class Item { public Long productId; public Integer quantity; }
    public List<Item> items;
    public String direccion;
    public String comuna;
    public String ciudad;
    // getters & setters si usas POJO; record no funciona bien con jackson si anidados
}
