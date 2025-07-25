document.addEventListener("DOMContentLoaded", () => {
    // Referencia al botón de cerrar sesión
    const cerrarSesion = document.getElementById("cerrarSesion");
    // Referencia al span donde se mostrará el nombre del usuario
    const spanUsuario = document.getElementById("nombreUsuario");
    // Se obtiene el usuario desde el localStorage y se convierte a objeto
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    // Si no hay usuario o el rol no es "admin", se muestra alerta y redirige
    if (!usuario || usuario.rol !== "admin") {
        alert("Acceso no autorizado 🚫");
        window.location.href = "../index.html";
    }

    // Muestra el nombre del cliente si está disponible
    const nombreSpan = document.getElementById("nombreUsuario");
    if (usuario && usuario.nombre) {
        nombreSpan.innerHTML = `Hola, bienvenido <strong>${usuario.nombre}</strong> 👋`;
    }

    // Evento para cerrar sesión (elimina el usuario del localStorage)
    cerrarSesion.addEventListener("click", () => {
        localStorage.removeItem("usuario");
        location.href = "../view/iniciarSesion.html";
    });

    // URL base de la API para clientes
    const URL = "http://127.0.0.1:8000/admin/clientes/";
    // Elemento donde se mostrará la tabla de clientes
    const tabla = document.getElementById("tablaClientes");
    // Referencia al formulario de cliente
    const form = document.getElementById("formularioCliente");

    // Campos del formulario
    const clienteId = document.getElementById("clienteId");
    const nombre = document.getElementById("nombre");
    const correo = document.getElementById("correo");
    const telefono = document.getElementById("telefono");
    const formTitulo = document.getElementById("formTitulo");
    const cancelarEdicion = document.getElementById("cancelarEdicion");

    // Función para cargar los clientes desde la API
    async function cargarClientes() {
        try {
            const res = await fetch(URL); // hace la petición
            const clientes = await res.json(); // convierte la respuesta en JSON

            tabla.innerHTML = ""; // limpia la tabla antes de mostrar nuevos datos

            // Por cada cliente, se crea una fila con su info y botones
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
                tabla.innerHTML += fila; // añade la fila a la tabla
            });
        } catch (error) {
            console.error("Error al cargar clientes:", error); // muestra error en consola
        }
    }

    // Función para editar un cliente
    window.editarCliente = async (id) => {
        try {
            const res = await fetch(URL + id); // obtiene el cliente por ID
            const cliente = await res.json(); // convierte a objeto

            // Llena los campos del formulario con la info del cliente
            clienteId.value = cliente.id;
            nombre.value = cliente.nombre;
            correo.value = cliente.correo;
            telefono.value = cliente.telefono;

            formTitulo.textContent = "Editar cliente"; // cambia el título del formulario
            cancelarEdicion.classList.remove("d-none"); // muestra el botón de cancelar
        } catch (error) {
            console.error("Error al obtener cliente:", error);
        }
    };

    // Función para eliminar un cliente
    window.eliminarCliente = async (id) => {
        if (!confirm("¿Estás seguro de eliminar este cliente?")) return; // confirma con el usuario

        try {
            const res = await fetch(URL + id, {
                method: "DELETE", // método DELETE
            });

            if (!res.ok) throw new Error("Error al eliminar cliente");

            cargarClientes(); // recarga la tabla actualizada
        } catch (error) {
            console.error("Error al eliminar cliente:", error);
        }
    };

    // Evento para cuando se envía el formulario (crear o actualizar cliente)
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // evita que se recargue la página

        // Datos del formulario en formato objeto
        const datos = {
            nombre: nombre.value,
            correo: correo.value,
            telefono: telefono.value,
        };

        try {
            let res;
            if (clienteId.value) {
                // Si hay ID, se actualiza cliente existente (PUT)
                res = await fetch(URL + clienteId.value, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(datos),
                });
            } else {
                // Si no hay ID, se crea nuevo cliente (POST)
                res = await fetch(URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(datos),
                });
            }

            if (!res.ok) throw new Error("Error al guardar cliente");

            // Resetea formulario y vuelve al modo de creación
            form.reset();
            clienteId.value = "";
            formTitulo.textContent = "Crear nuevo cliente";
            cancelarEdicion.classList.add("d-none");
            cargarClientes(); // recarga la tabla actualizada
        } catch (error) {
            console.error("Error al guardar cliente:", error);
        }
    });

    // Evento para cancelar la edición y volver a modo creación
    cancelarEdicion.addEventListener("click", () => {
        form.reset(); // limpia los campos
        clienteId.value = "";
        formTitulo.textContent = "Crear nuevo cliente";
        cancelarEdicion.classList.add("d-none"); // oculta el botón de cancelar
    });

    // Carga los clientes apenas se abra la página
    cargarClientes();
});
