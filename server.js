const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer-core");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/medir-fibra", async (req, res) => {
  const { fibra } = req.query;
  if (!fibra) return res.status(400).json({ error: "Falta parámetro fibra" });

  try {
    // Aquí iría la automatización real con Puppeteer
    res.json({ output: `Simulación de resultado para fibra ${fibra}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ ToddNet backend con puppeteer-core activo en puerto ${PORT}`);
});
