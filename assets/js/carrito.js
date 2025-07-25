// Mostrar u ocultar el carrito
document.getElementById("ver-carrito").onclick = function () {
  const carritoDiv = document.getElementById("carrito"); // Se obtiene el contenedor del carrito
  // Si está oculto (display none), se muestra, y si está visible, se oculta
  carritoDiv.style.display = carritoDiv.style.display === "none" ? "block" : "none";
  mostrarCarrito(); // Se llama la función para actualizar lo que se ve en el carrito
};

// Agregar producto al carrito
const botones = document.querySelectorAll(".agregar-carrito"); // Selecciona todos los botones para agregar al carrito

// Por cada botón, se agrega una función cuando se hace clic
botones.forEach(boton => {
  boton.onclick = function () {
    // Se obtiene la tarjeta del producto desde donde se hizo clic
    const tarjeta = boton.closest(".card");
    // Se obtiene el nombre del producto (puede estar en h5, h4 o con clase "nombre")
    const nombre = tarjeta.querySelector("h5, h4, .nombre").textContent;
    // Se obtiene el precio del producto (puede estar en .precio o .card-text)
    const precioTexto = tarjeta.querySelector(".precio, .card-text").textContent;
    // Se limpia el texto del precio para obtener solo el número
    const precio = parseInt(precioTexto.replace(/[^0-9]/g, ""));

    // Se obtiene el carrito del localStorage (o se crea uno vacío si no hay nada)
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    // Se agrega el nuevo producto al arreglo
    carrito.push({ nombre, precio });
    // Se guarda el carrito actualizado en el localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito(); // Se actualiza la vista del carrito
  };
});

// Mostrar carrito en pantalla
function mostrarCarrito() {
  // Obtener el carrito del localStorage (o arreglo vacío si no hay)
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contenedor = document.getElementById("carrito-items"); // Contenedor donde van los productos
  contenedor.innerHTML = ""; // Limpiar lo que había antes

  // Por cada producto en el carrito, se crea un <li> con su nombre y precio
  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} - $${item.precio}`;

    // Se crea un botón para eliminar ese producto del carrito
    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.className = "btn btn-danger btn-sm ms-2";
    // Cuando se hace clic en eliminar, se quita ese producto del arreglo y se actualiza el carrito
    btnEliminar.onclick = function () {
      carrito.splice(index, 1); // Elimina el producto en esa posición
      localStorage.setItem("carrito", JSON.stringify(carrito)); // Guarda el nuevo carrito
      mostrarCarrito(); // Se vuelve a mostrar el carrito actualizado
    };

    li.appendChild(btnEliminar); // Se agrega el botón al <li>
    contenedor.appendChild(li);  // Se agrega el <li> al contenedor del carrito
  });
}

// Mostrar el carrito al cargar la página (en caso de que ya tenga algo guardado)
mostrarCarrito();
