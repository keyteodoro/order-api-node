const express = require("express");
const fs = require("fs");

const router = express.Router();

const DB_PATH = "./database/orders.json";

function readOrders() {
  const data = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(data);
}

function saveOrders(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

router.post("/", (req, res) => {
  try {
    const orders = readOrders();
    const body = req.body;

    const newOrder = {
      orderId: body.numeroPedido,
      value: body.valorTotal,
      creationDate: body.dataCriacao,
      items: body.items.map((item) => ({
        productId: Number(item.idItem),
        quantity: item.quantidadeItem,
        price: item.valorItem
      }))
    };

    orders.push(newOrder);
    saveOrders(orders);

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao criar pedido",
      error: error.message
    });
  }
});

router.get("/list/all", (req, res) => {
  try {
    const orders = readOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao listar pedidos",
      error: error.message
    });
  }
});

router.get("/:orderId", (req, res) => {
  try {
    const orders = readOrders();
    const order = orders.find((o) => o.orderId === req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar pedido",
      error: error.message
    });
  }
});

router.delete("/:orderId", (req, res) => {
  try {
    let orders = readOrders();
    orders = orders.filter((o) => o.orderId !== req.params.orderId);

    saveOrders(orders);

    res.json({ message: "Pedido deletado com sucesso" });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao deletar pedido",
      error: error.message
    });
  }
});

module.exports = router;