// Este bloque se ejecuta cuando todo el HTML esté cargado
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formLogin");

    // Si no estás en iniciarSesion.html, no hagas nada
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const correo = document.getElementById("email").value;
        const contraseña = document.getElementById("password").value;

        const datos = { correo, contraseña };

        try {
            const res = await fetch("http://127.0.0.1:8000/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            });

            const respuesta = await res.json();

            if (res.ok) {
                // Guardar usuario en localStorage
                localStorage.setItem("usuario", JSON.stringify(respuesta));

                // Redirigir según el rol
                if (respuesta.rol === "admin") {
                    window.location.href = "/view/admin.html";
                } else {
                    window.location.href = "/view/cliente.html";
                }

            } else {
                alert(respuesta.detail || "Credenciales incorrectas ❌");
            }

        } catch (error) {
            console.error(error);
            alert("Error al conectar con el servidor");
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    try {
        const usuario = JSON.parse(localStorage.getItem("usuario"));

        // Validación básica: si no hay usuario o no es cliente
        if (!usuario || usuario.rol !== "cliente") {
            localStorage.removeItem("usuario");
            // Solo redirige si ya no estás en la página de login
            if (!window.location.href.includes("iniciarSesion")) {
                window.location.href = "/view/iniciarSesion.html";
            }
            return;
        }

        // Mostrar nombre del cliente (si lo guardaste en el localStorage)
        const nombreSpan = document.getElementById("nombreUsuario");
        if (usuario && usuario.nombre) {
            nombreSpan.innerHTML = `Hola, bienvenido <strong>${usuario.nombre}</strong> 👋`;
        }



        // Cerrar sesión
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
