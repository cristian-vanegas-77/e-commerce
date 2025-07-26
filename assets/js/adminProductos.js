document.addEventListener("DOMContentLoaded", () => {
  const cerrarSesion = document.getElementById("cerrarSesion");
  const spanUsuario = document.getElementById("nombreUsuario");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // Validación de usuario admin
  if (!usuario || usuario.rol !== "admin") {
    alert("Acceso no autorizado 🚫");
    localStorage.removeItem("usuario");
    window.location.href = "/iniciarSesion"; // ruta de FastAPI
    return;
  }

  // Mostrar nombre del usuario
  if (spanUsuario && usuario.nombre) {
    spanUsuario.innerHTML = `Hola, bienvenido <strong>${usuario.nombre}</strong> 👋`;
  }

  // Cerrar sesión
  cerrarSesion?.addEventListener("click", () => {
    localStorage.removeItem("usuario");
    window.location.href = "/iniciarSesion"; // ruta de FastAPI
  });

  const URL = "/admin/productos/"; // ✅ Ruta relativa compatible con Render
  const tabla = document.getElementById("tablaProductos");
  const form = document.getElementById("formularioProducto");

  const productoId = document.getElementById("productoId");
  const nombre = document.getElementById("nombre");
  const descripcion = document.getElementById("descripcion");
  const precio = document.getElementById("precio");
  const stock = document.getElementById("stock");
  const formTitulo = document.getElementById("formTitulo");
  const cancelarEdicion = document.getElementById("cancelarEdicion");

  // Cargar productos
  async function cargarProductos() {
    try {
      const res = await fetch(URL);
      const productos = await res.json();
      tabla.innerHTML = "";

      productos.forEach((p) => {
        const fila = `
          <tr>
            <td>${p.id}</td>
            <td>${p.nombre}</td>
            <td>${p.descripcion}</td>
            <td>$${p.precio}</td>
            <td>${p.stock}</td>
            <td>
              <button class="btn btn-warning btn-sm" onclick="editarProducto(${p.id})">Editar</button>
              <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${p.id})">Eliminar</button>
            </td>
          </tr>
        `;
        tabla.innerHTML += fila;
      });
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  }

  // Editar producto
  window.editarProducto = async (id) => {
    try {
      const res = await fetch(URL + id);
      const producto = await res.json();

      productoId.value = producto.id;
      nombre.value = producto.nombre;
      descripcion.value = producto.descripcion;
      precio.value = producto.precio;
      stock.value = producto.stock;

      formTitulo.textContent = "Editar producto";
      cancelarEdicion.classList.remove("d-none");
    } catch (error) {
      console.error("Error al obtener producto:", error);
    }
  };

  // Eliminar producto
  window.eliminarProducto = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      const res = await fetch(URL + id, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar producto");

      cargarProductos();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  // Crear o actualizar producto
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const datos = {
      nombre: nombre.value,
      descripcion: descripcion.value,
      precio: parseFloat(precio.value),
      stock: parseInt(stock.value),
    };

    try {
      let res;
      if (productoId.value) {
        res = await fetch(URL + productoId.value, {
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

      if (!res.ok) throw new Error("Error al guardar producto");

      form.reset();
      productoId.value = "";
      formTitulo.textContent = "Crear nuevo producto";
      cancelarEdicion.classList.add("d-none");
      cargarProductos();
    } catch (error) {
      console.error("Error al guardar producto:", error);
    }
  });

  // Cancelar edición
  cancelarEdicion.addEventListener("click", () => {
    form.reset();
    productoId.value = "";
    formTitulo.textContent = "Crear nuevo producto";
    cancelarEdicion.classList.add("d-none");
  });

  cargarProductos();
});
