document.addEventListener("DOMContentLoaded", () => {

  // ================== ELEMENTOS ==================

  const lofiAudio = document.getElementById("lofi-audio");
  const lofiImgBtn = document.getElementById("lofi-img-btn");
  const lofiCover = document.getElementById("lofi-cover");
  const musicBtns = document.querySelectorAll(".lofi-music-btn");
  const volumeSlider = document.createElement("input");

  if (!lofiAudio || !lofiImgBtn || !lofiCover) {
    console.error("Elemento(s) faltando: verifique IDs 'lofi-audio', 'lofi-img-btn' e 'lofi-cover'");
    return;
  }

  // ================== LOOP INFINITO ==================

  lofiAudio.loop = true;

  // ================== CONFIG DO SLIDER ==================

  volumeSlider.type = "range";
  volumeSlider.min = 0;
  volumeSlider.max = 100;
  volumeSlider.value = 50;
  volumeSlider.className = "volume-slider";

  const lofiCard = document.querySelector(".lofi-card") || lofiCover.parentElement;
  const volumeContainer = document.createElement("div");
  volumeContainer.className = "volume-container";

  const volumeEmoji = document.createElement("span");
  volumeEmoji.textContent = "🔊";
  volumeEmoji.className = "volume-emoji";

  volumeContainer.appendChild(volumeEmoji);
  volumeContainer.appendChild(volumeSlider);

  const optionsEl = lofiCard ? lofiCard.querySelector(".lofi-options") : null;
  if (lofiCard && optionsEl) {
    lofiCard.insertBefore(volumeContainer, optionsEl);
  } else if (lofiCard) {
    lofiCard.appendChild(volumeContainer);
  }

  lofiAudio.volume = volumeSlider.value / 100;

  // ================== VARIÁVEIS ==================

  let tocando = false;
  let musicaAtual = null; 
  let hasStarted = false;

  // ================== ESTILIZAÇÃO RÁPIDA ==================

  const wrapper = lofiCover.parentElement;
  if (wrapper) {
    const style = window.getComputedStyle(wrapper).position;
    if (style === "static") wrapper.style.position = "relative";
  }

  lofiImgBtn.style.position = "absolute";
  lofiImgBtn.style.left = "50%";
  lofiImgBtn.style.top = "50%";
  lofiImgBtn.style.transform = "translate(-50%, -50%)";
  lofiImgBtn.style.zIndex = "5";
  lofiImgBtn.style.transition = "opacity 0.25s ease";
  lofiImgBtn.style.opacity = "1";
  lofiImgBtn.style.pointerEvents = "auto";
  lofiImgBtn.style.userSelect = "none";
  lofiImgBtn.style.cursor = "pointer";

  // ================== FUNÇÃO TOGGLE PLAY/PAUSE ==================

  function toggleLofi() {
    if (!tocando) {
      if (!musicaAtual) return console.log("Nenhuma música selecionada");
      lofiAudio.play().then(() => {
        tocando = true;
        hasStarted = true;
        lofiImgBtn.textContent = "❚❚"; 
        console.log("Reproduzindo — hasStarted true");
      }).catch(err => {
        console.warn("Erro ao tentar tocar o áudio:", err);
      });
    } else {
      lofiAudio.pause();
      tocando = false;
      lofiImgBtn.textContent = "▶"; 
      console.log("Pausado");
    }
  }

  // ================== EVENTO DO PLAYER ==================

  lofiImgBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleLofi();
  });

  // ================== TROCA DE MÚSICA ==================

  musicBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const novaMusica = btn.getAttribute("data-src");
      const novaCapa = btn.getAttribute("data-img");

      musicBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      if (musicaAtual !== novaMusica) {
        musicaAtual = novaMusica;
        lofiAudio.src = musicaAtual;
        if (novaCapa) lofiCover.src = novaCapa;

        tocando = false;
        hasStarted = false;
        lofiImgBtn.textContent = "▶";
        lofiImgBtn.style.opacity = "1";
        lofiImgBtn.style.pointerEvents = "auto";
        console.log("Música trocada, usuário precisa clicar no player para tocar");
      }
    });
  });

  // ================== BARRA DE VOLUME ==================

  volumeSlider.addEventListener("input", () => {
    lofiAudio.volume = volumeSlider.value / 100;

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
    lofiImgBtn.textContent = "▶";
    lofiImgBtn.style.opacity = "1";
    lofiImgBtn.style.pointerEvents = "auto";
    console.log("Áudio terminou — botão visível (loop está ativo, reinicia sozinho)");
  });

  // ================== APARECER/DESAPARECER BOTÃO ==================

  const hoverTarget = wrapper || lofiCover;

  hoverTarget.addEventListener("mouseenter", () => {
    lofiImgBtn.style.opacity = "1";
    lofiImgBtn.style.pointerEvents = "auto";
  });

  hoverTarget.addEventListener("mouseleave", () => {
    if (hasStarted) {
      lofiImgBtn.style.opacity = "0";
      lofiImgBtn.style.pointerEvents = "none";
    } else {
      lofiImgBtn.style.opacity = "1";
      lofiImgBtn.style.pointerEvents = "auto";
    }
  });

  // ================== CONFIGURAR PRIMEIRA MÚSICA ==================
  
  const primeiroBtn = musicBtns[0];
  if (primeiroBtn) {
    primeiroBtn.classList.add("active");
    const capa = primeiroBtn.getAttribute("data-img");
    if (capa) lofiCover.src = capa;
  }

  console.log("Script de player carregado. hasStarted:", hasStarted, "tocando:", tocando);
});
