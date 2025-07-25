// Este bloque se ejecuta cuando todo el HTML esté cargado
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formLogin"); // Se obtiene el formulario de login

    // Si no estás en la página de login, no hace nada
    if (!form) return;

    // Escuchar el envío del formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Evita que se recargue la página

        // Obtener los valores del correo y contraseña escritos por el usuario
        const correo = document.getElementById("email").value;
        const contraseña = document.getElementById("password").value;

        // Crear un objeto con los datos del usuario
        const datos = { correo, contraseña };

        try {
            // Enviar los datos al backend (FastAPI) para verificar login
            const res = await fetch("http://127.0.0.1:8000/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos) // Convertir los datos a JSON
            });

            const respuesta = await res.json(); // Obtener la respuesta del servidor

            if (res.ok) {
                // Si las credenciales son correctas, guardar al usuario en localStorage
                localStorage.setItem("usuario", JSON.stringify(respuesta));

                // Redirigir al usuario dependiendo de su rol
                if (respuesta.rol === "admin") {
                    window.location.href = "/view/admin.html"; // Página para admin
                } else {
                    window.location.href = "/view/cliente.html"; // Página para cliente
                }

            } else {
                // Si las credenciales están mal, mostrar mensaje de error
                alert(respuesta.detail || "Credenciales incorrectas ❌");
            }

        } catch (error) {
            // Si falla la conexión con el servidor
            console.error(error);
            alert("Error al conectar con el servidor");
        }
    });
});


// Segundo bloque que también se ejecuta cuando cargue el HTML
document.addEventListener("DOMContentLoaded", () => {
    try {
        // Obtener el usuario guardado (si existe)
        const usuario = JSON.parse(localStorage.getItem("usuario"));

        // Validación: si no hay usuario o no tiene rol "cliente", se elimina y redirige
        if (!usuario || usuario.rol !== "cliente") {
            localStorage.removeItem("usuario");

            // Redirige a iniciar sesión solo si no estás ya en esa página
            if (!window.location.href.includes("iniciarSesion")) {
                window.location.href = "/view/iniciarSesion.html";
            }
            return; // Sale del bloque
        }

        // Mostrar el nombre del usuario en pantalla (si existe)
        const nombreSpan = document.getElementById("nombreUsuario");
        if (usuario && usuario.nombre) {
            nombreSpan.innerHTML = `Hola, bienvenido <strong>${usuario.nombre}</strong> 👋`;
        }

        // Configurar botón de cerrar sesión
        const btnCerrar = document.getElementById("cerrarSesion");
        if (btnCerrar) {
            btnCerrar.addEventListener("click", () => {
                localStorage.removeItem("usuario"); // Elimina la sesión
                window.location.href = "/view/iniciarSesion.html"; // Redirige al login
            });
        }

    } catch (err) {
        // Si algo sale mal al procesar el usuario (ej. JSON malformado)
        console.error("Error al validar sesión:", err);
        localStorage.removeItem("usuario");
        window.location.href = "/view/iniciarSesion.html";
    }
});
// Este bloque se ejecuta cuando todo el HTML esté cargado
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formLogin"); // Se obtiene el formulario de login

    // Si no estás en la página de login, no hace nada
    if (!form) return;

    // Escuchar el envío del formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Evita que se recargue la página

        // Obtener los valores del correo y contraseña escritos por el usuario
        const correo = document.getElementById("email").value;
        const contraseña = document.getElementById("password").value;

        // Crear un objeto con los datos del usuario
        const datos = { correo, contraseña };

        try {
            // Enviar los datos al backend (FastAPI) para verificar login
            const res = await fetch("http://127.0.0.1:8000/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos) // Convertir los datos a JSON
            });

            const respuesta = await res.json(); // Obtener la respuesta del servidor

            if (res.ok) {
                // Si las credenciales son correctas, guardar al usuario en localStorage
                localStorage.setItem("usuario", JSON.stringify(respuesta));

                // Redirigir al usuario dependiendo de su rol
                if (respuesta.rol === "admin") {
                    window.location.href = "/view/admin.html"; // Página para admin
                } else {
                    window.location.href = "/view/cliente.html"; // Página para cliente
                }

            } else {
                // Si las credenciales están mal, mostrar mensaje de error
                alert(respuesta.detail || "Credenciales incorrectas ❌");
            }

        } catch (error) {
            // Si falla la conexión con el servidor
            console.error(error);
            alert("Error al conectar con el servidor");
        }
    });
});


// Segundo bloque que también se ejecuta cuando cargue el HTML
document.addEventListener("DOMContentLoaded", () => {
    try {
        // Obtener el usuario guardado (si existe)
        const usuario = JSON.parse(localStorage.getItem("usuario"));

        // Validación: si no hay usuario o no tiene rol "cliente", se elimina y redirige
        if (!usuario || usuario.rol !== "cliente") {
            localStorage.removeItem("usuario");

            // Redirige a iniciar sesión solo si no estás ya en esa página
            if (!window.location.href.includes("iniciarSesion")) {
                window.location.href = "/view/iniciarSesion.html";
            }
            return; // Sale del bloque
        }

        // Mostrar el nombre del usuario en pantalla (si existe)
        const nombreSpan = document.getElementById("nombreUsuario");
        if (usuario && usuario.nombre) {
            nombreSpan.innerHTML = `Hola, bienvenido <strong>${usuario.nombre}</strong> 👋`;
        }

        // Configurar botón de cerrar sesión
        const btnCerrar = document.getElementById("cerrarSesion");
        if (btnCerrar) {
            btnCerrar.addEventListener("click", () => {
                localStorage.removeItem("usuario"); // Elimina la sesión
                window.location.href = "/view/iniciarSesion.html"; // Redirige al login
            });
        }

    } catch (err) {
        // Si algo sale mal al procesar el usuario (ej. JSON malformado)
        console.error("Error al validar sesión:", err);
        localStorage.removeItem("usuario");
        window.location.href = "../view/iniciarSesion.html";
    }
});
