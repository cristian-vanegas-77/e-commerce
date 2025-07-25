// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    // Seleccionar el formulario de registro (el primero que encuentre en la página)
    const form = document.querySelector("form");

    // Si no hay formulario en la página, salir
    if (!form) return;

    // Escuchar el evento de envío del formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevenir que la página se recargue al enviar

        // Obtener los valores ingresados por el usuario
        const nombre = document.getElementById("nombre").value;
        const telefono = document.getElementById("telefono").value;
        const correo = document.getElementById("email").value;
        const contraseña = document.getElementById("password").value;

        // Crear un objeto con esos datos
        const datos = {
            nombre,
            telefono,
            correo,
            contraseña
        };

        try {
            // Enviar los datos al backend (FastAPI) usando método POST
            const res = await fetch("http://127.0.0.1:8000/registro/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos) // Convertir a JSON
            });

            const respuesta = await res.json(); // Convertir la respuesta a objeto

            if (res.ok) {
                // Si todo salió bien
                alert("Registro exitoso ✅");
                form.reset(); // Limpiar los campos del formulario
                window.location.href = "/view/iniciarSesion.html"; // Redirigir al login
            } else {
                // Si hubo algún error de validación o backend
                alert(respuesta.detail || "Error al registrar");
            }

        } catch (error) {
            // Si falla la conexión con el backend
            alert("Error de conexión con el servidor");
            console.error(error);
        }
    });
});
