// ================== ELEMENTOS ==================
const lofiAudio = document.getElementById("lofi-audio");
const lofiImgBtn = document.getElementById("lofi-img-btn");
const lofiStatus = document.getElementById("lofi-status");
const musicBtns = document.querySelectorAll(".lofi-music-btn");

// ================== VARIÁVEIS ==================
let tocando = false;
let musicaAtual = "./src/assets/music/lofi1.mp3";

// ================== FUNÇÃO TOGGLE PLAY/PAUSE ==================
function toggleLofi() {
    if (!tocando) {
        lofiAudio.play();
        tocando = true;
        lofiImgBtn.src = "./src/assets/music/pausa.png";
        lofiStatus.textContent = "Tocando 🎵";
    } else {
        lofiAudio.pause();
        tocando = false;
        lofiImgBtn.src = "./src/assets/music/toque.png";
        lofiStatus.textContent = "Parado";
    }
}

// ================== EVENTO DO PLAYER ==================
lofiImgBtn.addEventListener("click", toggleLofi);

// ================== TROCA DE MÚSICA ==================
musicBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const novaMusica = btn.getAttribute("data-src");

        // Remove destaque de todos os botões
        musicBtns.forEach(b => b.classList.remove("selecionada"));

        // Adiciona destaque ao botão clicado
        btn.classList.add("selecionada");

        // Se mudou a música, atualiza src
        if (musicaAtual !== novaMusica) {
            musicaAtual = novaMusica;
            lofiAudio.src = musicaAtual;

            // pausa automaticamente, usuário precisa iniciar
            lofiAudio.pause();
            tocando = false;
            lofiImgBtn.src = "./src/assets/music/toque.png";
            lofiStatus.textContent = "Parado";
        }
    });
});

// ================== QUANDO A MÚSICA TERMINA ==================
lofiAudio.addEventListener("ended", () => {
    tocando = false;
    lofiImgBtn.src = "./src/assets/music/toque.png";
    lofiStatus.textContent = "Parado";
});
