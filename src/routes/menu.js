const express = require("express");
const router = express.Router();
const data = require("../data");

// ============================================
// MENÜÜ MARSRUUDID
// GET /api/menu              - kogu menüü
// GET /api/menu/:id          - üks toode
// GET /api/menu/category/:cat - kategooria järgi
// GET /api/menu/categories   - kõik kategooriad
// ============================================

router.get("/", (req, res) => {
  res.json({ menu: data.menu });
});

// Kõik kategooriad - peab olema ENNE /:id
router.get("/categories", (req, res) => {
  const categories = [...new Set(data.menu.map((item) => item.category))];
  res.json({ categories });
});

// Kategooria järgi - peab olema ENNE /:id
router.get("/category/:cat", (req, res) => {
  const cat = req.params.cat.toLowerCase();
  const items = data.menu.filter((item) => item.category === cat);

  if (items.length === 0) {
    return res.status(404).json({ error: "Selle kategooriaga tooteid ei leitud" });
  }

  res.json({ items, count: items.length });
});

router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = data.menu.find((m) => m.id === id);

  if (!item) {
    return res.status(404).json({ error: "Toodet ei leitud" });
  }

  res.json(item);
});

module.exports = router;
