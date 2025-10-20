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
      title: `<span style="color:#ff4d94;">Opsie!</span>`,
      html: `<p style="font-size:14px; color:#5c6773;">Digite uma tarefa antes de adicionar!</p>`,
      icon: "error",
      background: "#fff",
      confirmButtonColor: "#ff4d94",
      customClass: { confirmButton: "popup-btn" }
    });
    return;
  }

  tarefas.push({ texto, concluida: false });
  salvarNoLocalStorage();
  listarTarefas();

  Swal.fire({
    title: `<span style="color: #ff4d94">Tarefa adicionada!</span>`,
    icon: "success",
    showConfirmButton: false,
    timer: 1000,
    background: "#fff"
  });

  taskInput.value = "";
  taskInput.focus();
}

// --- SALVAR TAREFA EDITADA ---
function salvarTarefa() {
  const texto = taskInput.value.trim();
  if (!texto) {
    Swal.fire({
      title: `<span style="color:#ff4d94;">Oopsie!</span>`,
      html: `<p style="font-size:14px; color:#5c6773;">Não dá pra salvar tarefa vazia</p>`,
      icon: "error",
      background: "#fff",
      confirmButtonColor: "#ff4d94",
      customClass: { confirmButton: "popup-btn" }
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
    title: `<span style="color: #ff4d94">Tarefa atualizada!</span>`,
    icon: "success",
    showConfirmButton: false,
    timer: 1000,
    background: "#fff"
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
      const icon = "🩷";
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
  const tarefa = tarefas[i];
  tarefa.concluida = !tarefa.concluida;
  salvarNoLocalStorage();
  listarTarefas();

  if (tarefa.concluida) {
    Swal.fire({
      title: `<span style="color:#ff4d94;">Tarefa concluída!</span>`,
      html: `<p style="font-size:14px; color:#5c6773;">Você mandou muito bem, continue assim</p>
             <img src="./src/assets/tasks/done.gif"
                  alt="Tarefa concluída"
                  style="width:150px; height:auto; display:block; margin:10px auto;">`,
      background: "#fff",
      showConfirmButton: false,
      timer: 1800
    });
  }

  verificarTodasConcluidas();
}

// --- VERIFICAR TODAS CONCLUIDAS ---
function verificarTodasConcluidas() {
  if (tarefas.length > 0 && tarefas.every(t => t.concluida)) {
    Swal.fire({
  title: `<span style="color:#ff4d94; font-size:26px;">Parabéns pelo esforço e dedicação!</span>`,
  html: `
    <p style="font-size:18px; color:#5c6773;">
      Pequenas vitórias constroem grandes resultados e você está no caminho certo.
    </p>
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      margin-top: 25px;
    ">
      <img src="./src/assets/tasks/complete.gif"
           alt="Tarefas completas"
           style="width:280px; height:auto; display:block;">
    </div>
  `,
  background: "#fff",
  confirmButtonColor: "#ff4d94",
  confirmButtonText: "Ok"
});

  }
}


// --- EDITAR TAREFA ---
function editarTarefa(i) {
  indiceEditar = i;
  taskInput.value = tarefas[i].texto;
  taskInput.focus();
  mainActionBtn.textContent = "Salvar Tarefa"; // muda texto do botão
}

// --- REMOVER TAREFA ---
function removerTarefa(i) {
  Swal.fire({
    title: `<span style="color:#ff4d94;">Remover esta tarefa?</span>`,
    html: `<p style="font-size:14px; color:#5c6773;">Ela será excluída permanentemente!</p>`,
    showCancelButton: true,
    confirmButtonText: "Sim, apagar!",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#ff4d94",
    cancelButtonColor: "#ff99c2",
    customClass: { confirmButton: "popup-btn", cancelButton: "popup-btn" }
  }).then((result) => {
    if (result.isConfirmed) {
      tarefas.splice(i, 1);
      salvarNoLocalStorage();
      listarTarefas();

      Swal.fire({
        title: `<span style="color: #ff4d94;">A tarefa foi apagada!</span>`,
        icon: "success",
        background: "#fff",
        showConfirmButton: false, // <--- aqui tiramos o botão
        timer: 1000 // opcional, fecha automaticamente após 1,5s
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
