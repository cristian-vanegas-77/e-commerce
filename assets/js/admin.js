document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    // Si no hay usuario o no es admin, redirige
    if (!usuario || usuario.rol !== "admin") {
        localStorage.removeItem("usuario");
        window.location.href = "/view/iniciarSesion.html";
        return;
    }

    // Botón cerrar sesión
    const btnCerrar = document.getElementById("cerrarSesion");
    if (btnCerrar) {
        btnCerrar.addEventListener("click", () => {
            localStorage.removeItem("usuario");
            window.location.href = "../view/iniciarSesion.html";
        });
    }
});
