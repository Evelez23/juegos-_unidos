// ==================== PALABRAS ESCONDIDAS ====================

// Diccionario progresivo por nivel.
const PE_WORDS = [
{word:'OSO',emoji:'🐻',level:1},{word:'SOL',emoji:'☀️',level:1},{word:'JAM',emoji:'🍓',level:1},{word:'PEZ',emoji:'🐟',level:1},{word:'GATO',emoji:'🐱',level:1},{word:'VACA',emoji:'🐮',level:1},{word:'MESA',emoji:'🪑',level:1},{word:'CASA',emoji:'🏠',level:1},{word:'MAMA',emoji:'👩',level:1},{word:'PAPA',emoji:'👨',level:1},{word:'LEON',emoji:'🦁',level:1},{word:'PATO',emoji:'🦆',level:1},{word:'MANO',emoji:'✋',level:1},{word:'LUNA',emoji:'🌙',level:1},{word:'DEDO',emoji:'☝️',level:1},{word:'BOTA',emoji:'🥾',level:1},{word:'ROSA',emoji:'🌹',level:1},{word:'UVA',emoji:'🍇',level:1},{word:'NENE',emoji:'👶',level:1},{word:'PERRO',emoji:'🐶',level:1},{word:'NINO',emoji:'🧒',level:1},{word:'GALLETA',emoji:'🍪',level:1},
{word:'ARBOL',emoji:'🌳',level:2},{word:'ABUELA',emoji:'👵',level:2},{word:'ABUELO',emoji:'👴',level:2},{word:'HERMANO',emoji:'👦',level:2},{word:'GALLINA',emoji:'🐔',level:2},{word:'CONEJO',emoji:'🐰',level:2},{word:'CABALLO',emoji:'🐴',level:2},{word:'HELADO',emoji:'🍦',level:2},{word:'QUESO',emoji:'🧀',level:2},{word:'PIZZA',emoji:'🍕',level:2},{word:'PELOTA',emoji:'⚽',level:2},{word:'ZAPATO',emoji:'👟',level:2},{word:'CAMISA',emoji:'👕',level:2},{word:'VENTANA',emoji:'🪟',level:2},{word:'CUADRADO',emoji:'🟦',level:2},{word:'CALCETIN',emoji:'🧦',level:2},{word:'MARIPOSA',emoji:'🦋',level:2},{word:'ESCUELA',emoji:'🏫',level:2},{word:'MOCHILA',emoji:'🎒',level:2},{word:'TORTUGA',emoji:'🐢',level:2},
{word:'ELEFANTE',emoji:'🐘',level:3},{word:'SERPIENTE',emoji:'🐍',level:3},{word:'TELEVISION',emoji:'📺',level:3},{word:'DINOSAURIO',emoji:'🦕',level:3},{word:'CHOCOLATE',emoji:'🍫',level:3},{word:'MARINERO',emoji:'⚓',level:3},{word:'ZANAHORIA',emoji:'🥕',level:3},{word:'COCODRILO',emoji:'🐊',level:3},{word:'BICICLETA',emoji:'🚲',level:3},{word:'CUMPLEANOS',emoji:'🎂',level:3},{word:'HERMANITA',emoji:'👧',level:3},{word:'UNIVERSO',emoji:'🌌',level:3},{word:'CAMIONETA',emoji:'🚙',level:3},{word:'ARCOIRIS',emoji:'🌈',level:3},
{word:'MARIPOSITA',emoji:'🦋',level:4},{word:'COMPUTADORA',emoji:'💻',level:4},{word:'HIPOPOTAMO',emoji:'🦛',level:4},{word:'REFRIGERADOR',emoji:'🧊',level:4},{word:'BOMBERO',emoji:'🚒',level:4},{word:'BIBLIOTECA',emoji:'📚',level:4},{word:'CUMPLEANERO',emoji:'🎉',level:4},{word:'FERROCARRIL',emoji:'🚂',level:4},{word:'ABRACADABRA',emoji:'✨',level:4},{word:'ESPANTAPAJAROS',emoji:'🎃',level:4},
{word:'CONSTELACION',emoji:'🌠',level:5},{word:'HELICOPTERO',emoji:'🚁',level:5},{word:'AVENTURERO',emoji:'🧭',level:5},{word:'MARAVILLOSO',emoji:'⭐',level:5},{word:'BOSQUECITO',emoji:'🌲',level:5},{word:'ASTRONAUTA',emoji:'👨‍🚀',level:5},{word:'PIRULETERO',emoji:'🍭',level:5},
{word:'TRANSPORTADOR',emoji:'🚚',level:6},{word:'EXPLORADORA',emoji:'🧭',level:6},{word:'ESTRELLITAS',emoji:'✨',level:6},{word:'ROMPECABEZAS',emoji:'🧩',level:6},
{word:'EXTRAORDINARIO',emoji:'🌟',level:7},{word:'ELECTRODOMESTICO',emoji:'🔌',level:7},{word:'RESPONSABILIDAD',emoji:'🏅',level:7},{word:'IMAGINACION',emoji:'💭',level:7},
{word:'SUPERCALIFRAGILISTICO',emoji:'🪄',level:8},{word:'INDEPENDIENTEMENTE',emoji:'🚀',level:8}
];
const PE_WORDS_EN = [
{word:'CAT',emoji:'🐱',level:1},{word:'DOG',emoji:'🐶',level:1},{word:'SUN',emoji:'☀️',level:1},{word:'PAN',emoji:'🍞',level:1},{word:'FISH',emoji:'🐟',level:1},{word:'COW',emoji:'🐮',level:1},{word:'MOM',emoji:'👩',level:1},{word:'DAD',emoji:'👨',level:1},{word:'BEAR',emoji:'🐻',level:1},{word:'LION',emoji:'🦁',level:1},{word:'DUCK',emoji:'🦆',level:1},{word:'MOON',emoji:'🌙',level:1},{word:'ROSE',emoji:'🌹',level:1},{word:'BABY',emoji:'👶',level:1},{word:'BOY',emoji:'🧒',level:1},{word:'GIRL',emoji:'👧',level:1},
{word:'TREE',emoji:'🌳',level:2},{word:'GRANDMA',emoji:'👵',level:2},{word:'GRANDPA',emoji:'👴',level:2},{word:'BROTHER',emoji:'👦',level:2},{word:'CHICKEN',emoji:'🐔',level:2},{word:'RABBIT',emoji:'🐰',level:2},{word:'HORSE',emoji:'🐴',level:2},{word:'ICECREAM',emoji:'🍦',level:2},{word:'CHEESE',emoji:'🧀',level:2},{word:'PIZZA',emoji:'🍕',level:2},{word:'BALL',emoji:'⚽',level:2},{word:'SHOE',emoji:'👟',level:2},{word:'SHIRT',emoji:'👕',level:2},{word:'WINDOW',emoji:'🪟',level:2},{word:'SQUARE',emoji:'🟦',level:2},{word:'SCHOOL',emoji:'🏫',level:2},
{word:'ELEPHANT',emoji:'🐘',level:3},{word:'SNAKE',emoji:'🐍',level:3},{word:'TELEVISION',emoji:'📺',level:3},{word:'DINOSAUR',emoji:'🦕',level:3},{word:'CHOCOLATE',emoji:'🍫',level:3},{word:'CARROT',emoji:'🥕',level:3},{word:'CROCODILE',emoji:'🐊',level:3},{word:'BICYCLE',emoji:'🚲',level:3},{word:'UNIVERSE',emoji:'🌌',level:3},{word:'RAINBOW',emoji:'🌈',level:3},
{word:'BUTTERFLY',emoji:'🦋',level:4},{word:'COMPUTER',emoji:'💻',level:4},{word:'HIPPOPOTAMUS',emoji:'🦛',level:4},{word:'FIREFIGHTER',emoji:'🚒',level:4},{word:'LIBRARY',emoji:'📚',level:4},{word:'TRAIN',emoji:'🚂',level:4},{word:'SCARECROW',emoji:'🎃',level:4},
{word:'CONSTELLATION',emoji:'🌠',level:5},{word:'HELICOPTER',emoji:'🚁',level:5},{word:'ADVENTURER',emoji:'🧭',level:5},{word:'WONDERFUL',emoji:'⭐',level:5},{word:'ASTRONAUT',emoji:'👨‍🚀',level:5},
{word:'TRANSPORTATION',emoji:'🚚',level:6},{word:'EXPLORER',emoji:'🧭',level:6},{word:'FIREFLIES',emoji:'✨',level:6},{word:'PUZZLE',emoji:'🧩',level:6},
{word:'EXTRAORDINARY',emoji:'🌟',level:7},{word:'ELECTRICITY',emoji:'🔌',level:7},{word:'RESPONSIBILITY',emoji:'🏅',level:7},{word:'IMAGINATION',emoji:'💭',level:7},
{word:'INDEPENDENTLY',emoji:'🚀',level:8},{word:'SUPERSTAR',emoji:'🌟',level:8}
];
function pe_getWordsFromAhorcado() {
  const lang = window.gameCore && window.gameCore.settings ? window.gameCore.settings.language : 'es';
  const source = lang === 'en' ? PE_WORDS_EN : PE_WORDS;
  return source.map(item => ({w:item.word.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/Ñ/g,'N'),e:item.emoji,level:item.level}));
}
let pe_state = { currentWord: '', letters: [], slots: [], streak: 0, correctCount: 0, level: 1, recentWords: [] };

