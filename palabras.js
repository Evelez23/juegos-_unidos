// ==================== PALABRAS ESCONDIDAS ====================

// Usar las mismas palabras del ahorcado
function pe_getWordsFromAhorcado() {
    const lang = 'es';
    const pool = [];
    const wordsDB = {
        animals: { es: [
            { word: 'GATO', emoji: '🐱' }, { word: 'PERRO', emoji: '🐶' }, { word: 'PEZ', emoji: '🐟' },
            { word: 'PAJARO', emoji: '🐦' }, { word: 'OSO', emoji: '🐻' }, { word: 'LEON', emoji: '🦁' },
            { word: 'CONEJO', emoji: '🐰' }, { word: 'ELEFANTE', emoji: '🐘' }, { word: 'VACA', emoji: '🐮' }
        ]},
        family: { es: [
            { word: 'MAMA', emoji: '👩' }, { word: 'PAPA', emoji: '👨' }, { word: 'BEBE', emoji: '👶' },
            { word: 'HERMANO', emoji: '👦' }, { word: 'HERMANA', emoji: '👧' }, { word: 'ABUELA', emoji: '👵' },
            { word: 'ABUELO', emoji: '👴' }, { word: 'TIO', emoji: '🧔' }, { word: 'TIA', emoji: '👩' }
        ]},
        colors: { es: [
            { word: 'ROJO', emoji: '🔴' }, { word: 'AZUL', emoji: '🔵' }, { word: 'VERDE', emoji: '🟢' },
            { word: 'AMARILLO', emoji: '🟡' }, { word: 'ROSA', emoji: '🩷' }, { word: 'MORADO', emoji: '🟣' }
        ]},
        food: { es: [
            { word: 'MANZANA', emoji: '🍎' }, { word: 'LECHE', emoji: '🥛' }, { word: 'PAN', emoji: '🍞' },
            { word: 'AGUA', emoji: '💧' }, { word: 'HUEVO', emoji: '🥚' }, { word: 'QUESO', emoji: '🧀' },
            { word: 'PIZZA', emoji: '🍕' }, { word: 'HELADO', emoji: '🍦' }
        ]}
    };
    
    Object.keys(wordsDB).forEach(category => {
        const entries = (wordsDB[category] && wordsDB[category][lang]) || [];
        entries.forEach(entry => {
            const clean = String(entry.word || '').toUpperCase();
            if (clean) pool.push({ w: clean.replace(/\s/g, ''), e: entry.emoji || '🔤' });
        });
    });
    return pool;
}

let pe_state = { currentWord: '', letters: [], slots: [], streak: 0 };

function pe_restartFromLevelOne() {
    if (window.gameCore) {
        window.gameCore.player.level = 1;
        window.gameCore.saveGame();
    }
    pe_startGame();
}

function pe_startGame() {
    if (window.gameCore) {
        window.gameCore.player.level = Math.max(1, window.gameCore.player.level);
    }
    pe_state = { currentWord: '', letters: [], slots: [], streak: pe_state.streak || 0 };
    pe_updatePrizes();
    pe_renderCollection();
    pe_nextWord();
}

function pe_nextWord() {
    const winOverlay = document.getElementById('pe_winOverlay');
    const prizeMsg = document.getElementById('pe_prizeMsg');
    if (winOverlay) winOverlay.classList.remove('show');
    if (prizeMsg) prizeMsg.style.display = 'none';
    
    const sourceAll = pe_getWordsFromAhorcado();
    let allowed = sourceAll;
    if (window.gameCore) {
        allowed = sourceAll.filter(obj => window.gameCore.canUseWord(obj.w));
    }
    const source = allowed.length ? allowed : sourceAll;
    const wordObj = source[Math.floor(Math.random() * source.length)];
    pe_state.currentWord = wordObj.w;
    
    const hint = document.getElementById('pe_hint');
    if (hint) hint.textContent = wordObj.e;
    
    // Speak the word
    try {
        const synth = window.speechSynthesis;
        synth.cancel();
        const utter = new SpeechSynthesisUtterance(wordObj.w);
        utter.lang = 'es-ES';
        utter.rate = 0.7;
        synth.speak(utter);
    } catch(e) {}
    
    pe_state.slots = new Array(wordObj.w.length).fill('');
    pe_state.letters = wordObj.w.split('').sort(() => Math.random() - 0.5);
    pe_render();
}

function pe_render() {
    const slotsDiv = document.getElementById('pe_wordSlots');
    if (slotsDiv) {
        slotsDiv.innerHTML = '';
        pe_state.slots.forEach((val, i) => {
            const div = document.createElement('div');
            div.className = 'pe-slot' + (val ? ' filled' : '');
            div.textContent = val;
            if (val) {
                div.onclick = () => pe_slotClick(i);
                div.ondblclick = (e) => { e.stopPropagation(); pe_slotClick(i); };
            }
            slotsDiv.appendChild(div);
        });
    }
    
    const lettersDiv = document.getElementById('pe_lettersArea');
    if (lettersDiv) {
        lettersDiv.innerHTML = '';
        pe_state.letters.forEach((val, i) => {
            const btn = document.createElement('button');
            btn.className = 'pe-letter-btn' + (val === null ? ' hidden' : '');
            btn.textContent = val;
            if (val !== null) btn.onclick = () => pe_letterClick(i);
            lettersDiv.appendChild(btn);
        });
    }
    
    const scoreEl = document.getElementById('pe_score');
    const levelEl = document.getElementById('pe_level');
    if (window.gameCore) {
        if (scoreEl) scoreEl.textContent = window.gameCore.player.score;
        if (levelEl) levelEl.textContent = window.gameCore.player.level;
    }
}

