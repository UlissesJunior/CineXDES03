const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const dbUsuario = require('./db/usuarios.json');
const dbFavoritos = require('./db/favoritos.json');

app.use(express.json());
app.use(cors());

app.listen(3000, () => {
    console.log('Servidor na porta 3000');
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    const usuario = dbUsuario.find(usuario => usuario.email === email);

    if (!usuario) {
        res.status(404).json({ message: `Email inválido` });
    } else if (usuario.password !== password) {
        res.status(401).json({ message: 'Senha incorreta' });
    } else {
        res.status(200).json({ message: 'Autenticado com Sucesso' });
    }
});

app.post('/create', (req, res) => {
    const { username, email, password } = req.body;

    if (dbUsuario.find(usuario => usuario.email === email)) {
        res.status(409).json({ message: `Usuário com email ${email} já existe.` });
    } else {
        dbUsuario.push({ username, email, password });
        fs.writeFileSync(path.resolve(__dirname, 'db/usuarios.json'), JSON.stringify(dbUsuario, null, 2));
        res.status(201).json({ message: 'Usuário criado com sucesso.' });
    }
});
