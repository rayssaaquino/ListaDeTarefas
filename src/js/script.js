// --- VARIÁVEIS E ELEMENTOS ---
let tarefas = [];
let indiceEditar = -1;

const taskInput = document.getElementById("task");
const listaElement = document.getElementById("lista");
const mainActionBtn = document.getElementById("main-action-btn");

// --- LOCAL STORAGE ---
function carregarTarefas() {
  const saved = localStorage.getItem("tarefasCuteList");
  if (saved) tarefas = JSON.parse(saved);
  listarTarefas();
}

function salvarNoLocalStorage() {
  localStorage.setItem("tarefasCuteList", JSON.stringify(tarefas));
}

// --- FUNÇÃO UNIFICADA PARA BOTÃO ---
function mainAction() {
  if (indiceEditar === -1) {
    adicionarTarefa();
  } else {
    salvarTarefa();
  }
}

// --- ADICIONAR TAREFA ---
function adicionarTarefa() {
  const texto = taskInput.value.trim();
  if (!texto) {
    Swal.fire({
      icon: "error",
      title: "Opsie! 🎀",
      text: "Digite uma tarefa antes de adicionar!",
      background: "#ffe0ef",
      color: "#7a3d67",
      confirmButtonColor: "#ff4d94",
      customClass: { confirmButton: 'popup-btn' }
    });
    return;
  }

  tarefas.push({ texto, concluida: false });
  salvarNoLocalStorage();
  listarTarefas();

  Swal.fire({
    icon: "success",
    title: "💖 Tarefa adicionada!",
    showConfirmButton: false,
    timer: 1000,
    background: "#fff",
    color: "#7a3d67"
  });

  taskInput.value = "";
  taskInput.focus();
}

// --- SALVAR TAREFA EDITADA ---
function salvarTarefa() {
  const texto = taskInput.value.trim();
  if (!texto) {
    Swal.fire({
      icon: "error",
      title: "Oopsie! 🎀",
      text: "Não dá pra salvar tarefa vazia",
      background: "#fff",
      color: "#7a3d67",
      confirmButtonColor: "#ff4d94",
      customClass: { confirmButton: 'popup-btn' }
    });
    return;
  }

  tarefas[indiceEditar].texto = texto;
  indiceEditar = -1;
  salvarNoLocalStorage();
  listarTarefas();

  taskInput.value = "";
  taskInput.focus();

  Swal.fire({
    icon: "success",
    title: "✨ Tarefa atualizada!",
    showConfirmButton: false,
    timer: 1000,
    background: "#fff",
    color: "#7a3d67"
  });

  mainActionBtn.textContent = "Adicionar Tarefa"; // volta o texto do botão
}

// --- LISTAR TAREFAS ---
function listarTarefas() {
  if (tarefas.length === 0) {
    listaElement.innerHTML = `
      <p style="text-align:center; color:#ff4d94; font-style:italic;">
         Sua lista está vazia
      </p>`;
    return;
  }

  listaElement.innerHTML = tarefas
    .map((tarefa, i) => {
      const completedClass = tarefa.concluida ? "completed" : "";
      const icon = "🌸";
      return `
        <div class="task-item ${completedClass}" data-index="${i}">
          <div class="task-content">${icon} ${tarefa.texto}</div>
          <div class="task-buttons">
            <button class="complete-btn" onclick="toggleConcluida(${i})">
              ${tarefa.concluida ? "Desfazer" : "Feito"}
            </button>
            <button class="edit-btn" onclick="editarTarefa(${i})">✏️</button>
            <button class="remove-btn" onclick="removerTarefa(${i})">🗑️</button>
          </div>
        </div>
      `;
    })
    .join("");
}

// --- CONCLUIR / DESFAZER ---
function toggleConcluida(i) {
  tarefas[i].concluida = !tarefas[i].concluida;
  salvarNoLocalStorage();
  listarTarefas();

  Swal.fire({
    icon: tarefas[i].concluida ? "success" : "info",
    title: tarefas[i].concluida
      ? "🎉 Tarefa concluída!"
      : "Voltando pra lista! ✍️",
    showConfirmButton: false,
    timer: 1000,
    background: "#fff",
    color: "#7a3d67"
  });

  verificarTodasConcluidas();
}

// --- VERIFICAR TODAS CONCLUIDAS ---
function verificarTodasConcluidas() {
  if (tarefas.length > 0 && tarefas.every(t => t.concluida)) {
    Swal.fire({
      icon: 'success',
      title: '🎉 Parabéns!',
      text: 'Você concluiu todas as tarefas!',
      background: '#ffffffff',
      color: '#5c6773',
      confirmButtonColor: '#ff4d94',
      customClass: { confirmButton: 'popup-btn' }
    });
  }
}

// --- EDITAR TAREFA ---
function editarTarefa(i) {
  indiceEditar = i;
  taskInput.value = tarefas[i].texto;
  taskInput.focus();
  mainActionBtn.textContent = "Salvar Tarefa"; // muda texto do botão

  Swal.fire({
    icon: "info",
    title: "Modo Edição 📝",
    text: "Altere o texto e clique em Salvar Tarefa!",
    showConfirmButton: false,
    timer: 1800,
    background: "#fff",
    color: "#7a3d67"
  });
}

// --- REMOVER TAREFA ---
function removerTarefa(i) {
  Swal.fire({
    icon: "question",
    title: "Remover esta tarefa?",
    text: "Ela será excluída permanentemente!",
    showCancelButton: true,
    confirmButtonText: "Sim, apagar!",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#ff4d94",
    cancelButtonColor: "#ff99c2",
    customClass: { confirmButton: 'popup-btn', cancelButton: 'popup-btn' }
  }).then((result) => {
    if (result.isConfirmed) {
      tarefas.splice(i, 1);
      salvarNoLocalStorage();
      listarTarefas();

      Swal.fire({
        title: "💔 Removida!",
        text: "A tarefa foi apagada.",
        icon: "success",
        background: "#fff",
        color: "#7a3d67",
        confirmButtonColor: "#ff4d94",
        customClass: { confirmButton: 'popup-btn' }
      });
    }
  });
}


// --- ENTER ADICIONA ---
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") mainAction();
});

// --- INICIALIZA ---
document.addEventListener("DOMContentLoaded", carregarTarefas);