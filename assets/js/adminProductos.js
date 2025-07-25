document.addEventListener("DOMContentLoaded", () => {
  // Referencia al botón de cerrar sesión
  const cerrarSesion = document.getElementById("cerrarSesion");
  // Referencia al span donde se mostrará el nombre del usuario
  const spanUsuario = document.getElementById("nombreUsuario");
  // Obtener el usuario guardado en el localStorage y convertirlo a objeto
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // Si no hay usuario o no es admin, se muestra alerta y se redirige al inicio
  if (!usuario || usuario.rol !== "admin") {
    alert("Acceso no autorizado 🚫");
    window.location.href = "../index.html";
  }

  // Mostrar nombre del usuario en la interfaz
  const nombreSpan = document.getElementById("nombreUsuario");
  if (usuario && usuario.nombre) {
    nombreSpan.innerHTML = `Hola, bienvenido <strong>${usuario.nombre}</strong> 👋`;
  }

  // Al hacer clic en "Cerrar sesión", se borra el usuario del localStorage y redirige al inicio
  cerrarSesion.addEventListener("click", () => {
    localStorage.removeItem("usuario");
    location.href = "../view/iniciarSesion.html";
  });

  // URL base de la API para productos
  const URL = "http://127.0.0.1:8000/admin/productos/";
  // Referencia a la tabla donde se mostrarán los productos
  const tabla = document.getElementById("tablaProductos");
  // Referencia al formulario de productos
  const form = document.getElementById("formularioProducto");

  // Referencias a los campos del formulario
  const productoId = document.getElementById("productoId");
  const nombre = document.getElementById("nombre");
  const descripcion = document.getElementById("descripcion");
  const precio = document.getElementById("precio");
  const stock = document.getElementById("stock");
  const formTitulo = document.getElementById("formTitulo");
  const cancelarEdicion = document.getElementById("cancelarEdicion");

  // Función para cargar productos desde la API y mostrarlos en la tabla
  async function cargarProductos() {
    try {
      const res = await fetch(URL); // Se hace la petición a la API
      const productos = await res.json(); // Se convierte la respuesta a JSON

      tabla.innerHTML = ""; // Se limpia la tabla

      // Por cada producto, se crea una fila con sus datos y botones
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
        tabla.innerHTML += fila; // Se agrega la fila a la tabla
      });
    } catch (error) {
      console.error("Error al cargar productos:", error); // Si hay error, se muestra en consola
    }
  }

  // Función para llenar el formulario con los datos del producto a editar
  window.editarProducto = async (id) => {
    try {
      const res = await fetch(URL + id); // Se obtiene el producto por su ID
      const producto = await res.json(); // Se convierte a objeto

      // Se llenan los campos del formulario con la info del producto
      productoId.value = producto.id;
      nombre.value = producto.nombre;
      descripcion.value = producto.descripcion;
      precio.value = producto.precio;
      stock.value = producto.stock;

      formTitulo.textContent = "Editar producto"; // Cambia el título del formulario
      cancelarEdicion.classList.remove("d-none"); // Muestra el botón para cancelar edición
    } catch (error) {
      console.error("Error al obtener producto:", error);
    }
  };

  // Función para eliminar un producto
  window.eliminarProducto = async (id) => {
    // Pregunta al usuario si está seguro de eliminar
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      const res = await fetch(URL + id, {
        method: "DELETE", // Se envía la petición con método DELETE
      });

      if (!res.ok) throw new Error("Error al eliminar producto");

      cargarProductos(); // Vuelve a cargar la tabla actualizada
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  // Evento que se ejecuta al enviar el formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita que se recargue la página

    // Se crea un objeto con los datos del formulario
    const datos = {
      nombre: nombre.value,
      descripcion: descripcion.value,
      precio: parseFloat(precio.value),
      stock: parseInt(stock.value),
    };

    try {
      let res;
      if (productoId.value) {
        // Si hay ID, actualiza el producto (PUT)
        res = await fetch(URL + productoId.value, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        });
      } else {
        // Si no hay ID, crea un nuevo producto (POST)
        res = await fetch(URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        });
      }

      if (!res.ok) throw new Error("Error al guardar producto");

      // Restablece el formulario y vuelve al modo creación
      form.reset();
      productoId.value = "";
      formTitulo.textContent = "Crear nuevo producto";
      cancelarEdicion.classList.add("d-none");
      cargarProductos(); // Vuelve a cargar los productos actualizados
    } catch (error) {
      console.error("Error al guardar producto:", error);
    }
  });

  // Evento para cancelar la edición y volver al modo creación
  cancelarEdicion.addEventListener("click", () => {
    form.reset(); // Limpia los campos del formulario
    productoId.value = "";
    formTitulo.textContent = "Crear nuevo producto";
    cancelarEdicion.classList.add("d-none"); // Oculta el botón de cancelar
  });

  // Carga los productos cuando se carga la página
  cargarProductos();
});
