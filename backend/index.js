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

const favoritosPath = path.resolve(__dirname, './database/favoritos.json');
let dbFavoritos = require(favoritosPath);

function saveFavoritos() {
  fs.writeFileSync(favoritosPath, JSON.stringify(dbFavoritos, null, 2));
}

app.get('/favorites', (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email não fornecido.' });
  }

  const favoritos = dbFavoritos[email] || [];
  res.status(200).json(favoritos);
});

// Add a favorite
app.put('/favorites', (req, res) => {
  const { email, movie } = req.body;

  if (!email || !movie) {
    return res.status(400).json({ message: 'Email ou filme não fornecido.' });
  }

  if (!dbFavoritos[email]) {
    dbFavoritos[email] = [];
  }

  const alreadyExists = dbFavoritos[email].some((fav) => fav.imdbID === movie.imdbID);
  if (alreadyExists) {
    return res.status(409).json({ message: 'Filme já está nos favoritos.' });
  }

  dbFavoritos[email].push(movie);

  try {
    saveFavoritos();
    res.status(200).json({ message: 'Filme adicionado aos favoritos.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao salvar favorito.' });
  }
});

app.delete('/favorites', (req, res) => {
  const { email, imdbID } = req.body;

  if (!email || !imdbID) {
    return res.status(400).json({ message: 'Email ou imdbID não fornecido.' });
  }

  if (!dbFavoritos[email]) {
    return res.status(404).json({ message: 'Usuário não possui favoritos.' });
  }

  dbFavoritos[email] = dbFavoritos[email].filter((fav) => fav.imdbID !== imdbID);

  try {
    saveFavoritos();
    res.status(200).json({ message: 'Filme removido dos favoritos.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao remover favorito.' });
  }
});

const avaliacaoPath = path.resolve(__dirname, './database/avaliacoes.json');
let dbAvaliacao = require(avaliacaoPath);

function saveAvaliacao() {
  fs.writeFileSync(avaliacaoPath, JSON.stringify(dbAvaliacao, null, 2));
}

app.get('/ratings', (req, res) => {
  const { email, imdbID } = req.query;

  if (!email || !imdbID) {
    return res.status(400).json({ message: 'Email ou imdbID não fornecido.' });
  }

  const userRating = dbAvaliacao[email]?.find((rating) => rating.imdbID === imdbID);

  if (!userRating) {
    return res.status(404).json({ message: 'Avaliação não encontrada.' });
  }

  res.status(200).json(userRating);
});

app.put('/ratings', (req, res) => {
  const { email, imdbID, rating } = req.body;

  if (!email || !imdbID || rating == null || rating < 0 || rating > 5) {
    return res.status(400).json({ message: 'Dados inválidos.' });
  }

  if (!dbAvaliacao[email]) {
    dbAvaliacao[email] = [];
  }

  const existingRatingIndex = dbAvaliacao[email].findIndex((r) => r.imdbID === imdbID);

  if (existingRatingIndex >= 0) {
    dbAvaliacao[email][existingRatingIndex].rating = rating;
  } else {
    dbAvaliacao[email].push({ imdbID, rating });
  }

  try {
    saveAvaliacao();
    res.status(200).json({ message: 'Avaliação salva com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao salvar avaliação.' });
  }
});