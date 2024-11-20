const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const dbPath = path.resolve(__dirname, './database/usuarios.json');
let dbUsuario = require(dbPath);

app.use(express.json());
app.use(cors());

app.listen(3000, () => {
  console.log('Servidor na porta 3000');
});

// Helper function to save database changes
function saveDatabase() {
  fs.writeFileSync(dbPath, JSON.stringify(dbUsuario, null, 2));
}

app.get('/user', (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ message: 'Email não fornecido.' });
    }

    const usuario = dbUsuario.find(usuario => usuario.email === email);

    if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.status(200).json(usuario);
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const usuario = dbUsuario.find((usuario) => usuario.email === email);

  if (!usuario) {
    res.status(404).json({ message: `Email inválido` });
  } else if (usuario.password !== password) {
    res.status(401).json({ message: 'Senha incorreta' });
  } else {
    res.status(200).json({ message: 'Autenticado com Sucesso' });
  }
});

app.post('/create', (req, res) => {
  const { username, email, password, photo } = req.body;

  if (dbUsuario.find((usuario) => usuario.email === email)) {
    res.status(409).json({ message: `Usuário com email ${email} já existe.` });
    return;
  }

  const newUser = {
    id: dbUsuario[dbUsuario.length - 1].id + 1,
    username,
    email,
    password,
    photo,
  };

  dbUsuario.push(newUser);

  try {
    saveDatabase();
    res.status(201).json({ message: 'Usuário criado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao salvar usuário.' });
  }
});