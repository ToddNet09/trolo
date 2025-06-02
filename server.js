const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

async function medirFibra(slot, port) {
  const RADIUS_URL = process.env.RADIUS_URL;
  const RADIUS_USER = process.env.RADIUS_USER;
  const RADIUS_PASS = process.env.RADIUS_PASS;

  const payload = {
    user: RADIUS_USER,
    password: RADIUS_PASS,
    command: 'onu status',
    olt: {
      slot: parseInt(slot),
      port: parseInt(port)
    }
  };

  const response = await fetch(RADIUS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) throw new Error(`Error en el servidor Radius: ${response.statusText}`);
  const data = await response.json();
  return data.output || JSON.stringify(data);
}

app.get('/medir-fibra', async (req, res) => {
  const fibra = req.query.fibra;
  if (!fibra) {
    return res.status(400).json({ error: 'Parámetro "fibra" faltante.' });
  }

  const slot = fibra === '6' ? 1 : 1;
  const port = fibra === '6' ? 1 : 2;

  try {
    const result = await medirFibra(slot, port);
    res.json({ output: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`ToddNet backend con puppeteer-core activo en puerto ${PORT}`);
});
