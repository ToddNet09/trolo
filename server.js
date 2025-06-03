
const express = require('express');
const cors = require('cors');
const { NodeSSH } = require('node-ssh');
require('dotenv').config();

const ssh = new NodeSSH();
const app = express();
app.use(cors());

const {
  SSH_HOST,
  SSH_USER,
  SSH_PASSWORD
} = process.env;

app.get('/medir-fibra', async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { slot, port } = req.query;
  const comando = `onu status ${slot}-${port}`;

  try {
    await ssh.connect({
      host: SSH_HOST,
      username: SSH_USER,
      password: SSH_PASSWORD
    });

    const resultado = await ssh.execCommand(comando);

    res.json({
      ok: true,
      comando: comando,
      salida: resultado.stdout || resultado.stderr
    });

  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Servidor SSH para medir fibra activo en puerto 3000');
});
