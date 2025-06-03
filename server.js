
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const SESSION_ID = process.env.SESSION_ID;

app.get('/medir-fibra', async (req, res) => {
  const { slot, port } = req.query;

  try {
    const response = await axios.post(
      'https://radius-gestion.todd.com.ar/radius/olt/command',
      { command: 'onu status', slot, port },
      {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `session_id_radius=${SESSION_ID}`
        }
      }
    );

    const texto = response.data;
    const lineas = texto.split("\n");

    const datos = [];
    for (let i = 0; i < lineas.length; i++) {
      const line = lineas[i].trim();
      if (/^\d+\s+1-1-1-\d+/.test(line)) {
        const partes = line.split(/\s+/);
        datos.push({
          onu_id: partes[0],
          onu: partes[1],
          status: partes[2],
          config: partes[3],
          rx: partes[6] // OLT Rx Power
        });
      }
    }

    res.json({ ok: true, data: datos });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Servidor Radius activo en puerto 3000');
});
