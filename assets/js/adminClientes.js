document.addEventListener("DOMContentLoaded", () => {
    const cerrarSesion = document.getElementById("cerrarSesion");
    const spanUsuario = document.getElementById("nombreUsuario");
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    // Validación del usuario
    if (!usuario || usuario.rol !== "admin") {
        alert("Acceso no autorizado 🚫");
        localStorage.removeItem("usuario");
        window.location.href = "/iniciarSesion"; // Ruta servida por FastAPI
        return;
    }

    // Mostrar nombre de usuario
    if (spanUsuario && usuario.nombre) {
        spanUsuario.innerHTML = `Hola, bienvenido <strong>${usuario.nombre}</strong> 👋`;
    }

    // Cerrar sesión
    cerrarSesion?.addEventListener("click", () => {
        localStorage.removeItem("usuario");
        window.location.href = "/iniciarSesion"; // Ruta servida por FastAPI
    });

    const URL = "/admin/clientes/"; // Ruta relativa para que funcione en producción (Render)
    const tabla = document.getElementById("tablaClientes");
    const form = document.getElementById("formularioCliente");

    const clienteId = document.getElementById("clienteId");
    const nombre = document.getElementById("nombre");
    const correo = document.getElementById("correo");
    const telefono = document.getElementById("telefono");
    const formTitulo = document.getElementById("formTitulo");
    const cancelarEdicion = document.getElementById("cancelarEdicion");

    // Cargar clientes
    async function cargarClientes() {
        try {
            const res = await fetch(URL);
            const clientes = await res.json();
            tabla.innerHTML = "";

            clientes.forEach((c) => {
                const fila = `
                    <tr>
                        <td>${c.id}</td>
                        <td>${c.nombre}</td>
                        <td>${c.correo}</td>
                        <td>${c.telefono}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editarCliente(${c.id})">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="eliminarCliente(${c.id})">Eliminar</button>
                        </td>
                    </tr>
                `;
                tabla.innerHTML += fila;
            });
        } catch (error) {
            console.error("Error al cargar clientes:", error);
        }
    }

    // Editar cliente
    window.editarCliente = async (id) => {
        try {
            const res = await fetch(URL + id);
            const cliente = await res.json();

            clienteId.value = cliente.id;
            nombre.value = cliente.nombre;
            correo.value = cliente.correo;
            telefono.value = cliente.telefono;

            formTitulo.textContent = "Editar cliente";
            cancelarEdicion.classList.remove("d-none");
        } catch (error) {
            console.error("Error al obtener cliente:", error);
        }
    };

    // Eliminar cliente
    window.eliminarCliente = async (id) => {
        if (!confirm("¿Estás seguro de eliminar este cliente?")) return;

        try {
            const res = await fetch(URL + id, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Error al eliminar cliente");

            cargarClientes();
        } catch (error) {
            console.error("Error al eliminar cliente:", error);
        }
    };

    // Guardar cliente (crear o actualizar)
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const datos = {
            nombre: nombre.value,
            correo: correo.value,
            telefono: telefono.value,
        };

        try {
            let res;
            if (clienteId.value) {
                res = await fetch(URL + clienteId.value, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(datos),
                });
            } else {
                res = await fetch(URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(datos),
                });
            }

            if (!res.ok) throw new Error("Error al guardar cliente");

            form.reset();
            clienteId.value = "";
            formTitulo.textContent = "Crear nuevo cliente";
            cancelarEdicion.classList.add("d-none");
            cargarClientes();
        } catch (error) {
            console.error("Error al guardar cliente:", error);
        }
    });

    // Cancelar edición
    cancelarEdicion.addEventListener("click", () => {
        form.reset();
        clienteId.value = "";
        formTitulo.textContent = "Crear nuevo cliente";
        cancelarEdicion.classList.add("d-none");
    });

    // Cargar clientes al iniciar
    cargarClientes();
});
