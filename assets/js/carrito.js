// Mostrar u ocultar el carrito
document.getElementById("ver-carrito").addEventListener("click", () => {
  const carritoDiv = document.getElementById("carrito");
  carritoDiv.style.display = carritoDiv.style.display === "none" ? "block" : "none";
  mostrarCarrito();
});

// Agregar productos al carrito
document.querySelectorAll(".agregar-carrito").forEach((boton) => {
  boton.addEventListener("click", () => {
    const tarjeta = boton.closest(".card");
    const nombre = tarjeta.querySelector("h5, h4, .nombre")?.textContent?.trim() || "Producto";
    const precioTexto = tarjeta.querySelector(".precio, .card-text")?.textContent || "$0";
    const precio = parseInt(precioTexto.replace(/[^0-9]/g, "")) || 0;

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push({ nombre, precio });
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
  });
});

// Mostrar productos en el carrito
function mostrarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contenedor = document.getElementById("carrito-items");
  contenedor.innerHTML = "";

  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <span>${item.nombre} - $${item.precio}</span>
    `;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.className = "btn btn-danger btn-sm";
    btnEliminar.addEventListener("click", () => {
      carrito.splice(index, 1);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      mostrarCarrito();
    });

    li.appendChild(btnEliminar);
    contenedor.appendChild(li);
  });

  // Mostrar total (opcional)
  const total = carrito.reduce((sum, p) => sum + p.precio, 0);
  const totalElemento = document.getElementById("total-carrito");
  if (totalElemento) {
    totalElemento.textContent = `Total: $${total}`;
  }
}

// Mostrar carrito al cargar
mostrarCarrito();