function pe_restartFromLevelOne() {
    if (window.gameCore) {
        window.gameCore.player.level = 1;
        window.gameCore.saveGame();
    }
    pe_startGame();
}

function pe_startGame() {
    if (window.gameCore) {
        
    }
    pe_state = { currentWord: '', letters: [], slots: [], streak: pe_state.streak || 0, correctCount: 0, level: window.gameCore ? (window.gameCore.getGameStats('palabras').currentLevel || 1) : 1, recentWords: pe_state.recentWords || [] };
    const en = lang === 'en';
    const app = document.getElementById('palabras-app');
    if (app) {
        const h1 = app.querySelector('.header h1');
        const subtitle = app.querySelector('.header .subtitle');
        const labels = app.querySelectorAll('.score-item .label');
        const prizeTitle = app.querySelector('.pe-prizes h3');
        if (h1) h1.textContent = en ? '🧩 Hidden Words' : '🧩 Palabras Escondidas';
        if (subtitle) subtitle.textContent = en ? 'Put the letters in order' : 'Ordena las letras';
        if (labels[0]) labels[0].textContent = en ? 'Points' : 'Puntos';
        if (labels[1]) labels[1].textContent = en ? 'Level' : 'Nivel';
        if (prizeTitle) prizeTitle.textContent = en ? 'Magic Prize Collection 🎁' : 'Colección de Premios Mágicos 🎁';
    }
    pe_updatePrizes();
    pe_renderCollection();
    pe_nextWord();
}

