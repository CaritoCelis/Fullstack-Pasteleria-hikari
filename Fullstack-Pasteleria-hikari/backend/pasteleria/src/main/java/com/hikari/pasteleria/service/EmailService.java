package com.hikari.pasteleria.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import java.math.BigDecimal;
@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarCorreoContacto(String destinatario, String nombre) throws MessagingException {
    MimeMessage message = mailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

    helper.setFrom(fromEmail);
    helper.setTo(destinatario);
    helper.setSubject("✅ Mensaje Recibido - Pastelería Hikari");

    String contenidoHtml = String.format("""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, %s 0%%, %s 100%%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0;">🍰 Pastelería Hikari</h1>
            </div>
            <div style="background: %s; padding: 30px; border-radius: 0 0 10px 10px;">
                <h2 style="color: %s;">¡Hola %s! 👋</h2>
                <p style="color: %s; font-size: 16px; line-height: 1.6;">
                    Hemos recibido tu mensaje correctamente. Nuestro equipo lo revisará 
                    y te responderemos lo antes posible.
                </p>
                <div style="background: white; padding: 20px; border-left: 4px solid %s; margin: 20px 0;">
                    <p style="color: %s; margin: 0;">
                        <strong>Tiempo estimado de respuesta:</strong> 24-48 horas
                    </p>
                </div>
                <p style="color: %s;">
                    Gracias por contactarnos. 💜
                </p>
                <hr style="border: none; border-top: 1px solid %s; margin: 20px 0;">
                <p style="color: %s; font-size: 12px; text-align: center;">
                    Este es un correo automático, por favor no respondas a este mensaje.
                </p>
            </div>
        </div>
    """, "#667eea", "#764ba2", "#f9f9f9", "#333", nombre, "#666", "#667eea", "#888", "#666", "#ddd", "#999");

    helper.setText(contenidoHtml, true);
    mailSender.send(message);
    }

    public void enviarCorreoPedidoConfirmado(String destinatario, String nombreCliente, Long pedidoId, BigDecimal total) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(destinatario);
        helper.setSubject("✅ Pedido Confirmado #" + pedidoId);

        String contenidoHtml = """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #4CAF50; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0;">✅ Pedido Confirmado</h1>
                </div>
                <div style="background: #f9f9f9; padding: 30px;">
                    <h2 style="color: #333;">¡Hola %s! 🎉</h2>
                    <p style="color: #666; font-size: 16px;">
                        Tu pedido <strong>#%d</strong> ha sido confirmado y procesado exitosamente.
                    </p>
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="color: #888; margin: 5px 0;">
                            <strong>Total pagado:</strong> $%.2f USD
                        </p>
                        <p style="color: #888; margin: 5px 0;">
                            <strong>Estado:</strong> En preparación 🍰
                        </p>
                    </div>
                    <p style="color: #666;">
                        Te notificaremos cuando tu pedido esté listo para entrega.
                    </p>
                </div>
            </div>
        """.formatted(nombreCliente, pedidoId, total);

        helper.setText(contenidoHtml, true);
        mailSender.send(message);
    }
}