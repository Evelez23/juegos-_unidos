// ==================== AVENTURA DEL ALFABETO ====================
// CON PROGRESIÓN REAL: NIVEL 1 (FÁCIL) → NIVEL 2 (MEDIO) → NIVEL 3 (DIFÍCIL) → NIVEL 4+ (DICTADO)

const al_ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const al_LETTER_NAMES_ES = {
    'A': 'a', 'B': 'be', 'C': 'ce', 'D': 'de', 'E': 'e', 'F': 'efe',
    'G': 'ge', 'H': 'hache', 'I': 'i', 'J': 'jota', 'K': 'ka', 'L': 'ele',
    'M': 'eme', 'N': 'ene', 'O': 'o', 'P': 'pe', 'Q': 'cu',
    'R': 'ere', 'S': 'ese', 'T': 'te', 'U': 'u', 'V': 'uve', 'W': 'uve doble',
    'X': 'equis', 'Y': 'i griega', 'Z': 'zeta'
};
const al_LETTER_NAMES_EN = {
    'A': 'ay', 'B': 'bee', 'C': 'see', 'D': 'dee', 'E': 'ee', 'F': 'eff',
    'G': 'jee', 'H': 'aitch', 'I': 'eye', 'J': 'jay', 'K': 'kay', 'L': 'ell',
    'M': 'em', 'N': 'en', 'O': 'oh', 'P': 'pee', 'Q': 'cue', 'R': 'ar',
    'S': 'ess', 'T': 'tee', 'U': 'you', 'V': 'vee', 'W': 'double you',
    'X': 'ex', 'Y': 'why', 'Z': 'zee'
};

let al_gameState = {
    score: 0,
    streak: 0,
    lives: 3,
    level: 1,           // Nivel DENTRO del juego (1,2,3,4...)
    phase: 1,           // Fase de aprendizaje (1,2,3)
    language: 'es',
    targetLetter: '',
    round: 0,           // Letra actual dentro del nivel (1-10)
    totalRounds: 10,    // 10 letras por nivel
    correctAnswers: 0,  // Letras correctas en el nivel ACTUAL
    isPlaying: true,
    timer: null,
    timeLeft: 100,
    soundEnabled: true,
    bestStreak: 0,
    gameStarted: false
};

// Configuración de niveles (dificultad)
const al_LEVEL_CONFIG = {
    1: { mode: 'facil', gridSize: 6, timeLimit: 0, colors: 4, name: '🌱 FÁCIL' },
    2: { mode: 'medio', gridSize: 12, timeLimit: 15, colors: 6, name: '🌿 MEDIO' },
    3: { mode: 'dificil', gridSize: 20, timeLimit: 10, colors: 8, name: '🔥 DIFÍCIL' },
    4: { mode: 'dictado', gridSize: 26, timeLimit: 0, colors: 10, name: '👑 DICTADO' }
};

// Configuración de fases de aprendizaje
const al_PHASE_CONFIG = {
    1: { hideDelay: 0, showLetter: true, instruction: '👁️ ¡Encuentra la letra!' },
    2: { hideDelay: 3000, showLetter: true, instruction: '🙈 ¡Memoriza la letra! (3 segundos)' },
    3: { hideDelay: 0, showLetter: false, instruction: '🎧 ¡Escucha y encuentra! (sin ver)' }
};

const al_CARD_COLORS = [
    { bg: 'linear-gradient(135deg, #FF6B9D, #C44569)', text: '#fff' },
    { bg: 'linear-gradient(135deg, #FFC312, #F79F1F)', text: '#fff' },
    { bg: 'linear-gradient(135deg, #12CBC4, #1289A7)', text: '#fff' },
    { bg: 'linear-gradient(135deg, #B53471, #6C5CE7)', text: '#fff' },
    { bg: 'linear-gradient(135deg, #6C5CE7, #a29bfe)', text: '#fff' },
    { bg: 'linear-gradient(135deg, #00D2D3, #01a3a4)', text: '#fff' },
    { bg: 'linear-gradient(135deg, #FF9F43, #ee5a24)', text: '#fff' },
    { bg: 'linear-gradient(135deg, #54a0ff, #2e86de)', text: '#fff' },
    { bg: 'linear-gradient(135deg, #5f27cd, #341f97)', text: '#fff' },
    { bg: 'linear-gradient(135deg, #10ac84, #1dd1a1)', text: '#fff' }
];

