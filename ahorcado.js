// ==================== AHORCADO MÁGICO ====================

// Word Database
const ah_WORDS = {
    animals: {
        es: [
            { word: 'GATO', emoji: '🐱', hint: 'Animal que dice miau' },
            { word: 'PERRO', emoji: '🐶', hint: 'Animal que dice guau' },
            { word: 'PEZ', emoji: '🐟', hint: 'Animal que vive en el agua' },
            { word: 'PAJARO', emoji: '🐦', hint: 'Animal que vuela' },
            { word: 'OSO', emoji: '🐻', hint: 'Animal grande y peludo' },
            { word: 'LEON', emoji: '🦁', hint: 'Rey de la selva' },
            { word: 'CONEJO', emoji: '🐰', hint: 'Animal con orejas largas' },
            { word: 'ELEFANTE', emoji: '🐘', hint: 'Animal con trompa' },
            { word: 'MARIPOSA', emoji: '🦋', hint: 'Insecto con alas coloridas' },
            { word: 'VACA', emoji: '🐮', hint: 'Animal que da leche' }
        ],
        en: [
            { word: 'CAT', emoji: '🐱', hint: 'Animal that says meow' },
            { word: 'DOG', emoji: '🐶', hint: 'Animal that says woof' },
            { word: 'FISH', emoji: '🐟', hint: 'Animal that lives in water' },
            { word: 'BIRD', emoji: '🐦', hint: 'Animal that flies' },
            { word: 'BEAR', emoji: '🐻', hint: 'Big and furry animal' },
            { word: 'LION', emoji: '🦁', hint: 'King of the jungle' },
            { word: 'RABBIT', emoji: '🐰', hint: 'Animal with long ears' },
            { word: 'ELEPHANT', emoji: '🐘', hint: 'Animal with a trunk' },
            { word: 'BUTTERFLY', emoji: '🦋', hint: 'Insect with colorful wings' },
            { word: 'COW', emoji: '🐮', hint: 'Animal that gives milk' }
        ]
    },
    family: {
        es: [
            { word: 'MAMA', emoji: '👩', hint: 'Tu mamá te quiere mucho' },
            { word: 'PAPA', emoji: '👨', hint: 'Tu papá te cuida' },
            { word: 'BEBE', emoji: '👶', hint: 'Un niño pequeño' },
            { word: 'HERMANO', emoji: '👦', hint: 'Hijo de tus papás' },
            { word: 'HERMANA', emoji: '👧', hint: 'Hija de tus papás' },
            { word: 'ABUELA', emoji: '👵', hint: 'Mamá de tu mamá o papá' },
            { word: 'ABUELO', emoji: '👴', hint: 'Papá de tu mamá o papá' },
            { word: 'TIO', emoji: '🧔', hint: 'Hermano de tu mamá o papá' },
            { word: 'TIA', emoji: '👩', hint: 'Hermana de tu mamá o papá' },
            { word: 'PRIMO', emoji: '👦', hint: 'Hijo de tu tío o tía' }
        ],
        en: [
            { word: 'MOM', emoji: '👩', hint: 'Your mother loves you' },
            { word: 'DAD', emoji: '👨', hint: 'Your father takes care of you' },
            { word: 'BABY', emoji: '👶', hint: 'A little child' },
            { word: 'BROTHER', emoji: '👦', hint: 'Son of your parents' },
            { word: 'SISTER', emoji: '👧', hint: 'Daughter of your parents' },
            { word: 'GRANDMA', emoji: '👵', hint: 'Mother of your mom or dad' },
            { word: 'GRANDPA', emoji: '👴', hint: 'Father of your mom or dad' },
            { word: 'UNCLE', emoji: '🧔', hint: 'Brother of your mom or dad' },
            { word: 'AUNT', emoji: '👩', hint: 'Sister of your mom or dad' },
            { word: 'COUSIN', emoji: '👦', hint: 'Child of your uncle or aunt' }
        ]
    },
    colors: {
        es: [
            { word: 'ROJO', emoji: '🔴', hint: 'Color de la manzana' },
            { word: 'AZUL', emoji: '🔵', hint: 'Color del cielo' },
            { word: 'VERDE', emoji: '🟢', hint: 'Color de la hierba' },
            { word: 'AMARILLO', emoji: '🟡', hint: 'Color del sol' },
            { word: 'ROSA', emoji: '🩷', hint: 'Color de las flores' },
            { word: 'MORADO', emoji: '🟣', hint: 'Color de las uvas' },
            { word: 'NEGRO', emoji: '⚫', hint: 'Color de la noche' },
            { word: 'BLANCO', emoji: '⚪', hint: 'Color de la nieve' },
            { word: 'NARANJA', emoji: '🟠', hint: 'Color de la naranja' },
            { word: 'CAFE', emoji: '🟤', hint: 'Color del chocolate' }
        ],
        en: [
            { word: 'RED', emoji: '🔴', hint: 'Color of an apple' },
            { word: 'BLUE', emoji: '🔵', hint: 'Color of the sky' },
            { word: 'GREEN', emoji: '🟢', hint: 'Color of grass' },
            { word: 'YELLOW', emoji: '🟡', hint: 'Color of the sun' },
            { word: 'PINK', emoji: '🩷', hint: 'Color of flowers' },
            { word: 'PURPLE', emoji: '🟣', hint: 'Color of grapes' },
            { word: 'BLACK', emoji: '⚫', hint: 'Color of night' },
            { word: 'WHITE', emoji: '⚪', hint: 'Color of snow' },
            { word: 'ORANGE', emoji: '🟠', hint: 'Color of an orange' },
            { word: 'BROWN', emoji: '🟤', hint: 'Color of chocolate' }
        ]
    },
    food: {
        es: [
            { word: 'MANZANA', emoji: '🍎', hint: 'Fruta roja y deliciosa' },
            { word: 'LECHE', emoji: '🥛', hint: 'Bebida blanca' },
            { word: 'PAN', emoji: '🍞', hint: 'Lo comes en el desayuno' },
            { word: 'AGUA', emoji: '💧', hint: 'Bebida transparente' },
            { word: 'HUEVO', emoji: '🥚', hint: 'Lo ponen las gallinas' },
            { word: 'QUESO', emoji: '🧀', hint: 'Producto de la leche' },
            { word: 'PIZZA', emoji: '🍕', hint: 'Comida redonda con queso' },
            { word: 'HELADO', emoji: '🍦', hint: 'Postre frío y dulce' },
            { word: 'UVA', emoji: '🍇', hint: 'Fruta pequeña y morada' },
            { word: 'PLATANO', emoji: '🍌', hint: 'Fruta amarilla y larga' }
        ],
        en: [
            { word: 'APPLE', emoji: '🍎', hint: 'Red and delicious fruit' },
            { word: 'MILK', emoji: '🥛', hint: 'White drink' },
            { word: 'BREAD', emoji: '🍞', hint: 'You eat it for breakfast' },
            { word: 'WATER', emoji: '💧', hint: 'Transparent drink' },
            { word: 'EGG', emoji: '🥚', hint: 'Laid by chickens' },
            { word: 'CHEESE', emoji: '🧀', hint: 'Made from milk' },
            { word: 'PIZZA', emoji: '🍕', hint: 'Round food with cheese' },
            { word: 'ICE CREAM', emoji: '🍦', hint: 'Cold and sweet dessert' },
            { word: 'GRAPE', emoji: '🍇', hint: 'Small purple fruit' },
            { word: 'BANANA', emoji: '🍌', hint: 'Yellow and long fruit' }
        ]
    },
    objects: {
        es: [
            { word: 'CASA', emoji: '🏠', hint: 'Donde vives' },
            { word: 'SILLA', emoji: '🪑', hint: 'Te sientas en ella' },
            { word: 'MESA', emoji: '🍽️', hint: 'Pones la comida aquí' },
            { word: 'PUERTA', emoji: '🚪', hint: 'Entras por aquí' },
            { word: 'VENTANA', emoji: '🪟', hint: 'Entra la luz' },
            { word: 'LAPIZ', emoji: '✏️', hint: 'Escribes con esto' },
            { word: 'LIBRO', emoji: '📚', hint: 'Tiene historias' },
            { word: 'PELOTA', emoji: '⚽', hint: 'Juegas con ella' },
            { word: 'RELOJ', emoji: '⏰', hint: 'Te dice la hora' },
            { word: 'LUZ', emoji: '💡', hint: 'Ilumina la habitación' }
        ],
        en: [
            { word: 'HOUSE', emoji: '🏠', hint: 'Where you live' },
            { word: 'CHAIR', emoji: '🪑', hint: 'You sit on it' },
            { word: 'TABLE', emoji: '🍽️', hint: 'You put food here' },
            { word: 'DOOR', emoji: '🚪', hint: 'You enter through here' },
            { word: 'WINDOW', emoji: '🪟', hint: 'Light comes through' },
            { word: 'PENCIL', emoji: '✏️', hint: 'You write with this' },
            { word: 'BOOK', emoji: '📚', hint: 'Has stories inside' },
            { word: 'BALL', emoji: '⚽', hint: 'You play with it' },
            { word: 'CLOCK', emoji: '⏰', hint: 'Tells you the time' },
            { word: 'LIGHT', emoji: '💡', hint: 'Illuminates the room' }
        ]
    }
};

