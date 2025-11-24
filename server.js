const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// -------------------- SHABAT SYSTEM PERSISTENCE --------------------
const SHABAT_STATE_FILE = path.join(__dirname, "shabat_state.json");

// Função para ler o estado do Shabat do arquivo
function readShabatState() {
  try {
    if (fs.existsSync(SHABAT_STATE_FILE)) {
      const data = fs.readFileSync(SHABAT_STATE_FILE, "utf8");
      return JSON.parse(data).active;
    }
  } catch (error) {
    console.error("Erro ao ler o estado do Shabat:", error);
  }
  return false; // Padrão para desativado se o arquivo não existir ou houver erro
}

// Função para escrever o estado do Shabat no arquivo
function writeShabatState(active) {
  try {
    fs.writeFileSync(SHABAT_STATE_FILE, JSON.stringify({ active }), "utf8");
    return true;
  } catch (error) {
    console.error("Erro ao escrever o estado do Shabat:", error);
    return false;
  }
}

let shabatActive = readShabatState(); // Inicializa com o estado persistido

// Lista de pedidos (temporária)
let orders = [];

// Rota para ver status
app.get("/shabat-status", (req, res) => {
  res.json({ active: shabatActive });
});

// Rota para ativar
app.post("/shabat/on", (req, res) => {
  shabatActive = true;
  writeShabatState(shabatActive);
  console.log("🔵 Shabat ativado");
  res.json({ success: true, active: shabatActive });
});

// Rota para desativar
app.post("/shabat/off", (req, res) => {
  shabatActive = false;
  writeShabatState(shabatActive);
  console.log("⚪ Shabat desativado");
  res.json({ success: true, active: shabatActive });
});

// -------------------- API PEDIDOS --------------------
app.post("/orders", (req, res) => {
  const order = req.body;
  // Adiciona um timestamp ao pedido
  order.time = new Date().toISOString();
  orders.push(order);
  console.log("Novo pedido:", order);

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
// Cria um diretório 'public' e salva os arquivos HTML dentro dele
app.use(express.static(path.join(__dirname, "public")));

// Rota para orders.html (administração)
app.get("/orders.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public/orders.html"));
});

// Rota principal (cardápio)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// -------------------- Start Server --------------------
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});