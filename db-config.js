
const sqlite3 = require('sqlite3').verbose();

// Criando conexão com SQLite
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco SQLite');
  }
});

module.exports = db;