let ah_gameState = {
    currentWord: '',
    guessedLetters: [],
    wrongLetters: [],
    lives: 10,
    maxLives: 10,
    score: 0,
    wins: 0,
    wordsPlayed: 0,
    language: 'es',
    category: 'animals',
    soundEnabled: true,
    isPlaying: false
};

const ah_ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let ah_audioCtx = null;

function ah_initAudio() {
    if (!ah_audioCtx) {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            ah_audioCtx = new AudioContext();
        } catch(e) { console.log('Audio no soportado'); }
    }
}

function ah_playSound(type) {
    if (!ah_gameState.soundEnabled || !ah_audioCtx) return;
    
    try {
        const osc = ah_audioCtx.createOscillator();
        const gain = ah_audioCtx.createGain();
        osc.connect(gain);
        gain.connect(ah_audioCtx.destination);
        gain.gain.value = 0.3;

        switch(type) {
            case 'correct':
                osc.frequency.value = 523;
                setTimeout(() => osc.frequency.value = 659, 100);
                setTimeout(() => osc.frequency.value = 784, 200);
                gain.gain.exponentialRampToValueAtTime(0.01, ah_audioCtx.currentTime + 0.4);
                osc.start();
                osc.stop(ah_audioCtx.currentTime + 0.4);
                break;
            case 'wrong':
                osc.frequency.value = 200;
                setTimeout(() => osc.frequency.value = 150, 150);
                gain.gain.exponentialRampToValueAtTime(0.01, ah_audioCtx.currentTime + 0.3);
                osc.start();
                osc.stop(ah_audioCtx.currentTime + 0.3);
                break;
            case 'win':
                [523, 659, 784, 1047].forEach((freq, i) => {
                    setTimeout(() => {
                        const o = ah_audioCtx.createOscillator();
                        const g = ah_audioCtx.createGain();
                        o.connect(g);
                        g.connect(ah_audioCtx.destination);
                        o.frequency.value = freq;
                        g.gain.value = 0.3;
                        g.gain.exponentialRampToValueAtTime(0.01, ah_audioCtx.currentTime + 0.3);
                        o.start();
                        o.stop(ah_audioCtx.currentTime + 0.3);
                    }, i * 150);
                });
                break;
            case 'lose':
                [400, 350, 300, 250].forEach((freq, i) => {
                    setTimeout(() => {
                        const o = ah_audioCtx.createOscillator();
                        const g = ah_audioCtx.createGain();
                        o.connect(g);
                        g.connect(ah_audioCtx.destination);
                        o.frequency.value = freq;
                        g.gain.value = 0.3;
                        g.gain.exponentialRampToValueAtTime(0.01, ah_audioCtx.currentTime + 0.4);
                        o.start();
                        o.stop(ah_audioCtx.currentTime + 0.4);
                    }, i * 300);
                });
                break;
        }
    } catch(e) {}
}

