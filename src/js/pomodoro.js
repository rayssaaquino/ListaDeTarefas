const startBtn = document.getElementById("start");
const pomodoroStatic = document.getElementById("pomodoro-static");
const pomodoroGif = document.getElementById("pomodoro-gif"); // gif do foco
const descansoGif = document.getElementById("descanso-gif"); // gif do descanso
const pomodoroCard = document.getElementById("pomodoro-card");
const timerDisplay = document.getElementById("timer");

let interval = null;
let running = false;
let primeiraVez = true; // controla popup inicial

// Ciclo definido: [minutos, descrição]
const ciclo = [
  [30, "Foco"],
  [5, "Descanso Curto"],
  [30, "Foco"],
  [10, "Descanso Longo"],
  [30, "Foco"]
];

let etapaAtual = 0;
let totalSeconds = ciclo[etapaAtual][0] * 60;

// Formata MM:SS
function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
}

// Estado inicial
timerDisplay.textContent = formatTime(totalSeconds);
pomodoroStatic.style.display = "block";
pomodoroGif.style.display = "none";
descansoGif.style.display = "none";

// Iniciar / Pausar
startBtn.addEventListener("click", () => {
  if (!running) {
    if (primeiraVez) {
      Swal.fire({
        icon: "info",
        title: "🎀 Pomodoro Iniciado",
        html: `
          Você fará 3 blocos de foco de 30 minutos com pausas: <br>
          - 5 min após o 1º foco <br>
          - 10 min após o 2º foco <br>
          - Ciclo termina após o 3º foco
        `,
        confirmButtonText: "Começar!"
      }).then(() => {
        primeiraVez = false;
        startTimer();
      });
    } else {
      startTimer(); // inicia sem popup
    }
  } else {
    // Pausar
    clearInterval(interval);
    running = false;
    startBtn.textContent = "Continuar";
    pomodoroGif.style.display = "none";
    descansoGif.style.display = "none";
    pomodoroStatic.style.display = "block";
  }
});

// Função que inicia o timer
function startTimer() {
  running = true;
  startBtn.textContent = "Pausar";

  // Define qual gif mostrar
  if (ciclo[etapaAtual][1].includes("Foco")) {
    pomodoroGif.style.display = "block";
    descansoGif.style.display = "none";
    pomodoroStatic.style.display = "none";
  } else {
    // Descanso
    pomodoroGif.style.display = "none";
    descansoGif.style.display = "block";
    pomodoroStatic.style.display = "none";
  }

  pomodoroCard.classList.add("started");

  const etapaTotalSegundos = ciclo[etapaAtual][0] * 60;

  interval = setInterval(() => {
    totalSeconds--;
    timerDisplay.textContent = formatTime(totalSeconds);

    if (totalSeconds <= 0) {
      clearInterval(interval);
      etapaAtual++;

      if (etapaAtual < ciclo.length) {
        totalSeconds = ciclo[etapaAtual][0] * 60;
        timerDisplay.textContent = formatTime(totalSeconds);

        Swal.fire({
          icon: ciclo[etapaAtual][1].includes("Foco") ? "success" : "info",
          title: ciclo[etapaAtual][1],
          timer: 2000,
          showConfirmButton: false,
          background: "#fff0f6",
          color: "#7a3d67"
        });

        startTimer(); // Continua automaticamente
      } else {
        // Ciclo finalizado
        running = false;
        etapaAtual = 0;
        totalSeconds = ciclo[etapaAtual][0] * 60;
        timerDisplay.textContent = formatTime(totalSeconds);
        pomodoroGif.style.display = "none";
        descansoGif.style.display = "none";
        pomodoroStatic.style.display = "block";
        pomodoroCard.classList.remove("started");
        startBtn.textContent = "Iniciar";

        Swal.fire({
          icon: "success",
          title: "🌸 Ciclo completo finalizado!",
          showConfirmButton: true,
          background: "#fff0f6",
          color: "#7a3d67"
        });
      }
    }
  }, 1000);
}
