// Espera a que el HTML esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {
    // Trae los datos del usuario que están guardados en el navegador (localStorage)
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    // Si no hay usuario guardado o si no es admin, lo saca y lo manda al login
    if (!usuario || usuario.rol !== "admin") {
        localStorage.removeItem("usuario"); // borra la sesión
        window.location.href = "../view/iniciarSesion.html"; // redirige al inicio de sesión
        return;
    }

    // Muestra el nombre del cliente en la parte superior si está guardado
    const nombreSpan = document.getElementById("nombreUsuario");
    if (usuario && usuario.nombre) {
        nombreSpan.innerHTML = `Hola, bienvenido <strong>${usuario.nombre}</strong> 👋`;
    }

    // Funcionalidad del botón "Cerrar sesión"
    const btnCerrar = document.getElementById("cerrarSesion");
    if (btnCerrar) {
        btnCerrar.addEventListener("click", () => {
            localStorage.removeItem("usuario"); // borra los datos del usuario
            window.location.href = "../view/iniciarSesion.html"; // lo manda al login
        });
    }
});
