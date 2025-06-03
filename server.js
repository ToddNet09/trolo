
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

    res.json({ ok: true, data: response.data });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
