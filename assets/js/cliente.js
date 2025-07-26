document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formLogin");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const correo = document.getElementById("email").value;
            const contrasena = document.getElementById("password").value;
            const datos = { correo, contrasena };

            try {
                const res = await fetch(`${window.location.origin}/login/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(datos)
                });

                const respuesta = await res.json();

                if (res.ok) {
                    localStorage.setItem("usuario", JSON.stringify(respuesta));

                    if (respuesta.rol === "admin") {
                        window.location.href = "/admin";
                    } else {
                        window.location.href = "/cliente";
                    }
                } else {
                    alert(respuesta.detail || "Credenciales incorrectas ❌");
                }
            } catch (error) {
                console.error("Error al conectar con el servidor:", error);
                alert("No se pudo conectar al servidor. Intenta más tarde.");
            }
        });
    }

    // Validación de sesión
    try {
        const usuario = JSON.parse(localStorage.getItem("usuario"));

        if (!usuario || usuario.rol !== "cliente") {
            localStorage.removeItem("usuario");

            if (!window.location.pathname.includes("iniciarSesion")) {
                window.location.href = "/iniciarSesion";
            }
            return;
        }

        const nombreSpan = document.getElementById("nombreUsuario");
        if (nombreSpan && usuario.nombre) {
            nombreSpan.innerHTML = `Hola, bienvenido <strong>${usuario.nombre}</strong> 👋`;
        }

        const btnCerrar = document.getElementById("cerrarSesion");
        if (btnCerrar) {
            btnCerrar.addEventListener("click", () => {
                localStorage.removeItem("usuario");
                window.location.href = "/iniciarSesion";
            });
        }
    } catch (err) {
        console.error("Error al validar sesión:", err);
        localStorage.removeItem("usuario");
        window.location.href = "/iniciarSesion";
    }
});
