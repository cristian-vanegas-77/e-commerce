document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    if (!form) return; // Si no hay formulario, no hace nada

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value;
        const telefono = document.getElementById("telefono").value;
        const correo = document.getElementById("email").value;
        const contraseña = document.getElementById("password").value;

        const datos = {
            nombre,
            telefono,
            correo,
            contraseña
        };

        try {
            const res = await fetch("http://127.0.0.1:8000/registro/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            });

            const respuesta = await res.json();

            if (res.ok) {
                alert("Registro exitoso ✅");
                form.reset();
                window.location.href = "/view/iniciarSesion.html";
            } else {
                alert(respuesta.detail || "Error al registrar");
            }

        } catch (error) {
            alert("Error de conexión con el servidor");
            console.error(error);
        }
    });
});