// ==================== AUDIO ====================
let al_synth = window.speechSynthesis;
let al_audioCtx = null;

function al_initAudio() {
    if (!al_audioCtx) {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            al_audioCtx = new AudioContext();
        } catch(e) { console.log('Audio no soportado'); }
    }
}

function al_playSound(type) {
    if (!al_gameState.soundEnabled || !al_audioCtx) return;
    try {
        const osc = al_audioCtx.createOscillator();
        const gain = al_audioCtx.createGain();
        osc.connect(gain);
        gain.connect(al_audioCtx.destination);
        gain.gain.value = 0.3;

        switch(type) {
            case 'correct':
                osc.frequency.value = 523;
                setTimeout(() => osc.frequency.value = 659, 100);
                setTimeout(() => osc.frequency.value = 784, 200);
                gain.gain.exponentialRampToValueAtTime(0.01, al_audioCtx.currentTime + 0.4);
                osc.start();
                osc.stop(al_audioCtx.currentTime + 0.4);
                break;
            case 'wrong':
                osc.frequency.value = 200;
                setTimeout(() => osc.frequency.value = 150, 150);
                gain.gain.exponentialRampToValueAtTime(0.01, al_audioCtx.currentTime + 0.3);
                osc.start();
                osc.stop(al_audioCtx.currentTime + 0.3);
                break;
            case 'levelup':
                [523, 659, 784, 1047].forEach((freq, i) => {
                    setTimeout(() => {
                        const o = al_audioCtx.createOscillator();
                        const g = al_audioCtx.createGain();
                        o.connect(g);
                        g.connect(al_audioCtx.destination);
                        o.frequency.value = freq;
                        g.gain.value = 0.3;
                        g.gain.exponentialRampToValueAtTime(0.01, al_audioCtx.currentTime + 0.3);
                        o.start();
                        o.stop(al_audioCtx.currentTime + 0.3);
                    }, i * 150);
                });
                break;
            case 'phaseup':
                [523, 659, 784, 1047, 1319].forEach((freq, i) => {
                    setTimeout(() => {
                        const o = al_audioCtx.createOscillator();
                        const g = al_audioCtx.createGain();
                        o.connect(g);
                        g.connect(al_audioCtx.destination);
                        o.frequency.value = freq;
                        g.gain.value = 0.3;
                        g.gain.exponentialRampToValueAtTime(0.01, al_audioCtx.currentTime + 0.3);
                        o.start();
                        o.stop(al_audioCtx.currentTime + 0.3);
                    }, i * 120);
                });
                break;
            case 'gameover':
                [784, 659, 523, 440].forEach((freq, i) => {
                    setTimeout(() => {
                        const o = al_audioCtx.createOscillator();
                        const g = al_audioCtx.createGain();
                        o.connect(g);
                        g.connect(al_audioCtx.destination);
                        o.frequency.value = freq;
                        g.gain.value = 0.3;
                        g.gain.exponentialRampToValueAtTime(0.01, al_audioCtx.currentTime + 0.4);
                        o.start();
                        o.stop(al_audioCtx.currentTime + 0.4);
                    }, i * 300);
                });
                break;
        }
    } catch(e) {}
}

function al_speakLetter() {
    if (!al_gameState.soundEnabled || !al_synth) return;
    al_synth.cancel();
    const letter = al_gameState.targetLetter;
    const lang = al_gameState.language;

    if (lang === 'es' || lang === 'both') {
        const utterEs = new SpeechSynthesisUtterance(al_LETTER_NAMES_ES[letter] || letter);
        utterEs.lang = 'es-ES';
        utterEs.rate = 0.8;
        utterEs.pitch = 1.2;
        al_synth.speak(utterEs);
    }
    if (lang === 'en' || lang === 'both') {
        setTimeout(() => {
            const utterEn = new SpeechSynthesisUtterance(al_LETTER_NAMES_EN[letter] || letter);
            utterEn.lang = 'en-US';
            utterEn.rate = 0.8;
            utterEn.pitch = 1.2;
            al_synth.speak(utterEn);
        }, lang === 'both' ? 800 : 0);
    }
}

