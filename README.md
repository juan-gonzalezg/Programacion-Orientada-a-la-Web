# Banca 360 🏦 - "Confianza Moderna"

Banca 360 nace de la necesidad de fusionar dos mundos exigidos por el usuario actual: la seguridad absoluta de la banca tradicional y la intuitividad y agilidad de las tendencias actuales de diseño. Es un sistema web robusto que transmite una sensación de seguridad absoluta, permitiendo gestionar el capital de manera eficiente.

## 🚀 Demo en Vivo
Puedes ver el proyecto desplegado aquí:  
[https://juan-gonzalezg.github.io/Programacion-Orientada-a-la-Web/](https://juan-gonzalezg.github.io/Programacion-Orientada-a-la-Web/)

## 📋 Características y Funcionalidades
* **Autenticación y Seguridad:** Flujo de registro con validación estricta de contraseñas (mínimo 6 caracteres numéricos coincidentes) y configuración de preguntas de seguridad obligatorias.
* **Feedback de Validación:** Implementación de un indicador de carga ("spinner") de exactamente 2 segundos durante el inicio de sesión para simular la validación profunda de credenciales.
* **Dashboard Privado:** Visualización del saldo actual con funcionalidad crítica de "Ocultar/Mostrar" para proteger la privacidad del cliente en entornos públicos.
* **Gestión Operativa:** Vistas funcionales para realizar transferencias bancarias, ejecutar pagos móviles y simular depósitos de ingresos.
* **Historial Detallado:** Registro exhaustivo de transacciones con filtros rápidos para segmentar por "Solo entradas" (en color verde) y "Solo salidas" (en color rojo), además de una vista detallada para cada movimiento.
* **Tematización:** Soporte completo e integrado para Modo Oscuro y Modo Claro mediante variables.

## 📂 Estructura del Proyecto
El repositorio está organizado de la siguiente manera:
- `/css`: Hojas de estilo del proyecto.
- `/html`: Vistas y secciones específicas del dashboard.
- `/js`: Lógica y controladores de la interfaz.
- `index.html`: Punto de entrada principal (Login).

## 🎨 Arquitectura Visual y UI/UX
El diseño de la plataforma se rige por un manual de identidad visual enfocado en la accesibilidad y la psicología del color:
* **Paleta de Colores:** Uso del *Indigo Tecnológico (#4F46E5)* como primario para inyectar un aire digital y joven, rompiendo la rigidez corporativa. 
* **Fondos Adaptables:** En modo claro se utiliza *Gris Pizarra 50 (#F8FAFC)* para reducir la fatiga visual, mientras que en modo oscuro se usa *Azul Noche Profundo (#0F172A)* para mantener la elegancia y evitar el contraste extremo del negro puro.
* **Tipografía Estratégica:** Uso de la fuente *Inter* por sus "Números Tabulares". Esto evita que los montos financieros se desalineen en las tablas del historial, garantizando la lectura con cero margen de error visual.
* **Geometría y Accesibilidad:** Tarjetas con bordes redondeados (16px) y áreas táctiles (botones) con una altura mínima de 48px, cumpliendo los estándares de accesibilidad para interacciones móviles seguras.
* **Layout Ergonómico:** Diseño basado en el patrón de lectura en "F" y la Ley de Fitts. En pantallas de escritorio utiliza una navegación lateral izquierda, mientras que en dispositivos móviles se adapta a una barra de navegación inferior.

## 🛠️ Tecnologías Utilizadas (Vanilla Stack)
Cumpliendo estrictamente con los requerimientos técnicos del proyecto, esta plataforma fue desarrollada **sin el uso de frameworks, librerías o preprocesadores** (como React, Bootstrap, jQuery o Tailwind).
* **HTML5:** Semántica pura para la estructura de las vistas.
* **CSS3:** Maquetación nativa, variables para los modos de color y diseño responsive.
* **JavaScript Vanilla:** Manejo del DOM, validación de formularios, navegación dinámica y manejo del estado en el lado del cliente.

## 🎓 Contexto Académico
Este proyecto corresponde al **Proyecto #1** desarrollado para la catedra de **Programación Orientada a la Web** en la **Universidad Católica Andrés Bello (UCAB)**.

---
Desarrollado por [David García](https://github.com/djgarcia-24), [Juan Gonzalez](https://github.com/juan-gonzalezg) y [Roberto Ramírez](https://github.com/Ozymandias187-bit) - Mayo 2026.