function pe_nextWord() {
    const winOverlay = document.getElementById('pe_winOverlay');
    const prizeMsg = document.getElementById('pe_prizeMsg');
    if (winOverlay) winOverlay.classList.remove('show');
    if (prizeMsg) prizeMsg.style.display = 'none';
    pe_showFeedback('', '');
    
    const sourceAll = pe_getWordsFromAhorcado();
    const level = Math.max(1, Math.min(8, pe_state.level || 1));
    let allowed = sourceAll.filter(obj => obj.level === level);
    if (!allowed.length) allowed = sourceAll.filter(obj => obj.level <= level);
    if (window.gameCore) {
        const practiced = allowed.filter(obj => window.gameCore.canUseWord(obj.w));
        if (practiced.length) allowed = practiced;
    }
    const recent = new Set(pe_state.recentWords || []);
    let fresh = allowed.filter(obj => !recent.has(obj.w));
    if (!fresh.length) { pe_state.recentWords = []; fresh = allowed; }
    const wordObj = fresh[Math.floor(Math.random() * fresh.length)];
    pe_state.currentWord = wordObj.w;
    pe_state.recentWords.push(wordObj.w);
    if (pe_state.recentWords.length > 12) pe_state.recentWords.shift();
    
    const hint = document.getElementById('pe_hint');
    if (hint) hint.textContent = wordObj.e;
    
    // Speak the word
    try {
        const synth = window.speechSynthesis;
        synth.cancel();
        const utter = new SpeechSynthesisUtterance(wordObj.w);
        utter.lang = (window.gameCore && window.gameCore.settings && window.gameCore.settings.language === 'en') ? 'en-US' : 'es-ES';
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
        const stats = window.gameCore.getGameStats('palabras');
        if (scoreEl) scoreEl.textContent = stats.score || 0;
        if (levelEl) levelEl.textContent = stats.currentLevel || pe_state.level || 1;
    } else if (levelEl) levelEl.textContent = pe_state.level || 1;
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
            pe_showFeedback(window.gameCore.settings.language === 'en' ? 'That letter does not go here. Try another!' : 'Esa letra no va aquí. ¡Prueba otra!', 'error');
        } else {
            pe_showFeedback(window.gameCore.settings.language === 'en' ? 'Great job! That letter belongs here.' : '¡Muy bien! Esa letra sí va aquí.', 'success');
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


function pe_playVictorySound() {
    try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        const ctx = new AC(), start = ctx.currentTime;
        [523.25,659.25,783.99,1046.5].forEach((hz,i) => {
            const osc=ctx.createOscillator(), gain=ctx.createGain(), t=start+i*0.10;
            osc.type='sine'; osc.frequency.value=hz;
            gain.gain.setValueAtTime(0.0001,t);
            gain.gain.exponentialRampToValueAtTime(0.13,t+0.025);
            gain.gain.exponentialRampToValueAtTime(0.0001,t+0.18);
            osc.connect(gain); gain.connect(ctx.destination); osc.start(t); osc.stop(t+0.2);
        });
        setTimeout(()=>ctx.close(),850);
    } catch(e) {}
}