function ah_speakWord(word, lang) {
    if (!ah_gameState.soundEnabled) return;
    try {
        const synth = window.speechSynthesis;
        synth.cancel();
        const utter = new SpeechSynthesisUtterance(word);
        utter.lang = lang === 'en' ? 'en-US' : 'es-ES';
        utter.rate = 0.7;
        synth.speak(utter);
    } catch(e) {}
}

function ah_toggleSound() {
    ah_gameState.soundEnabled = !ah_gameState.soundEnabled;
    const btn = document.getElementById('ah_soundToggle');
    if (btn) btn.textContent = ah_gameState.soundEnabled ? '🔊' : '🔇';
}

function ah_createParticles(x, y, color) {
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

function ah_createConfetti() {
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

function ah_buildKeyboard() {
    const keyboard = document.getElementById('ah_keyboard');
    if (!keyboard) return;
    keyboard.innerHTML = '';
    const rows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
    const colors = ['#FF6B9D', '#FFC312', '#12CBC4', '#B53471', '#6C5CE7', '#00D2D3', '#FF9F43', '#54a0ff', '#5f27cd', '#10ac84'];

    rows.forEach((row, rowIndex) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'keyboard-row';
        row.split('').forEach((letter, index) => {
            const btn = document.createElement('button');
            btn.className = 'key-btn';
            btn.textContent = letter;
            btn.dataset.letter = letter;
            btn.style.background = colors[(rowIndex * 10 + index) % colors.length];
            btn.onclick = () => ah_handleKeyPress(letter);
            rowDiv.appendChild(btn);
        });
        keyboard.appendChild(rowDiv);
    });
}

function ah_setLanguage(lang) {
    ah_gameState.language = lang;
    document.querySelectorAll('#ahorcado-app .lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    ah_nextWord();
}

function ah_setCategory(cat) {
    ah_gameState.category = cat;
    document.querySelectorAll('#ahorcado-app .category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.cat === cat);
    });
    ah_nextWord();
}

function ah_getRandomWord() {
    let pool = [];
    if (ah_gameState.category === 'mixed') {
        Object.keys(ah_WORDS).forEach(cat => {
            if (ah_WORDS[cat][ah_gameState.language]) {
                pool.push(...ah_WORDS[cat][ah_gameState.language]);
            }
        });
    } else {
        pool = ah_WORDS[ah_gameState.category][ah_gameState.language] || [];
    }
    if (pool.length === 0) pool = ah_WORDS.animals[ah_gameState.language];
    return pool[Math.floor(Math.random() * pool.length)];
}

function ah_nextWord() {
    ah_initAudio();

    const winOverlay = document.getElementById('ah_winOverlay');
    const loseOverlay = document.getElementById('ah_loseOverlay');
    if (winOverlay) winOverlay.classList.remove('show');
    if (loseOverlay) loseOverlay.classList.remove('show');

    ah_gameState.guessedLetters = [];
    ah_gameState.wrongLetters = [];
    ah_gameState.lives = ah_gameState.maxLives;
    ah_gameState.isPlaying = true;

    const wordData = ah_getRandomWord();
    ah_gameState.currentWord = wordData.word;
    ah_gameState.wordsPlayed++;

    const hintEmoji = document.getElementById('ah_hintEmoji');
    const hintText = document.getElementById('ah_hintText');
    if (hintEmoji) hintEmoji.textContent = wordData.emoji;
    if (hintText) hintText.textContent = wordData.hint;

    ah_buildWordSlots();
    ah_resetHangman();
    ah_buildKeyboard();
    ah_updateUI();

    setTimeout(() => {
        ah_speakWord(wordData.hint, ah_gameState.language);
    }, 500);
}

function ah_buildWordSlots() {
    const slots = document.getElementById('ah_wordSlots');
    if (!slots) return;
    slots.innerHTML = '';
    const word = ah_gameState.currentWord;

    for (let i = 0; i < word.length; i++) {
        const char = word[i];
        if (char === ' ') {
            const space = document.createElement('div');
            space.className = 'letter-slot space';
            slots.appendChild(space);
        } else {
            const slot = document.createElement('div');
            slot.className = 'letter-slot';
            slot.id = `ah_slot-${i}`;
            if (ah_gameState.guessedLetters.includes(char)) {
                slot.textContent = char;
                slot.classList.add('filled');
            }
            slots.appendChild(slot);
        }
    }
}

function ah_resetHangman() {
    for (let i = 0; i < 10; i++) {
        const part = document.getElementById(`ah_part${i}`);
        if (part) part.classList.remove('show');
    }
}

function ah_updateHangman() {
    const wrongCount = ah_gameState.wrongLetters.length;
    for (let i = 0; i < wrongCount && i < 10; i++) {
        const part = document.getElementById(`ah_part${i}`);
        if (part) part.classList.add('show');
    }
}

function ah_handleKeyPress(letter) {
    if (!ah_gameState.isPlaying) return;
    if (ah_gameState.guessedLetters.includes(letter) || ah_gameState.wrongLetters.includes(letter)) return;

    const word = ah_gameState.currentWord;
    const btn = document.querySelector(`#ahorcado-app .key-btn[data-letter="${letter}"]`);

    if (word.includes(letter)) {
        ah_gameState.guessedLetters.push(letter);
        for (let i = 0; i < word.length; i++) {
            if (word[i] === letter) {
                const slot = document.getElementById(`ah_slot-${i}`);
                if (slot) {
                    slot.textContent = letter;
                    slot.classList.add('filled');
                }
            }
        }
        if (btn) {
            btn.classList.add('correct');
            const rect = btn.getBoundingClientRect();
            ah_createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, '#2ecc71');
        }
        ah_playSound('correct');
        ah_checkWin();
    } else {
        ah_gameState.wrongLetters.push(letter);
        ah_gameState.lives--;
        if (btn) {
            btn.classList.add('wrong');
            const rect = btn.getBoundingClientRect();
            ah_createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, '#e74c3c');
        }
        ah_playSound('wrong');
        ah_updateHangman();
        if (ah_gameState.lives <= 0) {
            ah_gameState.isPlaying = false;
            ah_playSound('lose');
            setTimeout(() => {
                const loseWord = document.getElementById('ah_loseWord');
                const loseOverlay = document.getElementById('ah_loseOverlay');
                if (loseWord) loseWord.textContent = ah_gameState.currentWord;
                if (loseOverlay) loseOverlay.classList.add('show');
            }, 1000);
        }
    }
    ah_updateUI();
}

