// ==================== AVENTURA DEL ALFABETO ====================

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
    score: 0, streak: 0, lives: 3, level: 1,
    mode: 'facil', phase: 1, language: 'es',
    targetLetter: '', round: 0, totalRounds: 10,
    correctAnswers: 0, isPlaying: false,
    timer: null, timeLeft: 100,
    soundEnabled: true, bestStreak: 0
};

const al_MODE_CONFIG = {
    facil: { gridSize: 6, timeLimit: 0, colors: 4 },
    medio: { gridSize: 12, timeLimit: 15, colors: 6 },
    dificil: { gridSize: 20, timeLimit: 10, colors: 8 },
    dictado: { gridSize: 26, timeLimit: 0, colors: 10 }
};

const al_PHASE_CONFIG = {
    1: { hideDelay: 0, showLetter: true, instruction: '¡Encuentra la letra!' },
    2: { hideDelay: 3000, showLetter: true, instruction: '¡Memoriza la letra!' },
    3: { hideDelay: 0, showLetter: false, instruction: '¡Escucha y encuentra!' }
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

let al_synth = window.speechSynthesis;
let al_audioCtx = null;

function al_initAudio() {
    if (!al_audioCtx) {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            al_audioCtx = new AudioContext();
        } catch(e) {}
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
            case 'streak':
                osc.frequency.value = 440;
                setTimeout(() => osc.frequency.value = 554, 100);
                setTimeout(() => osc.frequency.value = 659, 200);
                setTimeout(() => osc.frequency.value = 880, 300);
                gain.gain.exponentialRampToValueAtTime(0.01, al_audioCtx.currentTime + 0.5);
                osc.start();
                osc.stop(al_audioCtx.currentTime + 0.5);
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

function al_startGame() {
    al_initAudio();
    const startScreen = document.getElementById('al_startScreen');
    const gameContainer = document.getElementById('al_gameContainer');
    if (startScreen) startScreen.classList.add('hidden');
    if (gameContainer) gameContainer.style.display = 'flex';
    al_resetGame();
    al_nextRound();
}

function al_resetGame() {
    al_gameState.score = 0;
    al_gameState.streak = 0;
    al_gameState.lives = 3;
    al_gameState.level = 1;
    al_gameState.round = 0;
    al_gameState.correctAnswers = 0;
    al_gameState.isPlaying = true;
    al_gameState.bestStreak = 0;
    al_updateUI();
}

function al_setMode(mode, fromLevelUp = false) {
    al_gameState.mode = mode;
    document.querySelectorAll('#alfabeto-app .mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    if (al_gameState.isPlaying && !fromLevelUp) {
        al_resetGame();
        al_nextRound();
    }
}

function al_setPhase(phase, fromLevelUp = false) {
    al_gameState.phase = phase;
    document.querySelectorAll('#alfabeto-app .phase-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.phase) === phase);
    });
    if (al_gameState.isPlaying && !fromLevelUp) {
        al_resetGame();
        al_nextRound();
    }
}

function al_setLanguage(lang) {
    al_gameState.language = lang;
    if (window.gameCore) window.gameCore.setLanguage(lang);
    document.querySelectorAll('#alfabeto-app .lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
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
    document.querySelectorAll('#alfabeto-app .letter-card').forEach(card => {
        card.style.pointerEvents = 'auto';
        card.style.opacity = '1';
    });
}

function al_nextRound() {
    if (al_gameState.lives <= 0) {
        al_endGame();
        return;
    }

    al_gameState.round++;
    if (al_gameState.round > al_gameState.totalRounds) {
        al_gameState.level++;
        const pointsEarned = al_gameState.score;
        
        // Actualizar en gameCore
        if (window.gameCore) {
            window.gameCore.updateGameStats('alfabeto', pointsEarned, al_gameState.level, true);
        }
        
        al_gameState.round = 1;
        al_gameState.correctAnswers = 0;
        
        if (al_gameState.level == 2) al_setMode('medio', true);
        if (al_gameState.level == 3) al_setMode('dificil', true);
        if (al_gameState.level > 3) al_setMode('dictado', true);
        
        al_playSound('levelup');
        al_showLevelUp();
        
        const gameOverTitle = document.getElementById('al_gameOverTitle');
        const restartBtn = document.querySelector('#al_gameOver .restart-btn');
        if (gameOverTitle) gameOverTitle.textContent = '¡Nivel ' + (al_gameState.level - 1) + ' Completado! 🎉';
        if (restartBtn) restartBtn.textContent = 'Siguiente Nivel 🚀';
        
        const finalScore = document.getElementById('al_finalScore');
        const finalStreak = document.getElementById('al_finalStreak');
        const finalCorrect = document.getElementById('al_finalCorrect');
        const finalTotal = document.getElementById('al_finalTotal');
        const starsRating = document.getElementById('al_starsRating');
        
        if (finalScore) finalScore.textContent = al_gameState.score;
        if (finalStreak) finalStreak.textContent = al_gameState.bestStreak;
        if (finalCorrect) finalCorrect.textContent = al_gameState.correctAnswers;
        if (finalTotal) finalTotal.textContent = al_gameState.totalRounds;
        if (starsRating) starsRating.textContent = '⭐⭐⭐⭐⭐';
        
        al_createConfetti();
        const gameOver = document.getElementById('al_gameOver');
        if (gameOver) gameOver.classList.add('show');
        return;
    }

    const config = al_MODE_CONFIG[al_gameState.mode];
    const phaseConfig = al_PHASE_CONFIG[al_gameState.phase];
    al_gameState.targetLetter = al_getRandomLetter();

    const instructionEl = document.getElementById('al_instruction');
    if (instructionEl) instructionEl.textContent = phaseConfig.instruction;

    const targetEl = document.getElementById('al_targetLetter');
    if (targetEl) {
        targetEl.textContent = al_gameState.targetLetter;
        targetEl.classList.remove('hidden-letter', 'ear-icon');
    }

    if (al_gameState.phase === 3 && targetEl) {
        targetEl.textContent = '👂';
        targetEl.classList.add('ear-icon');
    }

    const colorIdx = Math.floor(Math.random() * al_CARD_COLORS.length);
    if (targetEl) {
        targetEl.style.color = al_CARD_COLORS[colorIdx].bg.includes('FF6B9D') ? '#FF6B9D' : 
                              al_CARD_COLORS[colorIdx].bg.includes('FFC312') ? '#FFC312' : '#12CBC4';
    }

    const grid = document.getElementById('al_letterGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const letters = [al_gameState.targetLetter];
    const distractors = al_getDistractors(al_gameState.targetLetter, config.gridSize - 1);
    letters.push(...distractors);
    const shuffled = letters.sort(() => Math.random() - 0.5);
    const gridDisabled = al_gameState.phase === 2;

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

    setTimeout(() => { al_speakLetter(); }, 600);

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

    const speakBtn = document.getElementById('al_speakBtn');
    if (speakBtn) {
        if (al_gameState.phase === 3) speakBtn.classList.add('pulse');
        else speakBtn.classList.remove('pulse');
    }

    if (config.timeLimit > 0) {
        al_gameState.timeLeft = 100;
        al_startTimer(config.timeLimit);
    } else {
        const timerFill = document.getElementById('al_timerFill');
        if (timerFill) timerFill.style.width = '100%';
    }

    al_updateUI();
}

function al_startTimer(seconds) {
    if (al_gameState.timer) clearInterval(al_gameState.timer);
    const interval = 100;
    const decrement = 100 / (seconds * 1000 / interval);

    al_gameState.timer = setInterval(() => {
        al_gameState.timeLeft -= decrement;
        const timerFill = document.getElementById('al_timerFill');
        if (timerFill) timerFill.style.width = al_gameState.timeLeft + '%';
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
    setTimeout(() => al_nextRound(), 1500);
}

function al_handleCardClick(card, letter) {
    if (!al_gameState.isPlaying) return;
    if (card.classList.contains('correct') || card.classList.contains('wrong')) return;

    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    if (letter === al_gameState.targetLetter) {
        card.classList.add('correct');
        al_gameState.correctAnswers++;
        al_gameState.streak++;
        if (al_gameState.streak > al_gameState.bestStreak) al_gameState.bestStreak = al_gameState.streak;

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
        al_createParticles(centerX, centerY, '#2ecc71');

        if (al_gameState.streak >= 3) {
            al_playSound('streak');
            al_showStreak();
        }
        if (al_gameState.streak >= 5) al_createConfetti();

        if (al_gameState.timer) clearInterval(al_gameState.timer);
        setTimeout(() => al_nextRound(), 800);
    } else {
        card.classList.add('wrong');
        al_gameState.lives--;
        al_gameState.streak = 0;
        al_playSound('wrong');
        al_createParticles(centerX, centerY, '#e74c3c');
        
        if (window.gameCore) {
            window.gameCore.registerLetterResult(letter, false);
            window.gameCore.loseLife();
        }

        if (al_gameState.lives <= 0) {
            if (al_gameState.timer) clearInterval(al_gameState.timer);
            setTimeout(() => al_endGame(), 1000);
        } else {
            setTimeout(() => al_nextRound(), 1000);
        }
    }
    al_updateUI();
}

function al_showStreak() {
    const streakEl = document.createElement('div');
    streakEl.className = 'streak-display';
    streakEl.textContent = `¡Racha x${al_gameState.streak}! 🔥`;
    document.body.appendChild(streakEl);
    setTimeout(() => streakEl.remove(), 1000);
}

function al_showLevelUp() {
    const levelEl = document.createElement('div');
    levelEl.className = 'level-up';
    levelEl.textContent = `¡NIVEL ${al_gameState.level}! 🚀`;
    document.body.appendChild(levelEl);
    setTimeout(() => levelEl.remove(), 1500);
}

function al_showComboText(x, y, text) {
    const comboEl = document.createElement('div');
    comboEl.className = 'combo-text';
    comboEl.textContent = text;
    comboEl.style.left = x + 'px';
    comboEl.style.top = y + 'px';
    comboEl.style.color = '#FFC312';
    document.body.appendChild(comboEl);
    setTimeout(() => comboEl.remove(), 1000);
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
    if (livesEl) livesEl.textContent = '❤️'.repeat(al_gameState.lives) || '💔';
    if (levelEl) levelEl.textContent = al_gameState.level;
    
    const progress = ((al_gameState.round - 1) / al_gameState.totalRounds) * 100;
    if (progressFill) progressFill.style.width = progress + '%';
    if (progressText) progressText.textContent = `Progreso: ${al_gameState.round - 1}/${al_gameState.totalRounds}`;
}

function al_endGame() {
    al_gameState.isPlaying = false;
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
    const restartBtn = document.querySelector('#al_gameOver .restart-btn');
    if (restartBtn) restartBtn.textContent = '¡Jugar de Nuevo! 🎮';
    al_resetGame();
    al_nextRound();
}
