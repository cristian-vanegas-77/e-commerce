# 🛍️ E-commerce FastAPI

Proyecto de e-commerce desarrollado con **FastAPI**, **HTML/CSS/JS**, y **SQLite**.  
Incluye un panel de administrador, gestión de productos/clientes y login de usuarios.

## 🚀 Tecnologías usadas

- FastAPI
- Jinja2 (para HTML dinámico)
- SQLite (base de datos)
- HTML, CSS, JavaScript (frontend)
- Render (para despliegue gratuito)

---

## 📁 Estructura del proyecto

e-commerce/
│
├── backend/ # Código backend FastAPI
│ ├── main.py
│ ├── crud.py
│ ├── database.py
│ └── schemas.py
│
├── view/ # Páginas HTML
│ ├── index.html
│ └── productos.html, etc.
│
├── assets/ # Estilos, scripts e imágenes
│ ├── css/
│ ├── js/
│ └── img/
│
├── requirements.txt # Dependencias para Render
├── start.sh # Script de arranque para Render
└── README.md # Este archivo