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
  let cicloCompleto = false;

  const ciclo = [
    [30, "Foco"],
    [10, "Descanso Curto"],
    [30, "Foco"],
    [10, "Descanso Longo"],
    [30, "Foco"]
  ];

  let etapaAtual = 0;
  let totalSeconds = ciclo[etapaAtual][0] * 60;

  const alertSound = new Audio("./src/assets/pomodoro/bell.mp3");

  pomodoroStatic.style.display = "block";
  pomodoroStatic.src = "./src/assets/pomodoro/bunny.png";
  pomodoroGif.style.display = "none";
  descansoGif.style.display = "none";
  timerDisplay.textContent = formatTime(totalSeconds);

  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  }

  function showSwal(title, messages, callback, tocarSom = true) {
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

    if (tocarSom) {
      alertSound.currentTime = 0;
      alertSound.play();
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

  function atualizarImagens() {
    if (ciclo[etapaAtual][1].includes("Foco")) {
      if (running) {
        pomodoroGif.style.display = "block";
        pomodoroStatic.style.display = "none";
        descansoGif.style.display = "none";
      } else {
        pomodoroGif.style.display = "none";
        pomodoroStatic.style.display = "block";
        pomodoroStatic.src = "./src/assets/pomodoro/bunny.png";
        descansoGif.style.display = "none";
      }
    } else {
      pomodoroGif.style.display = "none";
      pomodoroStatic.style.display = "none";
      descansoGif.style.display = "block";

      if (!running) {
        descansoGif.src = "./src/assets/pomodoro/sleepy-bunny.png";
      } else {
        descansoGif.src = "./src/assets/pomodoro/sleepy-bunny.gif";
      }
    }
  }

  function startTimer() {
    running = true;
    startBtn.textContent = "Pausar";
    atualizarImagens();
    pomodoroCard.classList.add("started");

    interval = setInterval(() => {
      totalSeconds--;
      timerDisplay.textContent = formatTime(totalSeconds);

      if (totalSeconds <= 0) {
        clearInterval(interval);
        etapaAtual++;

        if (etapaAtual < ciclo.length) {
          const etapa = ciclo[etapaAtual - 1][1];

          showSwal(
            etapa === "Foco" ? "Fim do foco 🌸" : "Fim da pausa ☕",
            etapa === "Foco" 
              ? "Hora de relaxar e recarregar as energias."
              : "Vamos voltar ao foco. Você está indo muito bem!",
            () => {
              totalSeconds = ciclo[etapaAtual][0] * 60;
              timerDisplay.textContent = formatTime(totalSeconds);
              startTimer();
            },
            true
          );
        } else {
          running = false;
          etapaAtual = 0;
          totalSeconds = ciclo[etapaAtual][0] * 60;
          timerDisplay.textContent = formatTime(totalSeconds);
          pomodoroGif.style.display = "none";
          descansoGif.style.display = "none";
          pomodoroStatic.style.display = "block";
          pomodoroStatic.src = "./src/assets/pomodoro/bunny.png";
          pomodoroCard.classList.remove("started");
          startBtn.textContent = "Iniciar";

          cicloCompleto = true;

          showSwal(
            "Missão cumprida 🌟", 
            "Todo seu esforço de hoje valeu a pena. Excelente trabalho!",
            () => {
              primeiraVez = true;
            },
            true
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
          "Preparação do Pomodoro 🌸",
          [
            "Serão 3 blocos de 30 min de foco.",
            "Pausas de 10 min para descansar e recuperar as energias.",
            "Tenha água ou sua bebida favorita à mão.",
            "Organize seu espaço e sinta-se confortável.",
          ],
          startTimer,
          false 
        );
      } else {
        startTimer();
      }
    } else {
      clearInterval(interval);
      running = false;
      startBtn.textContent = "Continuar";
      atualizarImagens();
    }
  });
});
