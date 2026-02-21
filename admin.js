const API_URL = "http://localhost:3000/productos";
const tbody = document.getElementById("productos-body");
const btnAgregar = document.getElementById("btn-agregar");

async function cargarProductos() {
  const res = await fetch(API_URL);
  const productos = await res.json();
  const tipoFiltro = document.getElementById("tipo").value;
  tbody.innerHTML = "";

  productos.filter(p => p.tipo === tipoFiltro)
           .forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.id}</td>
      <td><input type="text" value="${p.nombre}" data-id="${p.id}" class="input-nombre"></td>
      <td><input type="number" value="${p.precio}" data-id="${p.id}" class="input-precio"></td>
      <td><input type="number" value="${p.stock}" data-id="${p.id}" class="input-stock"></td>
      <td><input type="text" value="${p.subtipo}" data-id="${p.id}" class="input-subtipo"></td>
      <td><input type="text" value="${p.imagenes.join(",")}" data-id="${p.id}" class="input-imagenes"></td>
      <td>
        <button class="btn-guardar" data-id="${p.id}">Guardar</button>
        <button class="btn-borrar" data-id="${p.id}">Borrar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll(".btn-guardar").forEach(btn => {
    btn.onclick = async e => {
      const id = parseInt(e.target.dataset.id);
      const nombre = document.querySelector(`.input-nombre[data-id="${id}"]`).value;
      const precio = parseInt(document.querySelector(`.input-precio[data-id="${id}"]`).value);
      const stock = parseInt(document.querySelector(`.input-stock[data-id="${id}"]`).value);
      const subtipo = document.querySelector(`.input-subtipo[data-id="${id}"]`).value;
      const imagenes = document.querySelector(`.input-imagenes[data-id="${id}"]`).value.split(",");
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, precio, stock, subtipo, imagenes })
      });
      cargarProductos();
    };
  });

  document.querySelectorAll(".btn-borrar").forEach(btn => {
    btn.onclick = async e => {
      const id = parseInt(e.target.dataset.id);
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      cargarProductos();
    };
  });
}

// Agregar nuevo producto
btnAgregar.onclick = async () => {
  const nombre = document.getElementById("nombre").value;
  const precio = parseInt(document.getElementById("precio").value);
  const stock = parseInt(document.getElementById("stock").value);
  const tipo = document.getElementById("tipo").value;
  const subtipo = document.getElementById("subtipo").value;
  const imagenes = document
  .getElementById("imagenes")
  .value
  .split(",")
  .map(img => `/imagenes/${img.trim()}`);

  if(!nombre || isNaN(precio) || isNaN(stock)) return alert("Completa todos los campos");

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, precio, stock, tipo, subtipo, imagenes })
  });

  document.getElementById("nombre").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("stock").value = "";
  document.getElementById("subtipo").value = "";
  document.getElementById("imagenes").value = "";
  cargarProductos();
};

// Cambiar tipo filtra productos
document.getElementById("tipo").onchange = cargarProductos;

// Inicializar tabla
cargarProductos();