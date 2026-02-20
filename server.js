const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// 🔹 Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Conectado a MongoDB"))
.catch(err => console.log(err));

// 🔹 Modelo de Producto
const productoSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  stock: Number,
  tipo: String,
  subtipo: String,
  imagenes: [String]
});

const Producto = mongoose.model("Producto", productoSchema);

// ---------------- RUTAS ----------------

// Obtener productos
app.get("/productos", async (req, res) => {
  const productos = await Producto.find();
  res.json(productos);
});

// Agregar producto
app.post("/productos", async (req, res) => {
  const nuevoProducto = new Producto(req.body);
  await nuevoProducto.save();
  res.json(nuevoProducto);
});

// Actualizar stock
app.put("/productos/:id", async (req, res) => {
  const producto = await Producto.findByIdAndUpdate(
    req.params.id,
    { stock: req.body.stock },
    { new: true }
  );
  res.json(producto);
});

// Eliminar producto
app.delete("/productos/:id", async (req, res) => {
  await Producto.findByIdAndDelete(req.params.id);
  res.json({ mensaje: "Producto eliminado" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});