// Mensaje visible y accesible para indicar si la selección es correcta.
function pe_showFeedback(message, type) {
    const slots = document.getElementById('pe_wordSlots');
    if (!slots) return;
    let feedback = document.getElementById('pe_feedback');
    if (!feedback) {
        feedback = document.createElement('p');
        feedback.id = 'pe_feedback';
        feedback.setAttribute('role', 'status');
        feedback.setAttribute('aria-live', 'polite');
        slots.insertAdjacentElement('afterend', feedback);
    }
    feedback.textContent = message;
    feedback.className = 'pe-feedback' + (type ? ' ' + type : '');
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
            pe_playVictorySound();
            // Cada 5 aciertos avanza un nivel, hasta completar el nivel 8.
            if (pe_state.correctCount >= 5 && pe_state.level < 8) {
                pe_state.level++;
                pe_state.correctCount = 0;
                const result = gameCore.advancePalabras(pe_state.level);
                pe_showFeedback(window.gameCore.settings.language === 'en' ? '🎉 You reached level ' + pe_state.level + '! New words are waiting!' : '🎉 ¡Subiste al nivel ' + pe_state.level + '! ¡Nuevas palabras te esperan!', 'success');
                if (result.gameCompleted) setTimeout(() => pe_showGameComplete(), 700);
            }
            
            pe_updatePrizes();
            pe_renderCollection();
            const winOverlay = document.getElementById('pe_winOverlay');
            const prizeMsg = document.getElementById('pe_prizeMsg');
            if (prizeMsg) {
                prizeMsg.textContent = window.gameCore.settings.language === 'en' ? 'You spelled ' + pe_state.currentWord + '! Excellent work!' : '¡Formaste ' + pe_state.currentWord + '! ¡Excelente trabajo!';
                prizeMsg.style.display = 'block';
            }
            if (winOverlay) winOverlay.classList.add('show');
        } else {
            // Palabra incorrecta: dar retroalimentación y permitir corregir las letras.
            pe_state.streak = 0;
            if (window.gameCore) gameCore.registerWordResult(pe_state.currentWord, false);
            pe_showFeedback(window.gameCore.settings.language === 'en' ? 'Almost! Tap a letter in the word to change it.' : 'Casi lo logras. Toca una letra de la palabra para cambiarla.', 'error');
            document.querySelectorAll('#pe_wordSlots .pe-slot').forEach(slot => slot.classList.add('error'));
        }
    }
}

