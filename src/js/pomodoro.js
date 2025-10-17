const startBtn = document.getElementById("start");
const pomodoroStatic = document.getElementById("pomodoro-static");
const pomodoroGif = document.getElementById("pomodoro-gif");
const pomodoroCard = document.getElementById("pomodoro-card");
const timerDisplay = document.getElementById("timer");

let totalSeconds = 25 * 60;
let interval = null;
let running = false;

// Formata o tempo MM:SS
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
}

// Estado inicial
timerDisplay.textContent = formatTime(totalSeconds);
pomodoroStatic.style.display = "block";
pomodoroGif.style.display = "none";

// Evento de clique no botão
startBtn.addEventListener("click", () => {
    if (!running) {
        // Iniciar
        running = true;
        startBtn.textContent = "Pausar";

        // Mostra GIF e esconde imagem estática
        pomodoroStatic.style.display = "none";
        pomodoroGif.style.display = "block";
        pomodoroCard.classList.add("started");

        // Inicia o timer
        interval = setInterval(() => {
            totalSeconds--;
            timerDisplay.textContent = formatTime(totalSeconds);

            if (totalSeconds <= 0) {
                clearInterval(interval);
                interval = null;
                running = false;
                totalSeconds = 25 * 60;
                timerDisplay.textContent = formatTime(totalSeconds);

                // Volta ao estado inicial
                pomodoroGif.style.display = "none";
                pomodoroStatic.style.display = "block";
                pomodoroCard.classList.remove("started");
                startBtn.textContent = "Iniciar";

                Swal.fire({
                    icon: "success",
                    title: "⏰ Pomodoro finalizado!",
                    showConfirmButton: false,
                    timer: 1500,
                    background: "#fff0f6",
                    color: "#7a3d67"
                });
            }
        }, 1000);

    } else {
        // Pausar
        clearInterval(interval);
        interval = null;
        running = false;
        startBtn.textContent = "Continuar";

        // Mantém a imagem estática ao pausar
        pomodoroGif.style.display = "none";
        pomodoroStatic.style.display = "block";
    }
});