function al_toggleSound() {
    al_gameState.soundEnabled = !al_gameState.soundEnabled;
    const btn = document.getElementById('al_soundToggle');
    if (btn) btn.textContent = al_gameState.soundEnabled ? '🔊' : '🔇';
}

// ==================== UI ====================
function al_createConfetti() {
    const colors = ['#FF6B9D', '#FFC312', '#12CBC4', '#B53471', '#6C5CE7', '#00D2D3', '#FF9F43'];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confetti.style.animationDelay = (Math.random() * 1) + 's';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
    }
}

function al_showLevelUpInGame() {
    const levelEl = document.createElement('div');
    levelEl.className = 'level-up';
    const levelName = al_LEVEL_CONFIG[al_gameState.level]?.name || `NIVEL ${al_gameState.level}`;
    levelEl.textContent = `🎉 ${levelName} DESBLOQUEADO! 🎉`;
    document.body.appendChild(levelEl);
    setTimeout(() => levelEl.remove(), 2000);
}

function al_showPhaseUp() {
    const phaseNames = ['', '👁️ Ver + Escuchar', '🙈 Memorizar', '🎧 Solo Escuchar'];
    const phaseEl = document.createElement('div');
    phaseEl.className = 'level-up';
    phaseEl.style.background = 'linear-gradient(135deg, #9b59b6, #8e44ad)';
    phaseEl.textContent = `✨ ¡FASE ${al_gameState.phase}: ${phaseNames[al_gameState.phase]}! ✨`;
    document.body.appendChild(phaseEl);
    setTimeout(() => phaseEl.remove(), 2500);
}

function al_updateUI() {
    const scoreEl = document.getElementById('al_score');
    const streakEl = document.getElementById('al_streak');
    const livesEl = document.getElementById('al_lives');
    const levelEl = document.getElementById('al_level');
    const progressFill = document.getElementById('al_progressFill');
    const progressText = document.getElementById('al_progressText');
    
    if (scoreEl) scoreEl.textContent = al_gameState.score;
    if (streakEl) streakEl.textContent = al_gameState.streak;
    if (livesEl) livesEl.textContent = '❤️'.repeat(Math.max(0, al_gameState.lives)) || '💔';
    if (levelEl) levelEl.textContent = al_gameState.level;
    
    const progress = ((al_gameState.round) / al_gameState.totalRounds) * 100;
    if (progressFill) progressFill.style.width = progress + '%';
    if (progressText) progressText.textContent = `Letras: ${al_gameState.round}/${al_gameState.totalRounds}`;
}

// ==================== LÓGICA PRINCIPAL ====================
function al_startGame() {
    al_initAudio();
    
    // Cargar progreso guardado
    if (window.gameCore && window.gameCore.player) {
        const stats = window.gameCore.getGameStats('alfabeto');
        al_gameState.level = stats.currentLevel || 1;
        al_gameState.phase = stats.currentPhase || 1;
        al_gameState.score = stats.score || 0;
        al_gameState.correctAnswers = 0;
        al_gameState.round = 0;
    } else {
        al_gameState.level = 1;
        al_gameState.phase = 1;
        al_gameState.score = 0;
        al_gameState.correctAnswers = 0;
        al_gameState.round = 0;
    }
    
    al_gameState.lives = 3;
    al_gameState.streak = 0;
    al_gameState.bestStreak = 0;
    al_gameState.isPlaying = true;
    al_gameState.gameStarted = true;
    
    // Aplicar configuración según nivel actual
    al_applyLevelConfig();
    
    // Ocultar start screen y mostrar juego
    const startScreen = document.getElementById('al_startScreen');
    const gameContainer = document.getElementById('al_gameContainer');
    if (startScreen) startScreen.classList.add('hidden');
    if (gameContainer) gameContainer.style.display = 'flex';
    
    al_updateUI();
    al_nextRound();
}

