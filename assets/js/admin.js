document.addEventListener("DOMContentLoaded", () => {
    // Carga datos del usuario desde el localStorage
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    // Si no hay sesión válida o no es admin
    if (!usuario || usuario.rol !== "admin") {
        localStorage.removeItem("usuario");
        window.location.href = "/iniciarSesion"; // Usando ruta FastAPI
        return;
    }

    // Mostrar nombre del usuario en la interfaz
    const nombreSpan = document.getElementById("nombreUsuario");
    if (nombreSpan && usuario.nombre) {
        nombreSpan.innerHTML = `Hola, bienvenido <strong>${usuario.nombre}</strong> 👋`;
    }

    // Cerrar sesión
    const btnCerrar = document.getElementById("cerrarSesion");
    if (btnCerrar) {
        btnCerrar.addEventListener("click", () => {
            localStorage.removeItem("usuario");
            window.location.href = "/iniciarSesion"; // Usando ruta FastAPI
        });
    }
});
