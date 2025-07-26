// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;
    const correo = document.getElementById("email").value;
    const contraseña = document.getElementById("password").value;

    const datos = { nombre, telefono, correo, contraseña };

    try {
      const res = await fetch(`${window.location.origin}/registro/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const respuesta = await res.json();

      if (res.ok) {
        alert("Registro exitoso ✅");
        form.reset();
        window.location.href = "/view/iniciarSesion.html"; // Asegúrate que esta sea la ruta correcta
      } else {
        alert(respuesta.detail || "Error al registrar");
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
      console.error("Error en el registro:", error);
    }
  });
});
