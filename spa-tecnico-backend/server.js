const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde public
app.use(express.static(path.join(__dirname, "public")));

// Base de datos temporal en memoria
let productos = [
  { 
    id: 1, nombre: "iPhone 13", precio: 500000, stock: 3, 
    tipo: "celular", subtipo: "iphone", 
    imagenes: ["imagenes/celulares/iphone13-1.png"] 
  },
  { 
    id: 2, nombre: "Funda iPhone 13", precio: 8000, stock: 5, 
    tipo: "accesorio", subtipo: "funda", 
    imagenes: ["imagenes/fundas/iphone13-1.png"] 
  }
];

// ===================== API =====================

// Obtener productos
app.get("/productos", (req, res) => {
  res.json(productos);
});

// Agregar producto
app.post("/productos", (req, res) => {
  const { nombre, precio, stock, tipo, subtipo, imagenes } = req.body;
  if(!nombre || !precio || !stock || !tipo) {
    return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
  }
  const nuevoProducto = {
    id: productos.length ? productos[productos.length -1].id + 1 : 1,
    nombre,
    precio,
    stock,
    tipo,
    subtipo: subtipo || "",
    imagenes: imagenes || []
  };
  productos.push(nuevoProducto);
  res.json(nuevoProducto);
});

// Actualizar producto
app.put("/productos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const producto = productos.find(p => p.id === id);
  if(!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });

  const { nombre, precio, stock, tipo, subtipo, imagenes } = req.body;
  if(nombre !== undefined) producto.nombre = nombre;
  if(precio !== undefined) producto.precio = precio;
  if(stock !== undefined) producto.stock = stock;
  if(tipo !== undefined) producto.tipo = tipo;
  if(subtipo !== undefined) producto.subtipo = subtipo;
  if(imagenes !== undefined) producto.imagenes = imagenes;

  res.json(producto);
});

// Eliminar producto
app.delete("/productos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  productos = productos.filter(p => p.id !== id);
  res.json({ mensaje: "Producto eliminado" });
});

// ===================== SERVER =====================
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});