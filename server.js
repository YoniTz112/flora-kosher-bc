const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Lista de pedidos (temporária)
let orders = [];

// -------------------- SHABAT SYSTEM --------------------
let shabatActive = false;

// Rota para ver status
app.get("/shabat-status", (req, res) => {
  res.json({ active: shabatActive });
});

// Rota para ativar
app.post("/shabat/on", (req, res) => {
  shabatActive = true;
  console.log("🔵 Shabat ativado");
  res.json({ success: true, active: shabatActive });
});

// Rota para desativar
app.post("/shabat/off", (req, res) => {
  shabatActive = false;
  console.log("⚪ Shabat desativado");
  res.json({ success: true, active: shabatActive });
});

// -------------------- API PEDIDOS --------------------
app.post("/orders", (req, res) => {
  const order = req.body;
  orders.push(order);
  console.log("Novo pedido:", order);

  // Aqui opcional: ativa o Shabat automaticamente quando chega pedido
  // shabatActive = true;

  res.json({ message: "Pedido recebido!", shabatActive });
});

app.get("/orders", (req, res) => {
  res.json(orders);
});

app.delete("/orders/:index", (req, res) => {
  const index = req.params.index;
  orders.splice(index, 1);
  res.json({ message: "Pedido removido!" });
});

app.delete("/orders", (req, res) => {
  orders = [];
  res.json({ message: "Todos removidos!" });
});

// -------------------- FRONT-END --------------------
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// -------------------- Start Server --------------------
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
