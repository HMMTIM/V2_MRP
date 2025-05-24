
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados SQLite');
});

const sqlScript = fs.readFileSync(path.join(__dirname, 'create_tables.sql'), 'utf8');

db.serialize(() => {
  db.exec(sqlScript, (err) => {
    if (err) {
      console.error('Erro ao criar tabelas:', err);
      return;
    }
    console.log('Tabelas criadas com sucesso');
    db.close();
  });
});
