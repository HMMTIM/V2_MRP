// estrutura-produtos.js

import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let produtos = [];
let estruturas = [];

// Função para carregar produtos e estruturas do Firestore
export async function carregarDados() {
  try {
    // Carregar produtos
    const produtosSnapshot = await getDocs(collection(db, "produtos"));
    produtos = [];
    produtosSnapshot.forEach((doc) => {
      produtos.push({ id: doc.id, ...doc.data() });
    });

    // Carregar estruturas existentes
    const estruturasSnapshot = await getDocs(collection(db, "estruturas"));
    estruturas = [];
    estruturasSnapshot.forEach((doc) => {
      estruturas.push({ id: doc.id, ...doc.data() });
    });
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    alert("Erro ao carregar dados. Por favor, tente novamente.");
  }
}

// Função para preencher o select do produto pai
export function preencherProdutoPaiSelect(selectPai) {
  selectPai.innerHTML = '<option value="">Selecione o produto pai...</option>';
  produtos
    .filter(p => p.tipo === 'PA' || p.tipo === 'SP') // Apenas PA ou SP podem ser pais
    .forEach(produto => {
      selectPai.innerHTML += `<option value="${produto.id}">${produto.codigo} - ${produto.descricao}</option>`;
    });
}

// Função para verificar se um produto é usado como componente em alguma estrutura
export function isUsedAsComponent(produtoId) {
  return estruturas.some(estrutura =>
    estrutura.componentes.some(comp => comp.componentId === produtoId)
  );
}

// Função para verificar se um produto é pai em alguma estrutura
export function isParentProduct(produtoId) {
  return estruturas.some(estrutura => estrutura.produtoPaiId === produtoId);
}

// Função para atualizar os selects de componentes
export function updateComponentSelects(paiId) {
  const componentSelects = document.querySelectorAll('.componente');
  componentSelects.forEach(select => {
    if (!select.value) { // Só atualiza se não tiver valor selecionado
      select.innerHTML = '<option value="">Selecione o componente...</option>';
      produtos
        .filter(p => {
          // Filtra componentes válidos:
          // 1. Deve ser do tipo MP, SP, SV, MO ou HR
          // 2. Não pode ser o próprio produto pai
          // 3. Se for SP, não pode ter o produto pai como componente em sua estrutura
          return ['MP', 'SP', 'SV', 'MO', 'HR'].includes(p.tipo) &&
                 p.id !== paiId &&
                 !(p.tipo === 'SP' && isParentProduct(p.id));
        })
        .forEach(produto => {
          select.innerHTML += `<option value="${produto.id}" data-unidade="${produto.unidade}">${produto.codigo} - ${produto.descricao} (${produto.tipo})</option>`;
        });
    }
  });
}

// Função para adicionar uma nova linha de componente
export function addComponent() {
  const componentsList = document.getElementById('componentsList');
  const newRow = document.createElement('div');
  newRow.className = 'component-row';
  newRow.innerHTML = `
    <select class="componente" required>
      <option value="">Selecione o componente...</option>
    </select>
    <input type="number" class="quantidade" placeholder="Quantidade" required min="0.001" step="0.001">
    <select class="unidade" required disabled>
      <option value="">Unidade</option>
    </select>
    <button type="button" class="remove-btn" onclick="removeComponent(this)">X</button>
  `;
  componentsList.appendChild(newRow);
  updateComponentSelects(document.getElementById('codigoPai').value);

  // Adicionar evento para atualizar unidade quando componente for selecionado
  const newSelect = newRow.querySelector('.componente');
  newSelect.addEventListener('change', function() {
    const selectedOption = this.options[this.selectedIndex];
    const unidadeSelect = this.parentElement.querySelector('.unidade');
    if (selectedOption.value) {
      const produto = produtos.find(p => p.id === selectedOption.value);
      unidadeSelect.innerHTML = `<option value="${produto.unidade}">${produto.unidade}</option>`;
    } else {
      unidadeSelect.innerHTML = '<option value="">Unidade</option>';
    }
  });
}

// Função para remover uma linha de componente
export function removeComponent(button) {
  if (document.querySelectorAll('.component-row').length > 1) {
    button.parentElement.remove();
  } else {
    alert('É necessário manter pelo menos um componente!');
  }
}

// Função para salvar a estrutura no Firestore
export async function salvarEstrutura(form) {
  const codigoPai = document.getElementById('codigoPai').value;
  const components = [];

  // Coletar todos os componentes
  document.querySelectorAll('.component-row').forEach(row => {
    const componentId = row.querySelector('.componente').value;
    const quantidade = row.querySelector('.quantidade').value;
    const unidade = row.querySelector('.unidade').value;

    if (componentId && quantidade && unidade) {
      components.push({
        componentId,
        quantidade: parseFloat(quantidade),
        unidade
      });
    }
  });

  try {
    // Verificar se já existe estrutura para este produto
    const estruturaQuery = query(
      collection(db, "estruturas"),
      where("produtoPaiId", "==", codigoPai)
    );
    const estruturaSnapshot = await getDocs(estruturaQuery);

    if (!estruturaSnapshot.empty) {
      alert("Já existe uma estrutura cadastrada para este produto!");
      return;
    }

    // Salvar a estrutura
    const estrutura = {
      produtoPaiId: codigoPai,
      componentes: components,
      dataCadastro: new Date()
    };

    await addDoc(collection(db, "estruturas"), estrutura);
    alert("Estrutura cadastrada com sucesso!");
    form.reset();
    document.getElementById('componentsList').innerHTML = `
      <div class="component-row">
        <select class="componente" required>
          <option value="">Selecione o componente...</option>
        </select>
        <input type="number" class="quantidade" placeholder="Quantidade" required min="0.001" step="0.001">
        <select class="unidade" required disabled>
          <option value="">Unidade</option>
        </select>
        <button type="button" class="remove-btn" onclick="removeComponent(this)">X</button>
      </div>
    `;
    updateComponentSelects();
  } catch (error) {
    console.error("Erro ao cadastrar estrutura:", error);
    alert("Erro ao cadastrar estrutura. Por favor, tente novamente.");
  }
}
