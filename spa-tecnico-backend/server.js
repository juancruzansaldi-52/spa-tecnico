// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (HTML, CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, "public")));

// Base de datos temporal en memoria
let productos = [
  {
    id: 1,
    nombre: "iPhone 13",
    precio: 500000,
    stock: 3,
    tipo: "celular",
    subtipo: "iphone",
    imagenes: ["imagenes/celulares/iphone13-1.png"]
  },
  {
    id: 2,
    nombre: "Funda iPhone 13",
    precio: 8000,
    stock: 5,
    tipo: "accesorio",
    subtipo: "funda",
    imagenes: ["imagenes/fundas/funda-iphone13-1.png"]
  }
];

// ------------------ RUTAS API ------------------ //

// Obtener todos los productos
app.get("/productos", (req, res) => {
  res.json(productos);
});

// Agregar un producto
app.post("/productos", (req, res) => {
  const nuevoProducto = req.body;
  nuevoProducto.id = productos.length + 1;
  productos.push(nuevoProducto);
  res.json(nuevoProducto);
});

// Actualizar stock de un producto
app.put("/productos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const producto = productos.find(p => p.id === id);
  if (producto) {
    producto.stock = req.body.stock;
    res.json(producto);
  } else {
    res.status(404).json({ mensaje: "Producto no encontrado" });
  }
});

// Eliminar un producto
app.delete("/productos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  productos = productos.filter(p => p.id !== id);
  res.json({ mensaje: "Producto eliminado" });
});

// ----------------------------------------------- //

// Puerto dinámico para hosting
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
