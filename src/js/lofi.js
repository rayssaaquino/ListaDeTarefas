// ================== ELEMENTOS ==================
const lofiAudio = document.getElementById("lofi-audio");
const lofiImgBtn = document.getElementById("lofi-img-btn");
const lofiCover = document.getElementById("lofi-cover");
const musicBtns = document.querySelectorAll(".lofi-music-btn");
const volumeSlider = document.createElement("input");

// ================== CONFIGURAÇÃO DO SLIDER DE VOLUME ==================
volumeSlider.type = "range";
volumeSlider.min = 0;
volumeSlider.max = 100;
volumeSlider.value = 50; // volume inicial
volumeSlider.className = "volume-slider";

const lofiCard = document.querySelector(".lofi-card");
const volumeContainer = document.createElement("div");
volumeContainer.className = "volume-container";

// Cria o emoji 🔊
const volumeEmoji = document.createElement("span");
volumeEmoji.textContent = "🔊";
volumeEmoji.className = "volume-emoji";

// Adiciona emoji + slider na mesma linha
volumeContainer.appendChild(volumeEmoji);
volumeContainer.appendChild(volumeSlider);

lofiCard.insertBefore(volumeContainer, lofiCard.querySelector(".lofi-options"));

// Define volume inicial do áudio
lofiAudio.volume = volumeSlider.value / 100;

// ================== VARIÁVEIS ==================
let tocando = false;
let musicaAtual = "./src/assets/music/lofi1.mp3";

// ================== FUNÇÃO TOGGLE PLAY/PAUSE ==================
function toggleLofi() {
    if (!tocando) {
        lofiAudio.play();
        tocando = true;
        lofiImgBtn.textContent = "❚❚"; // muda para pause
    } else {
        lofiAudio.pause();
        tocando = false;
        lofiImgBtn.textContent = "▶"; // muda para play
    }
}

// ================== EVENTO DO PLAYER ==================
lofiImgBtn.addEventListener("click", toggleLofi);

// ================== TROCA DE MÚSICA ==================
musicBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const novaMusica = btn.getAttribute("data-src");
        const novaCapa = btn.getAttribute("data-img");

        // Remove destaque de todos os botões
        musicBtns.forEach(b => b.classList.remove("active"));

        // Adiciona destaque ao botão clicado
        btn.classList.add("active");

        // Atualiza música e capa
        if (musicaAtual !== novaMusica) {
            musicaAtual = novaMusica;
            lofiAudio.src = musicaAtual;
            lofiCover.src = novaCapa;

            // pausa automaticamente, usuário precisa iniciar
            lofiAudio.pause();
            tocando = false;
            lofiImgBtn.textContent = "▶"; // volta ao play
        }
    });
});

// ================== BARRA DE VOLUME ==================
volumeSlider.addEventListener("input", () => {
    lofiAudio.volume = volumeSlider.value / 100;

    // Altera o emoji conforme o volume
    if (volumeSlider.value == 0) {
        volumeEmoji.textContent = "🔇";
    } else if (volumeSlider.value < 50) {
        volumeEmoji.textContent = "🔉";
    } else {
        volumeEmoji.textContent = "🔊";
    }
});

// ================== QUANDO A MÚSICA TERMINA ==================
lofiAudio.addEventListener("ended", () => {
    tocando = false;
    lofiImgBtn.textContent = "▶"; // volta ao play
});
