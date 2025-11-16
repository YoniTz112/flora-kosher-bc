const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Lista de pedidos (temporária)
let orders = [];

// -------------------- API --------------------

// ROTAS DEVEM FICAR ANTES DO STATIC + "*"
app.post("/orders", (req, res) => {
  const order = req.body;
  orders.push(order);
  console.log("Novo pedido:", order);
  res.json({ message: "Pedido recebido!" });
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
