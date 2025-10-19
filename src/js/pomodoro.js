document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start");
  const pomodoroStatic = document.getElementById("pomodoro-static");
  const pomodoroGif = document.getElementById("pomodoro-gif");
  const descansoGif = document.getElementById("descanso-gif");
  const pomodoroCard = document.getElementById("pomodoro-card");
  const timerDisplay = document.getElementById("timer");

  let interval = null;
  let running = false;
  let primeiraVez = true;

  const ciclo = [
    [0.05, "Foco"],
    [0.05, "Descanso Curto"],
    [0.05, "Foco"],
    [0.05, "Descanso Longo"],
    [0.05, "Foco"]
  ];

  let etapaAtual = 0;
  let totalSeconds = ciclo[etapaAtual][0] * 60;

  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  }

  timerDisplay.textContent = formatTime(totalSeconds);
  pomodoroStatic.style.display = "block";
  pomodoroGif.style.display = "none";
  descansoGif.style.display = "none";

  // Função para mostrar SweetAlert2 estilizado
  function showSwal(title, messages, callback) {
    let htmlContent = "";
    if (Array.isArray(messages)) {
      htmlContent = `<ul style="
        text-align:left; 
        padding-left:20px; 
        line-height:1.8; 
        font-size:16px; 
        color:#5c6773;
      ">`;
      messages.forEach(msg => htmlContent += `<li>${msg}</li>`);
      htmlContent += "</ul>";
    } else {
      htmlContent = `<p style="font-size:16px; color:#5c6773;">${messages}</p>`;
    }

    Swal.fire({
      title: `<span style="color:#ff4d94;">${title}</span>`,
      html: htmlContent,
      background: "#fff",
      confirmButtonColor: "#ff4d94",
      confirmButtonText: "OK",
      allowOutsideClick: false
    }).then(() => {
      if (callback) callback();
    });
  }

  function startTimer() {
    running = true;
    startBtn.textContent = "Pausar";

    if (ciclo[etapaAtual][1].includes("Foco")) {
      pomodoroGif.style.display = "block";
      descansoGif.style.display = "none";
      pomodoroStatic.style.display = "none";
    } else {
      pomodoroGif.style.display = "none";
      descansoGif.style.display = "block";
      pomodoroStatic.style.display = "none";
    }

    pomodoroCard.classList.add("started");

    interval = setInterval(() => {
      totalSeconds--;
      timerDisplay.textContent = formatTime(totalSeconds);

      if (totalSeconds <= 0) {
        clearInterval(interval);
        etapaAtual++;

        if (etapaAtual < ciclo.length) {
          const etapa = ciclo[etapaAtual - 1][1];
          const proxEtapa = ciclo[etapaAtual][1];

          showSwal(
            etapa === "Foco" ? "Fim do bloco de foco!" : "Fim da pausa!",
            `Agora vem: ${proxEtapa}`,
            () => {
              totalSeconds = ciclo[etapaAtual][0] * 60;
              timerDisplay.textContent = formatTime(totalSeconds);
              startTimer();
            }
          );
        } else {
          running = false;
          etapaAtual = 0;
          totalSeconds = ciclo[etapaAtual][0] * 60;
          timerDisplay.textContent = formatTime(totalSeconds);
          pomodoroGif.style.display = "none";
          descansoGif.style.display = "none";
          pomodoroStatic.style.display = "block";
          pomodoroCard.classList.remove("started");
          startBtn.textContent = "Iniciar";

          showSwal(
            "Missão cumprida!",
            "Cada etapa foi completada com sucesso"
          );
        }
      }
    }, 1000);
  }

  startBtn.addEventListener("click", () => {
    if (!running) {
      if (primeiraVez) {
        primeiraVez = false;

        showSwal(
          "Preparação do Pomodoro",
          [
            "Prepare-se para 3 blocos de foco de 30 min cada",
            "Pausas estratégicas: 10 min a cada bloco de foco",
            "Tenha água ou sua bebida favorita à mão",
            "Organize seu ambiente: elimine distrações",
          ],
          startTimer
        );
      } else {
        startTimer();
      }
    } else {
      clearInterval(interval);
      running = false;
      startBtn.textContent = "Continuar";
      pomodoroGif.style.display = "none";
      descansoGif.style.display = "none";
      pomodoroStatic.style.display = "block";
    }
  });
});
