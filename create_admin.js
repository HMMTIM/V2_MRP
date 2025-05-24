import { db } from './firebase-config.js';
import { 
  collection, 
  addDoc,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Dados do usuário admin
const adminUser = {
  nome: "admin",
  senha: "admin123",
  nivel: 9, // Nível de administrador
  ativo: true,
  dataCadastro: new Date()
};

// Função para criar o usuário admin
async function createAdminUser() {
  try {
    // Verificar se já existe um usuário admin
    const userRef = collection(db, "usuarios");
    const q = query(userRef, where("nome", "==", adminUser.nome));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      console.log("Usuário admin já existe!");
      return;
    }

    // Criar o usuário admin
    const docRef = await addDoc(collection(db, "usuarios"), adminUser);
    console.log("Usuário admin criado com sucesso! ID:", docRef.id);
  } catch (error) {
    console.error("Erro ao criar usuário admin:", error);
  }
}

// Executar a criação do usuário admin
createAdminUser();