function pe_letterClick(idx) {
    const val = pe_state.letters[idx];
    const emptyIdx = pe_state.slots.indexOf('');
    if (emptyIdx !== -1) {
        pe_state.slots[emptyIdx] = val;
        pe_state.letters[idx] = null;
        const expected = pe_state.currentWord[emptyIdx];
        pe_render();
        
        if (expected !== val) {
            const slotEls = document.querySelectorAll('#pe_wordSlots .pe-slot');
            if (slotEls[emptyIdx]) slotEls[emptyIdx].classList.add('error');
            setTimeout(() => {
                if (slotEls[emptyIdx]) slotEls[emptyIdx].classList.remove('error');
            }, 500);
        }
        pe_checkWin();
    }
}

function pe_slotClick(idx) {
    const val = pe_state.slots[idx];
    if (val) {
        const emptyIdx = pe_state.letters.indexOf(null);
        if (emptyIdx !== -1) {
            pe_state.letters[emptyIdx] = val;
            pe_state.slots[idx] = '';
            pe_render();
        }
    }
}

// palabras.js - Ruinas Antiguas

function pe_checkWin() {
    if (!pe_state.slots.includes('')) {
        const formed = pe_state.slots.join('');
        if (formed === pe_state.currentWord) {
            // Palabra correcta
            const points = 50 + (pe_state.level * 10);
            gameCore.addScore(points, 'palabras');
            gameCore.registerWordResult(pe_state.currentWord, true);
            
            pe_state.correctCount++;
            pe_state.streak++;
            
            // Cada 5 palabras correctas = subir de nivel
            if (pe_state.correctCount >= 5) {
                pe_state.level++;
                pe_state.correctCount = 0;
                
                // Registrar progreso en gameCore
                const result = gameCore.advancePalabras(pe_state.level);
                
                al_showComboText(window.innerWidth/2, window.innerHeight/2, `📜 ¡NIVEL ${pe_state.level}! 📜`);
                
                if (result.gameCompleted) {
                    setTimeout(() => pe_showGameComplete(), 500);
                }
            }
            
            pe_updatePrizes();
            pe_renderCollection();
            pe_showWinEffect();
            pe_nextWord();
        } else {
            // Palabra incorrecta
            pe_state.streak = 0;
            gameCore.registerWordResult(pe_state.currentWord, false);
            pe_playHardError();
            pe_showErrorEffect();
        }
    }
}

function pe_showGameComplete() {
    const overlay = document.createElement('div');
    overlay.className = 'result-overlay';
    overlay.style.zIndex = '3000';
    overlay.innerHTML = `
        <div class="emoji">🏛️</div>
        <h2>¡RUINAS EXPLORADAS!</h2>
        <p class="word-reveal">Has alcanzado el nivel 8</p>
        <div style="font-size: 3rem; margin: 10px;">🔐</div>
        <p>¡Has ganado la LLAVE DE LA TORRE!</p>
        <button class="restart-btn" onclick="pe_goToNextGame()">✨ Ir a la Torre Mágica ✨</button>
    `;
    document.getElementById('palabras-app').appendChild(overlay);
    overlay.classList.add('show');
}

function pe_goToNextGame() {
    alert('🎉 ¡Felicidades! Has completado las Ruinas Antiguas.\n\n🎪 Ahora puedes jugar TORRE MÁGICA (Ahorcado)');
    if (typeof showMainMenu === 'function') {
        showMainMenu();
    } else {
        window.location.href = 'index.html';
    }
}
function pe_updatePrizes() {
    const list = document.getElementById('pe_prizeList');
    if (!list) return;
    list.innerHTML = '';
    if (window.gameCore && window.gameCore.player.rewards) {
        window.gameCore.player.rewards.forEach(rid => {
            const reward = (window.gameCore.rewardCatalog || []).find(r => r.id === rid);
            if (reward) {
                const d = document.createElement('div');
                d.className = 'pe-prize-item';
                d.innerHTML = reward.icon + '<span>' + reward.name + '</span>';
                list.appendChild(d);
            }
        });
    }
}

function pe_renderCollection() {
    const title = document.getElementById('pe_collectionTitle');
    if (title) title.textContent = 'Colección de Recompensas';
    const grid = document.getElementById('pe_collectionGrid');
    if (!grid) return;
    grid.innerHTML = '';
    const rewards = window.gameCore ? window.gameCore.rewardCatalog : [];
    const playerRewards = window.gameCore ? window.gameCore.player.rewards : [];
    
    rewards.forEach(reward => {
        const unlocked = playerRewards.includes(reward.id);
        const el = document.createElement('div');
        el.className = 'collection-item' + (unlocked ? '' : ' locked');
        el.innerHTML = reward.icon + '<span class="name">' + reward.name + '</span>';
        grid.appendChild(el);
    });
}

// Funciones globales necesarias
function gc_setLangAndRefresh(lang) {
    if (window.gameCore) window.gameCore.setLanguage(lang);
    if (typeof pe_nextWord === 'function') pe_nextWord();
}

function gc_refreshHeaderLabels() {
    // Para compatibilidad
}