function pe_showGameComplete() {
    const overlay = document.createElement('div');
    overlay.className = 'result-overlay';
    overlay.style.zIndex = '3000';
    overlay.innerHTML = `
        <div class="emoji">🏛️</div>
        <h2>${window.gameCore.settings.language === 'en' ? 'RUINS EXPLORED!' : '¡RUINAS EXPLORADAS!'}</h2>
        <p class="word-reveal">${window.gameCore.settings.language === 'en' ? 'You reached level 8' : 'Has alcanzado el nivel 8'}</p>
        <div style="font-size: 3rem; margin: 10px;">🔐</div>
        <p>${window.gameCore.settings.language === 'en' ? 'You earned the TOWER KEY!' : '¡Has ganado la LLAVE DE LA TORRE!'}</p>
        <button class="restart-btn" onclick="pe_goToNextGame()">${window.gameCore.settings.language === 'en' ? '✨ Go to the Magic Tower ✨' : '✨ Ir a la Torre Mágica ✨'}</button>
    `;
    document.getElementById('palabras-app').appendChild(overlay);
    overlay.classList.add('show');
}

function pe_goToNextGame() {
    alert(window.gameCore.settings.language === 'en' ? '🎉 Congratulations! You completed the Ancient Ruins.\n\n🎪 Now you can play MAGIC TOWER (Hangman).' : '🎉 ¡Felicidades! Has completado las Ruinas Antiguas.\n\n🎪 Ahora puedes jugar TORRE MÁGICA (Ahorcado)');
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
    if (title) title.textContent = window.gameCore && window.gameCore.settings.language === 'en' ? 'Rewards Collection' : 'Colección de Recompensas';
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
function pe_setLanguage(lang) {
    if (lang !== 'es' && lang !== 'en') return;
    if (window.gameCore) window.gameCore.setLanguage(lang);
    document.querySelectorAll('#palabras-app .lang-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
    const en = lang === 'en';
    const app = document.getElementById('palabras-app');
    if (app) {
        const h1 = app.querySelector('.header h1');
        const subtitle = app.querySelector('.header .subtitle');
        const labels = app.querySelectorAll('.score-item .label');
        const prizeTitle = app.querySelector('.pe-prizes h3');
        if (h1) h1.textContent = en ? '🧩 Hidden Words' : '🧩 Palabras Escondidas';
        if (subtitle) subtitle.textContent = en ? 'Put the letters in order' : 'Ordena las letras';
        if (labels[0]) labels[0].textContent = en ? 'Points' : 'Puntos';
        if (labels[1]) labels[1].textContent = en ? 'Level' : 'Nivel';
        if (prizeTitle) prizeTitle.textContent = en ? 'Magic Prize Collection 🎁' : 'Colección de Premios Mágicos 🎁';
    }
    pe_updatePrizes();
    pe_renderCollection();
    pe_nextWord();
}
function gc_setLangAndRefresh(lang) { pe_setLanguage(lang); }

function gc_refreshHeaderLabels() {
    // Para compatibilidad
}
