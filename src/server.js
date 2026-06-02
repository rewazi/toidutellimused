const express = require("express");
const cors = require("cors");
const path = require("path");

const usersRouter = require("./routes/users");
const menuRouter = require("./routes/menu");
const ordersRouter = require("./routes/orders");

const app = express();
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || "development";

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Logi päringuid — ainult dev keskkonnas
if (ENV === "development") {
  app.use((req, res, next) => {
    console.log(`[DEV] ${req.method} ${req.url}`);
    next();
  });
}

app.use("/api/users", usersRouter);
app.use("/api/menu", menuRouter);
app.use("/api/orders", ordersRouter);

// Tervise kontroll
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    env: ENV,
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Toidutellimuste server jookseb: http://localhost:${PORT}`);
  console.log(`Keskkond: ${ENV}`);
});
