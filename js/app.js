const btnContacto    = document.getElementById("btnContacto");
const modalContacto  = document.getElementById("modalContacto");
const cerrarModal    = document.getElementById("cerrarModal");
const aceptarModal   = document.getElementById("aceptarModal");
const anio           = document.getElementById("anio");

const btnCarrito     = document.getElementById("btnCarrito");
const modalCarrito   = document.getElementById("modalCarrito");
const cerrarCarrito  = document.getElementById("cerrarCarrito");
const listaCarrito   = document.getElementById("listaCarrito");
const totalCarrito   = document.getElementById("totalCarrito");
const contadorCarrito = document.getElementById("contadorCarrito");
const vaciarCarrito  = document.getElementById("vaciarCarrito");
const comprarCarrito = document.getElementById("comprarCarrito");

const botonesAgregar = document.querySelectorAll(".btn-agregar");
const filtros        = document.querySelectorAll(".filtro");
const tarjetasProducto = document.querySelectorAll(".tarjeta-producto");

// ===== AÑO DINÁMICO EN EL PIE =====
anio.textContent = new Date().getFullYear();

// ===== CARRITO (estado) =====
let carrito = [];

// ===== MODAL CONTACTO =====
btnContacto.addEventListener("click", () => {
    modalContacto.classList.add("activo");
});

cerrarModal.addEventListener("click", () => {
    modalContacto.classList.remove("activo");
});

aceptarModal.addEventListener("click", () => {
    modalContacto.classList.remove("activo");
});

modalContacto.addEventListener("click", (evento) => {
    if (evento.target === modalContacto) {
        modalContacto.classList.remove("activo");
    }
});

// ===== MODAL CARRITO =====
btnCarrito.addEventListener("click", (evento) => {
    evento.preventDefault();
    renderizarCarrito();
    modalCarrito.classList.add("activo");
});

cerrarCarrito.addEventListener("click", () => {
    modalCarrito.classList.remove("activo");
});

modalCarrito.addEventListener("click", (evento) => {
    if (evento.target === modalCarrito) {
        modalCarrito.classList.remove("activo");
    }
});

// ===== AGREGAR PRODUCTOS AL CARRITO =====
botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", () => {
        const nombre = boton.dataset.nombre;
        const precio = parseFloat(boton.dataset.precio);

        // Verificar si ya existe en el carrito
        const existente = carrito.find((item) => item.nombre === nombre);

        if (existente) {
            existente.cantidad++;
        } else {
            carrito.push({ nombre, precio, cantidad: 1 });
        }

        actualizarContador();
        renderizarCarrito();

        // Pequeña animación de confirmación
        boton.innerHTML = '<i class="fa-solid fa-check"></i> Agregado';
        boton.style.backgroundColor = "#067647";
        setTimeout(() => {
            boton.innerHTML = '<i class="fa-solid fa-plus"></i> Agregar';
            boton.style.backgroundColor = "";
        }, 1000);
    });
});

// ===== ACTUALIZAR CONTADOR =====
function actualizarContador() {
    const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    contadorCarrito.textContent = total;
}

// ===== RENDERIZAR CARRITO =====
function renderizarCarrito() {
    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<li class="carrito-vacio">Tu carrito está vacío</li>';
        totalCarrito.textContent = "$0.00";
        return;
    }

    let total = 0;

    carrito.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        const li = document.createElement("li");
        li.innerHTML = `
            <div>
                <span class="item-nombre">${item.nombre}</span>
                <br>
                <small>${item.cantidad} x $${item.precio.toFixed(2)}</small>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
                <span class="item-precio">$${subtotal.toFixed(2)}</span>
                <button class="btn-eliminar" data-index="${index}" title="Eliminar">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        listaCarrito.appendChild(li);
    });

    totalCarrito.textContent = `$${total.toFixed(2)}`;

    // Eventos para eliminar items
    document.querySelectorAll(".btn-eliminar").forEach((btn) => {
        btn.addEventListener("click", () => {
            const index = parseInt(btn.dataset.index);
            carrito.splice(index, 1);
            actualizarContador();
            renderizarCarrito();
        });
    });
}

// ===== VACIAR CARRITO =====
vaciarCarrito.addEventListener("click", () => {
    carrito = [];
    actualizarContador();
    renderizarCarrito();
});

// ===== COMPRAR =====
comprarCarrito.addEventListener("click", () => {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Agrega productos primero.");
        return;
    }
    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    alert(`¡Gracias por tu compra! Total: $${total.toFixed(2)}\n\nTu pedido será procesado.`);
    carrito = [];
    actualizarContador();
    renderizarCarrito();
    modalCarrito.classList.remove("activo");
});

// ===== FILTROS DE PRODUCTOS =====
filtros.forEach((filtro) => {
    filtro.addEventListener("click", () => {
        // Activar botón
        filtros.forEach((f) => f.classList.remove("activo"));
        filtro.classList.add("activo");

        const categoria = filtro.dataset.categoria;

        tarjetasProducto.forEach((tarjeta) => {
            if (categoria === "todos" || tarjeta.dataset.categoria === categoria) {
                tarjeta.classList.remove("oculto");
            } else {
                tarjeta.classList.add("oculto");
            }
        });
    });
});

// ===== CERRAR MODALES CON ESC =====
document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
        modalContacto.classList.remove("activo");
        modalCarrito.classList.remove("activo");
    }
});
