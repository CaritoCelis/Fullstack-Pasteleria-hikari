package com.hikari.pasteleria.service;

import com.paypal.core.PayPalHttpClient;
import com.paypal.http.HttpResponse;
import com.paypal.orders.*;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class PaypalService {

    private final PayPalHttpClient payPalHttpClient;

    public PaypalService(PayPalHttpClient payPalHttpClient) {
        this.payPalHttpClient = payPalHttpClient;
    }

    public Order crearOrden(BigDecimal monto, String moneda, Long pedidoId) throws IOException {
        OrderRequest orderRequest = new OrderRequest();
        orderRequest.checkoutPaymentIntent("CAPTURE");

        AmountWithBreakdown amountBreakdown = new AmountWithBreakdown()
                .currencyCode(moneda)
                .value(monto.toString());

        PurchaseUnitRequest purchaseUnitRequest = new PurchaseUnitRequest()
                .amountWithBreakdown(amountBreakdown)
                .referenceId(pedidoId.toString())
                .description("Pedido #" + pedidoId + " - Pastelería Hikari");

        List<PurchaseUnitRequest> purchaseUnits = new ArrayList<>();
        purchaseUnits.add(purchaseUnitRequest);
        orderRequest.purchaseUnits(purchaseUnits);

        ApplicationContext applicationContext = new ApplicationContext()
                .returnUrl("http://localhost:3000/pago-exitoso")
                .cancelUrl("http://localhost:3000/pago-cancelado")
                .brandName("Pastelería Hikari")
                .landingPage("BILLING");

        orderRequest.applicationContext(applicationContext);

        OrdersCreateRequest request = new OrdersCreateRequest();
        request.requestBody(orderRequest);

        HttpResponse<Order> response = payPalHttpClient.execute(request);
        return response.result();
    }

    public Order capturarOrden(String orderId) throws IOException {
        OrdersCaptureRequest request = new OrdersCaptureRequest(orderId);
        HttpResponse<Order> response = payPalHttpClient.execute(request);
        return response.result();
    }

    public Order obtenerDetallesOrden(String orderId) throws IOException {
        OrdersGetRequest request = new OrdersGetRequest(orderId);
        HttpResponse<Order> response = payPalHttpClient.execute(request);
        return response.result();
    }
}