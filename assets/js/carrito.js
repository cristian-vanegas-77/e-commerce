// Mostrar u ocultar el carrito
document.getElementById("ver-carrito").onclick = function () {
  const carritoDiv = document.getElementById("carrito");
  carritoDiv.style.display = carritoDiv.style.display === "none" ? "block" : "none";
  mostrarCarrito();
};

// Agregar producto al carrito
const botones = document.querySelectorAll(".agregar-carrito");
botones.forEach(boton => {
  boton.onclick = function () {
    const tarjeta = boton.closest(".card");
    const nombre = tarjeta.querySelector("h5, h4, .nombre").textContent;
    const precioTexto = tarjeta.querySelector(".precio, .card-text").textContent;
    const precio = parseInt(precioTexto.replace(/[^0-9]/g, ""));

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push({ nombre, precio });
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
  };
});

// Mostrar carrito en pantalla
function mostrarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contenedor = document.getElementById("carrito-items");
  contenedor.innerHTML = "";

  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} - $${item.precio}`;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.className = "btn btn-danger btn-sm ms-2";
    btnEliminar.onclick = function () {
      carrito.splice(index, 1);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      mostrarCarrito();
    };

    li.appendChild(btnEliminar);
    contenedor.appendChild(li);
  });
}

// Mostrar el carrito al cargar la página (en caso de que ya tenga algo)
mostrarCarrito();