function al_applyLevelConfig() {
    const config = al_LEVEL_CONFIG[al_gameState.level] || al_LEVEL_CONFIG[4];
    
    // Actualizar botones de modo visualmente
    document.querySelectorAll('#alfabeto-app .mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === config.mode);
    });
    
    // Actualizar botones de fase
    document.querySelectorAll('#alfabeto-app .phase-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.phase) === al_gameState.phase);
    });
    
    // Mostrar mensaje de bienvenida al nivel
    console.log(`Nivel ${al_gameState.level}: ${config.name}, Fase ${al_gameState.phase}`);
}

function al_getRandomLetter(exclude = '') {
    let letter;
    do {
        letter = al_ALFABETO[Math.floor(Math.random() * al_ALFABETO.length)];
    } while (letter === exclude);
    return letter;
}

function al_getDistractors(target, count) {
    const pool = al_ALFABETO.replace(target, '');
    const shuffled = pool.split('').sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function al_nextRound() {
    if (!al_gameState.isPlaying) return;
    
    // Verificar vidas
    if (al_gameState.lives <= 0) {
        al_endGame();
        return;
    }
    
    // AVANZAR A LA SIGUIENTE LETRA
    al_gameState.round++;
    
    // ========== COMPLETÓ EL NIVEL ACTUAL ==========
    if (al_gameState.round > al_gameState.totalRounds) {
        // ¡Ha completado 10 letras correctamente!
        const levelCompleted = al_gameState.level;
        
        // Registrar en gameCore si existe
        if (window.gameCore) {
            const result = window.gameCore.advanceAlfabeto(levelCompleted, al_gameState.totalRounds);
            
            if (result.levelUp) {
                // Subió de nivel dentro del juego
                al_gameState.level = result.newLevel;
                
                // Aplicar nueva configuración de dificultad
                al_applyLevelConfig();
                
                // Guardar en gameCore para persistencia
                window.gameCore.saveGame();
            }
            
            if (result.phaseUp) {
                al_gameState.phase = result.newPhase;
                al_showPhaseUp();
                al_applyLevelConfig();
            }
        } else {
            // Sin gameCore, solo subir nivel manualmente
            al_gameState.level++;
            al_applyLevelConfig();
        }
        
        // ANIMACIÓN DE NIVEL COMPLETADO
        al_playSound('levelup');
        al_showLevelUpInGame();
        al_createConfetti();
        
        // Mostrar overlay de nivel completado
        al_showLevelCompleteOverlay(levelCompleted);
        
        // Reiniciar contadores para el nuevo nivel
        al_gameState.round = 0;
        al_gameState.correctAnswers = 0;
        
        // Esperar a que el usuario haga clic en "Continuar"
        return;
    }
    
    // ========== NUEVA LETRA (normal) ==========
    const config = al_LEVEL_CONFIG[al_gameState.level] || al_LEVEL_CONFIG[4];
    const phaseConfig = al_PHASE_CONFIG[al_gameState.phase];
    
    // Elegir letra objetivo (basada en dificultad adaptativa si hay gameCore)
    if (window.gameCore) {
        // Usar peso adaptativo para letras difíciles
        const weighted = [];
        for (const l of al_ALFABETO) {
            const weight = window.gameCore.getLetterWeight(l);
            for (let i = 0; i < weight; i++) weighted.push(l);
        }
        al_gameState.targetLetter = weighted[Math.floor(Math.random() * weighted.length)] || 'A';
    } else {
        al_gameState.targetLetter = al_getRandomLetter();
    }
    
    // Actualizar UI de la letra objetivo
    const instructionEl = document.getElementById('al_instruction');
    const targetEl = document.getElementById('al_targetLetter');
    
    if (instructionEl) instructionEl.textContent = phaseConfig.instruction;
    if (targetEl) {
        targetEl.textContent = al_gameState.targetLetter;
        targetEl.classList.remove('hidden-letter', 'ear-icon');
        
        if (al_gameState.phase === 3) {
            targetEl.textContent = '👂';
            targetEl.classList.add('ear-icon');
        }
        
        // Color aleatorio
        const colorIdx = Math.floor(Math.random() * al_CARD_COLORS.length);
        targetEl.style.color = al_CARD_COLORS[colorIdx].bg.includes('FF6B9D') ? '#FF6B9D' : 
                              al_CARD_COLORS[colorIdx].bg.includes('FFC312') ? '#FFC312' : '#12CBC4';
        
        // Animación de entrada
        targetEl.style.animation = 'none';
        targetEl.offsetHeight;
        targetEl.style.animation = 'letterPop 0.5s ease-out';
    }
    
    // Construir grid de letras
    const grid = document.getElementById('al_letterGrid');
    if (grid) {
        grid.innerHTML = '';
        const letters = [al_gameState.targetLetter];
        const distractors = al_getDistractors(al_gameState.targetLetter, config.gridSize - 1);
        letters.push(...distractors);
        const shuffled = letters.sort(() => Math.random() - 0.5);
        
        const gridDisabled = al_gameState.phase === 2; // Fase 2: memorizar, grid deshabilitado al inicio
        
        shuffled.forEach((letter, index) => {
            const card = document.createElement('div');
            card.className = 'letter-card';
            card.textContent = letter;
            const colorIdx2 = index % config.colors;
            const color = al_CARD_COLORS[colorIdx2];
            card.style.background = color.bg;
            card.style.color = color.text;
            card.dataset.letter = letter;
            
            if (gridDisabled) {
                card.style.pointerEvents = 'none';
                card.style.opacity = '0.5';
            }
            
            card.onclick = () => al_handleCardClick(card, letter);
            grid.appendChild(card);
        });
    }
    
    // Hablar la letra
    setTimeout(() => { al_speakLetter(); }, 500);
    
    // Fase 2: cuenta regresiva para memorización
    if (al_gameState.phase === 2 && phaseConfig.hideDelay > 0) {
        let count = 3;
        const doCountdown = () => {
            if (count > 0) {
                al_showCountdown(count, () => {
                    count--;
                    doCountdown();
                });
            } else {
                al_hideLetter();
            }
        };
        setTimeout(() => doCountdown(), 1000);
    }
    
    // Botón de escuchar (pulsa para fase 3)
    const speakBtn = document.getElementById('al_speakBtn');
    if (speakBtn) {
        if (al_gameState.phase === 3) speakBtn.classList.add('pulse');
        else speakBtn.classList.remove('pulse');
    }
    
    // Timer si aplica
    if (config.timeLimit > 0) {
        al_gameState.timeLeft = 100;
        al_startTimer(config.timeLimit);
    } else {
        const timerFill = document.getElementById('al_timerFill');
        if (timerFill) timerFill.style.width = '100%';
    }
    
    al_updateUI();
}

function al_showCountdown(number, callback) {
    const targetDisplay = document.getElementById('al_targetDisplay');
    if (!targetDisplay) return;
    const countdown = document.createElement('div');
    countdown.className = 'countdown-overlay';
    countdown.textContent = number;
    targetDisplay.appendChild(countdown);
    setTimeout(() => {
        countdown.remove();
        if (callback) callback();
    }, 900);
}

function al_hideLetter() {
    const targetEl = document.getElementById('al_targetLetter');
    if (targetEl) targetEl.classList.add('hidden-letter');
    al_playSound('hide');
    
    const instruction = document.getElementById('al_instruction');
    if (instruction) instruction.textContent = '¡Ahora encuentra la letra que memorizaste!';
    
    // Habilitar grid
    document.querySelectorAll('#alfabeto-app .letter-card').forEach(card => {
        card.style.pointerEvents = 'auto';
        card.style.opacity = '1';
    });
}

function al_startTimer(seconds) {
    if (al_gameState.timer) clearInterval(al_gameState.timer);
    const interval = 100;
    const decrement = 100 / (seconds * 1000 / interval);
    
    al_gameState.timer = setInterval(() => {
        al_gameState.timeLeft -= decrement;
        const timerFill = document.getElementById('al_timerFill');
        if (timerFill) timerFill.style.width = Math.max(0, al_gameState.timeLeft) + '%';
        
        if (al_gameState.timeLeft <= 0) {
            clearInterval(al_gameState.timer);
            al_handleTimeout();
        }
    }, interval);
}

function al_handleTimeout() {
    al_gameState.lives--;
    al_gameState.streak = 0;
    al_playSound('wrong');
    if (window.gameCore) window.gameCore.loseLife();
    al_updateUI();
    al_nextRound();
}

function al_handleCardClick(card, letter) {
    if (!al_gameState.isPlaying) return;
    if (card.classList.contains('correct') || card.classList.contains('wrong')) return;
    
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    if (letter === al_gameState.targetLetter) {
        // RESPUESTA CORRECTA
        card.classList.add('correct');
        al_gameState.correctAnswers++;
        al_gameState.streak++;
        
        if (al_gameState.streak > al_gameState.bestStreak) al_gameState.bestStreak = al_gameState.streak;
        
        // Calcular puntos
        const basePoints = 100;
        const streakBonus = Math.min(al_gameState.streak * 10, 100);
        const phaseBonus = al_gameState.phase * 50;
        const timeBonus = al_gameState.timeLeft > 0 ? Math.floor(al_gameState.timeLeft) : 0;
        const points = basePoints + streakBonus + phaseBonus + timeBonus;
        
        al_gameState.score += points;
        if (window.gameCore) {
            window.gameCore.addScore(points, 'alfabeto');
            window.gameCore.registerLetterResult(letter, true);
        }
        
        al_playSound('correct');
        
        // Efectos visuales
        al_createParticles(centerX, centerY, '#2ecc71');
        
        if (al_gameState.streak >= 3) {
            al_playSound('streak');
            al_showStreak();
        }
        if (al_gameState.streak >= 5) al_createConfetti();
        
        if (al_gameState.timer) clearInterval(al_gameState.timer);
        
        al_updateUI();
        al_nextRound();
    } else {
        // RESPUESTA INCORRECTA
        card.classList.add('wrong');
        al_gameState.lives--;
        al_gameState.streak = 0;
        
        al_playSound('wrong');
        al_createParticles(centerX, centerY, '#e74c3c');
        
        if (window.gameCore) {
            window.gameCore.registerLetterResult(letter, false);
            window.gameCore.loseLife();
        }
        
        al_updateUI();
        
        if (al_gameState.lives <= 0) {
            if (al_gameState.timer) clearInterval(al_gameState.timer);
            setTimeout(() => al_endGame(), 1000);
        } else {
            setTimeout(() => al_nextRound(), 1000);
        }
    }
}

function al_showStreak() {
    const streakEl = document.createElement('div');
    streakEl.className = 'streak-display';
    streakEl.textContent = `¡Racha x${al_gameState.streak}! 🔥`;
    document.body.appendChild(streakEl);
    setTimeout(() => streakEl.remove(), 1000);
}

function al_showLevelCompleteOverlay(completedLevel) {
    // Crear overlay si no existe
    let overlay = document.getElementById('al_levelCompleteOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'al_levelCompleteOverlay';
        overlay.className = 'result-overlay';
        document.getElementById('alfabeto-app').appendChild(overlay);
    }
    
    const nextLevel = al_gameState.level;
    const isGameComplete = (completedLevel >= 3 && nextLevel > 3);
    
    let title = `🎉 ¡NIVEL ${completedLevel} COMPLETADO! 🎉`;
    let message = `✨ Siguiente: ${al_LEVEL_CONFIG[nextLevel]?.name || 'MODO DICTADO'} ✨`;
    let buttonText = 'Continuar 🚀';
    let buttonAction = 'al_continueToNextLevel()';
    
    if (isGameComplete) {
        title = '🌟 ¡BOSQUE DE LETRAS COMPLETADO! 🌟';
        message = '🎁 ¡Has ganado la LLAVE DEL TORRENTE! 🎁\n☔ Ahora puedes jugar Lluvia de Letras';
        buttonText = '✨ Ver Siguiente Juego ✨';
        buttonAction = 'al_goToNextGame()';
    }
    
    overlay.innerHTML = `
        <div class="emoji">🏆</div>
        <h2>${title}</h2>
        <p class="word-reveal">${message}</p>
        <div style="font-size: 2rem; margin: 10px;">⭐ Puntuación: ${al_gameState.score} ⭐</div>
        <button class="restart-btn" onclick="${buttonAction}">${buttonText}</button>
    `;
    
    overlay.classList.add('show');
}

function al_continueToNextLevel() {
    const overlay = document.getElementById('al_levelCompleteOverlay');
    if (overlay) overlay.classList.remove('show');
    
    // Limpiar timers si existen
    if (al_gameState.timer) clearInterval(al_gameState.timer);
    
    // Continuar con el siguiente nivel
    al_nextRound();
}

function al_goToNextGame() {
    const overlay = document.getElementById('al_levelCompleteOverlay');
    if (overlay) overlay.classList.remove('show');
    
    // Mostrar mensaje de felicitaciones
    alert('🎉 ¡Felicidades! Has completado el Bosque de Letras.\n\n☔ Ahora puedes jugar TORRENTE DE PALABRAS (Lluvia de Letras)\n\n🌍 Vuelve al mapa y selecciona la nueva zona desbloqueada.');
    
    // Volver al mapa principal
    if (typeof showMainMenu === 'function') {
        showMainMenu();
    } else if (typeof window.showMainMenu === 'function') {
        window.showMainMenu();
    } else {
        window.location.href = 'index.html';
    }
}

function al_createParticles(x, y, color) {
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = (Math.random() * 10 + 5) + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = color;
        particle.style.borderRadius = '50%';
        const angle = (Math.PI * 2 * i) / 12;
        const distance = Math.random() * 100 + 50;
        particle.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
        particle.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
}

function al_endGame() {
    al_gameState.isPlaying = false;
    al_gameState.gameStarted = false;
    if (al_gameState.timer) clearInterval(al_gameState.timer);
    al_playSound('gameover');
    
    const totalAnswered = al_gameState.round - 1;
    const accuracy = totalAnswered > 0 ? Math.round((al_gameState.correctAnswers / totalAnswered) * 100) : 0;
    
    const finalScore = document.getElementById('al_finalScore');
    const finalStreak = document.getElementById('al_finalStreak');
    const finalCorrect = document.getElementById('al_finalCorrect');
    const finalTotal = document.getElementById('al_finalTotal');
    const starsRating = document.getElementById('al_starsRating');
    const titleEl = document.getElementById('al_gameOverTitle');
    
    if (finalScore) finalScore.textContent = al_gameState.score;
    if (finalStreak) finalStreak.textContent = al_gameState.bestStreak;
    if (finalCorrect) finalCorrect.textContent = al_gameState.correctAnswers;
    if (finalTotal) finalTotal.textContent = totalAnswered;
    
    let stars = '⭐';
    if (accuracy >= 50) stars = '⭐⭐';
    if (accuracy >= 80) stars = '⭐⭐⭐';
    if (accuracy >= 90) stars = '⭐⭐⭐⭐';
    if (accuracy === 100) stars = '⭐⭐⭐⭐⭐';
    if (starsRating) starsRating.textContent = stars;
    
    if (titleEl) {
        if (accuracy >= 90) titleEl.textContent = '¡INCREÍBLE! 🎉';
        else if (accuracy >= 70) titleEl.textContent = '¡MUY BIEN! 👏';
        else if (accuracy >= 50) titleEl.textContent = '¡BUEN TRABAJO! 😊';
        else titleEl.textContent = '¡SIGUE PRACTICANDO! 💪';
    }
    
    al_createConfetti();
    const gameOver = document.getElementById('al_gameOver');
    if (gameOver) gameOver.classList.add('show');
}

function al_restartGame() {
    const gameOver = document.getElementById('al_gameOver');
    if (gameOver) gameOver.classList.remove('show');
    al_startGame();
}

// Funciones de compatibilidad con gameCore
function al_setMode(mode, fromLevelUp = false) {
    // No hacer nada aquí - el modo se controla por nivel
    if (!fromLevelUp) {
        // Si no es por level up, reiniciar el juego
        if (al_gameState.gameStarted) {
            al_restartGame();
        }
    }
}

function al_setPhase(phase, fromLevelUp = false) {
    if (!fromLevelUp && al_gameState.gameStarted) {
        al_restartGame();
    }
}

function al_setLanguage(lang) {
    al_gameState.language = lang;
    if (window.gameCore) window.gameCore.setLanguage(lang);
    document.querySelectorAll('#alfabeto-app .lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

// Inicializar estrellas
function al_createStars() {
    const container = document.getElementById('al_stars');
    if (!container) return;
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 2 + 's';
        star.style.width = star.style.height = (Math.random() * 3 + 2) + 'px';
        container.appendChild(star);
    }
}

// Inicialización
al_createStars();
