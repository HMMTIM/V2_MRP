
const sqlite3 = require('sqlite3').verbose();
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyB7JFaj4FIHAMYsJs67-52891rpZ7Kf7iI",
  authDomain: "fek-mrp.firebaseapp.com",
  projectId: "fek-mrp",
  storageBucket: "fek-mrp.firebasestorage.app",
  messagingSenderId: "55890604824",
  appId: "1:55890604824:web:f6ca7f9e8309539303a46d"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const db = new sqlite3.Database('./database.sqlite');

async function migrateCollection(collectionName, tableName) {
  console.log(`Migrando ${collectionName}...`);
  const snapshot = await getDocs(collection(firestore, collectionName));
  const data = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
  
  if (data.length > 0) {
    const columns = Object.keys(data[0]).filter(key => key !== 'id');
    const placeholders = columns.map(() => '?').join(',');
    
    const stmt = db.prepare(`INSERT INTO ${tableName} (${columns.join(',')}) VALUES (${placeholders})`);
    
    data.forEach(item => {
      const values = columns.map(col => item[col]);
      stmt.run(values);
    });
    
    stmt.finalize();
  }
  
  console.log(`${data.length} registros migrados de ${collectionName}`);
}

async function migrateTables() {
  try {
    console.log('Iniciando migração...');
    
    // Lista de coleções para migrar
    const collections = [
      ['usuarios', 'usuarios'],
      ['produtos', 'produtos'],
      ['estruturas', 'estruturas'],
      ['operacoes', 'operacoes'],
      ['recursos', 'recursos'],
      ['ordens_producao', 'ordens_producao'],
      ['movimentacoes', 'movimentacoes']
    ];
    
    for (const [collection, table] of collections) {
      await migrateCollection(collection, table);
    }
    
    console.log('Migração concluída com sucesso!');
    db.close();
  } catch (error) {
    console.error('Erro durante a migração:', error);
    db.close();
  }
}

migrateTables();