function ah_checkWin() {
    const word = ah_gameState.currentWord.replace(/ /g, '');
    const uniqueLetters = [...new Set(word.split(''))];
    const allGuessed = uniqueLetters.every(letter => ah_gameState.guessedLetters.includes(letter));

    if (allGuessed) {
        ah_gameState.isPlaying = false;
        ah_gameState.wins++;
        const pointsEarned = (ah_gameState.lives * 100) + 500;
        ah_gameState.score += pointsEarned;
        
        // Actualizar en gameCore
        if (window.gameCore) {
            window.gameCore.updateGameStats('ahorcado', pointsEarned, ah_gameState.wordsPlayed, true);
        }
        
        ah_playSound('win');
        ah_createConfetti();
        ah_speakWord(ah_gameState.currentWord, ah_gameState.language);
        
        setTimeout(() => {
            const winWord = document.getElementById('ah_winWord');
            const winOverlay = document.getElementById('ah_winOverlay');
            if (winWord) winWord.textContent = ah_gameState.currentWord;
            if (winOverlay) winOverlay.classList.add('show');
        }, 800);
    }
}

function ah_updateUI() {
    const scoreEl = document.getElementById('ah_score');
    const winsEl = document.getElementById('ah_wins');
    const wordsCountEl = document.getElementById('ah_wordsCount');
    const heartsEl = document.getElementById('ah_hearts');
    const livesTextEl = document.getElementById('ah_livesText');
    
    if (scoreEl) scoreEl.textContent = ah_gameState.score;
    if (winsEl) winsEl.textContent = ah_gameState.wins;
    if (wordsCountEl) wordsCountEl.textContent = ah_gameState.wordsPlayed;
    
    if (heartsEl) {
        const hearts = '❤️'.repeat(Math.max(0, ah_gameState.lives)) + '💔'.repeat(Math.max(0, ah_gameState.maxLives - ah_gameState.lives));
        heartsEl.textContent = hearts;
    }
    if (livesTextEl) livesTextEl.textContent = `${ah_gameState.lives} intentos restantes`;
}

// Inicializar
if (document.getElementById('ah_keyboard')) {
    ah_buildKeyboard();
}

document.addEventListener('keydown', (e) => {
    if (document.getElementById('ahorcado-app') && document.getElementById('ahorcado-app').style.display === 'block') {
        const letter = e.key.toUpperCase();
        if (ah_ALFABETO.includes(letter)) {
            ah_handleKeyPress(letter);
        }
    }
});
