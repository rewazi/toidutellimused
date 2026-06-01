const express = require("express");
const router = express.Router();
const data = require("../data");

// ============================================
// TELLIMUSTE MARSRUUDID
// POST /api/orders           - loo tellimus
// GET  /api/orders           - kõik tellimused
// GET  /api/orders/:id       - üks tellimus
// PATCH /api/orders/:id/status - uuenda staatus
// GET  /api/orders/user/me   - minu tellimused
// ============================================

function getUser(token) {
  const userId = data.sessions[token];
  if (!userId) return null;
  return data.users.find((u) => u.id === userId);
}

router.post("/", (req, res) => {
  const token = req.headers.authorization;
  const user = getUser(token);

  if (!user) {
    return res.status(401).json({ error: "Pead olema sisse logitud" });
  }

  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Vajalik väli: items (massiiv toodetest)" });
  }

  // Kontrolli et kõik tooted eksisteerivad
  const orderItems = [];
  for (const item of items) {
    const menuItem = data.menu.find((m) => m.id === item.menuId);
    if (!menuItem) {
      return res.status(404).json({ error: `Toodet ID ${item.menuId} ei leitud` });
    }
    orderItems.push({
      menuId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: item.quantity || 1,
    });
  }

  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = {
    id: data.nextOrderId++,
    userId: user.id,
    userName: user.name,
    items: orderItems,
    total: Math.round(total * 100) / 100,
    status: "vastu võetud",
    createdAt: new Date().toISOString(),
  };

  data.orders.push(order);

  res.status(201).json({ message: "Tellimus loodud!", order });
});

router.get("/", (req, res) => {
  res.json({ orders: data.orders });
});

// Minu tellimused - peab olema ENNE /:id
router.get("/user/me", (req, res) => {
  const token = req.headers.authorization;
  const user = getUser(token);

  if (!user) {
    return res.status(401).json({ error: "Pead olema sisse logitud" });
  }

  const userOrders = data.orders.filter((o) => o.userId === user.id);
  res.json({ orders: userOrders, count: userOrders.length });
});

router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const order = data.orders.find((o) => o.id === id);

  if (!order) {
    return res.status(404).json({ error: "Tellimust ei leitud" });
  }

  res.json(order);
});

router.patch("/:id/status", (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;

  const validStatuses = ["vastu võetud", "valmistamisel", "valmis", "kohale toimetatud"];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      error: `Kehtivad staatused: ${validStatuses.join(", ")}`,
    });
  }

  const order = data.orders.find((o) => o.id === id);
  if (!order) {
    return res.status(404).json({ error: "Tellimust ei leitud" });
  }

  order.status = status;
  res.json({ message: "Staatus uuendatud!", order });
});

module.exports = router;
