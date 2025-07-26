// Este bloque se ejecuta cuando todo el HTML esté cargado
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formLogin"); // Formulario de login

    if (form) {
        // Escuchar envío del formulario solo si estás en la página de login
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const correo = document.getElementById("email").value;
            const contraseña = document.getElementById("password").value;
            const datos = { correo, contraseña };

            try {
                const res = await fetch("http://127.0.0.1:8000/login/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(datos)
                });

                const respuesta = await res.json();

                if (res.ok) {
                    localStorage.setItem("usuario", JSON.stringify(respuesta));

                    // Redirección según el rol
                    if (respuesta.rol === "admin") {
                        window.location.href = "/view/admin.html";
                    } else {
                        window.location.href = "/view/cliente.html";
                    }
                } else {
                    alert(respuesta.detail || "Credenciales incorrectas ❌");
                }
            } catch (error) {
                console.error("Error al conectar con el servidor:", error);
                alert("Error al conectar con el servidor");
            }
        });
    }

    // Validación de sesión (para todas las páginas)
    try {
        const usuario = JSON.parse(localStorage.getItem("usuario"));

        // Si no hay sesión o el rol no es "cliente", se elimina y redirige
        if (!usuario || usuario.rol !== "cliente") {
            localStorage.removeItem("usuario");

            // Solo redirige si no estás ya en la página de login
            if (!window.location.href.includes("iniciarSesion")) {
                window.location.href = "/view/iniciarSesion.html";
            }
            return;
        }

        // Mostrar nombre del usuario si existe
        const nombreSpan = document.getElementById("nombreUsuario");
        if (nombreSpan && usuario.nombre) {
            nombreSpan.innerHTML = `Hola, bienvenido <strong>${usuario.nombre}</strong> 👋`;
        }

        // Configurar botón de cerrar sesión
        const btnCerrar = document.getElementById("cerrarSesion");
        if (btnCerrar) {
            btnCerrar.addEventListener("click", () => {
                localStorage.removeItem("usuario");
                window.location.href = "/view/iniciarSesion.html";
            });
        }
    } catch (err) {
        console.error("Error al validar sesión:", err);
        localStorage.removeItem("usuario");
        window.location.href = "/view/iniciarSesion.html";
    }
});
