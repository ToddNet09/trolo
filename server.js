const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer-core');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors()); // Permitir CORS
app.use(express.json());

const getSessionId = () => process.env.SESSION_ID_RADIUS;

app.get('/medir-fibra', async (req, res) => {
  const fibra = req.query.fibra;
  if (!fibra) return res.status(400).json({ error: "Falta número de fibra" });

  const slotPort = {
    '6': { slot: 2, port: 14 },
    '9': { slot: 1, port: 1 }
  };

  const params = slotPort[fibra];
  if (!params) return res.status(404).json({ error: "Fibra no encontrada" });

  try {
    const response = await fetch("https://radius-gestion.todd.com.ar/radius/olt/command", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": "session_id_radius=" + getSessionId()
      },
      body: `command=onu status ${params.slot}/${params.port}`
    });
    const html = await response.text();
    res.json({ output: html });
  } catch (error) {
    res.status(500).json({ error: "Fallo al obtener datos" });
  }
});

app.listen(PORT, () => {
  console.log(`ToddNet backend con puppeteer-core activo en puerto ${PORT}`);
});