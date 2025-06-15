const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à la base de données SQLite
const db = new Database('./users.db');
console.log('Connecté à la base SQLite.');

// Création de la table users si elle n'existe pas
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  )
`).run();

// ✅ Récupérer tous les utilisateurs
app.get('/users', (req, res) => {
  const users = db.prepare('SELECT * FROM users').all();
  res.json(users);
});

// ✅ Ajouter un nouvel utilisateur
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
    const info = stmt.run(name, email);
    res.json({ id: info.lastInsertRowid, name, email });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Supprimer un utilisateur
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
  const info = stmt.run(id);
  if (info.changes === 0) {
    return res.status(404).json({ error: 'Utilisateur non trouvé' });
  }
  res.json({ success: true });
});

// ✅ Modifier un utilisateur
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const stmt = db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?');
  const info = stmt.run(name, email, id);
  if (info.changes === 0) {
    return res.status(404).json({ error: 'Utilisateur non trouvé' });
  }
  res.json({ success: true });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur backend démarré sur http://localhost:${port}`);
});
