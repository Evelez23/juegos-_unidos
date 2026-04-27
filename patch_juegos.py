import os
import re

file_path = r"c:\Users\elmer\Downloads\juegos aurora\juegos_unidos.html"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Insert CSS
css_to_insert = """
        /* ==================== LLUVIA DE LETRAS ==================== */
        #lluvia-app { display: none; }
        .ll-area { position: relative; width: 100%; max-width: 700px; height: 500px; background: rgba(26,26,46,0.8); border-radius: 20px; overflow: hidden; border: 2px solid rgba(255,255,255,0.1); margin-top: 20px; box-shadow: inset 0 0 50px rgba(0,0,0,0.5); }
        .ll-falling { position: absolute; font-family: 'Fredoka One', cursive; cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 50%; box-shadow: 0 5px 15px rgba(0,0,0,0.3); transition: transform 0.1s; user-select: none; }
        .ll-falling:hover { transform: scale(1.1); }
        .ll-falling.letter { width: 50px; height: 50px; font-size: 2rem; background: linear-gradient(135deg, var(--accent4), var(--accent2)); color: white; }
        .ll-falling.target { background: linear-gradient(135deg, var(--primary), var(--accent1)); }
        .ll-falling.heart { width: 45px; height: 45px; font-size: 1.8rem; background: #e74c3c; border: 2px solid white; }
        .ll-falling.bomb { width: 50px; height: 50px; font-size: 2rem; background: #333; border: 2px solid #e74c3c; animation: bombPulse 0.5s infinite alternate; }
        @keyframes bombPulse { from { box-shadow: 0 0 10px #e74c3c; } to { box-shadow: 0 0 30px #e74c3c; } }
        .ll-target-display { font-size: 2rem; color: var(--accent1); text-align: center; margin-top: 10px; font-family: 'Fredoka One', cursive; }
        
        /* ==================== PALABRAS ESCONDIDAS ==================== */
        #palabras-app { display: none; }
        .pe-word-area { display: flex; justify-content: center; gap: 10px; margin: 30px 0; min-height: 70px; }
        .pe-slot { width: 60px; height: 70px; border: 3px dashed rgba(255,255,255,0.3); border-radius: 15px; display: flex; align-items: center; justify-content: center; font-family: 'Fredoka One', cursive; font-size: 2.5rem; color: white; cursor: pointer; background: rgba(0,0,0,0.2); }
        .pe-slot.filled { border-style: solid; border-color: var(--accent2); background: linear-gradient(135deg, var(--card), #1e2a4a); animation: popIn 0.3s ease-out; }
        @keyframes popIn { 0% { transform: scale(0); } 70% { transform: scale(1.2); } 100% { transform: scale(1); } }
        .pe-letters-area { display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; margin-bottom: 30px; }
        .pe-letter-btn { width: 60px; height: 70px; border-radius: 15px; background: linear-gradient(135deg, var(--primary), var(--secondary)); border: none; font-family: 'Fredoka One', cursive; font-size: 2.5rem; color: white; cursor: pointer; box-shadow: 0 5px 15px rgba(0,0,0,0.3); transition: all 0.2s; }
        .pe-letter-btn:hover { transform: translateY(-5px) scale(1.1); box-shadow: 0 10px 20px rgba(0,0,0,0.4); }
        .pe-letter-btn.hidden { opacity: 0; pointer-events: none; }
        .pe-prizes { margin-top: 20px; text-align: center; background: rgba(255,255,255,0.05); padding: 20px; border-radius: 20px; }
        .pe-prizes h3 { color: var(--accent1); margin-bottom: 10px; font-family: 'Fredoka One', cursive; }
        .pe-prize-list { display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; font-size: 3rem; }
        .pe-prize-item { animation: bounce 2s infinite; position: relative; }
        .pe-prize-item span { font-size: 0.8rem; display: block; color: #aaa; text-align: center; margin-top: 5px; font-family: 'Nunito', sans-serif; }
"""

if "/* ==================== LLUVIA DE LETRAS ==================== */" not in content:
    content = content.replace("</style>", css_to_insert + "\n    </style>")


# 2. Insert Menu Cards
menu_cards = """
            <div class="game-card" onclick="openGame('lluvia')">
                <span class="emoji">☔</span>
                <h3>Lluvia de Letras</h3>
                <p>Atrapa las letras correctas que caen del cielo. ¡Cuidado con las bombas!</p>
            </div>
            
            <div class="game-card" onclick="openGame('palabras')">
                <span class="emoji">🧩</span>
                <h3>Palabras Escondidas</h3>
                <p>Ordena las letras para formar la palabra y colecciona premios mágicos.</p>
            </div>
"""
if "Lluvia de Letras" not in content:
    content = content.replace("</div>\n    </div>\n\n    <!-- Ahorcado Container -->", menu_cards + "\n        </div>\n    </div>\n\n    <!-- Ahorcado Container -->")

# 3. Insert App Containers
html_apps = """
    <!-- Lluvia de Letras Container -->
    <div id="lluvia-app">
        <div class="game-container">
            <div class="header">
                <h1>☔ Lluvia de Letras</h1>
                <p class="subtitle">Atrapa la letra correcta</p>
            </div>
            <div class="score-board">
                <div class="score-item"><span class="icon">⭐</span><div><div class="label">Puntos</div><div class="value" id="ll_score">0</div></div></div>
                <div class="score-item"><span class="icon">❤️</span><div><div class="label">Vidas</div><div class="value" id="ll_lives">3</div></div></div>
                <div class="score-item"><span class="icon">🎯</span><div><div class="label">Nivel</div><div class="value" id="ll_level">1</div></div></div>
            </div>
            <div class="ll-target-display">Atrapa la letra: <span id="ll_targetLetter" style="font-size: 3rem;">A</span></div>
            <div class="ll-area" id="ll_area"></div>
        </div>
        
        <div class="game-over" id="ll_gameOver">
            <div class="trophy">☔</div>
            <h2>¡Juego Terminado!</h2>
            <p class="final-score">Puntuación: <span id="ll_finalScore">0</span></p>
            <p class="final-score">Nivel alcanzado: <span id="ll_finalLevel">1</span></p>
            <button class="restart-btn" onclick="ll_startGame()">¡Jugar de Nuevo! 🎮</button>
        </div>
    </div>

    <!-- Palabras Escondidas Container -->
    <div id="palabras-app">
        <div class="game-container">
            <div class="header">
                <h1>🧩 Palabras Escondidas</h1>
                <p class="subtitle">Ordena las letras</p>
            </div>
            <div class="score-board">
                <div class="score-item"><span class="icon">⭐</span><div><div class="label">Puntos</div><div class="value" id="pe_score">0</div></div></div>
                <div class="score-item"><span class="icon">🎯</span><div><div class="label">Nivel</div><div class="value" id="pe_level">1</div></div></div>
            </div>
            
            <div class="game-area">
                <div class="word-display" style="background: none; border: none; box-shadow: none;">
                    <div class="hint" id="pe_hint" style="font-size: 4rem; margin-bottom: 20px;">🚗</div>
                    <div class="pe-word-area" id="pe_wordSlots"></div>
                </div>
                <div class="pe-letters-area" id="pe_lettersArea"></div>
            </div>
            
            <div class="pe-prizes">
                <h3>Colección de Premios Mágicos 🎁</h3>
                <div class="pe-prize-list" id="pe_prizeList"></div>
            </div>
        </div>
        
        <div class="result-overlay" id="pe_winOverlay">
            <div class="emoji" id="pe_winEmoji">🎉</div>
            <h2 id="pe_winTitle">¡EXCELENTE!</h2>
            <p class="word-reveal" id="pe_prizeMsg" style="display: none;">¡Ganaste un nuevo premio!</p>
            <button class="restart-btn" onclick="pe_nextWord()">Siguiente Palabra 🚀</button>
        </div>
    </div>
"""
if "Lluvia de Letras Container" not in content:
    content = content.replace("<!-- Ahorcado Container -->", html_apps + "\n    <!-- Ahorcado Container -->")

# 4. Modify main JS
if "document.getElementById('lluvia-app').style.display = 'none';" not in content:
    content = content.replace("document.getElementById('alfabeto-app').style.display = 'none';", "document.getElementById('alfabeto-app').style.display = 'none';\n            document.getElementById('lluvia-app').style.display = 'none';\n            document.getElementById('palabras-app').style.display = 'none';")

if "else if (game === 'lluvia')" not in content:
    content = content.replace("} else {", """} else if (game === 'lluvia') {
                document.getElementById('lluvia-app').style.display = 'block';
                ll_startGame();
            } else if (game === 'palabras') {
                document.getElementById('palabras-app').style.display = 'block';
                pe_startGame();
            } else {""")

# 5. Insert Games JS
js_to_insert = """
        // ==================== LLUVIA DE LETRAS JS ====================
        let ll_state = { score: 0, lives: 3, level: 1, target: '', isPlaying: false, items: [], speed: 2, spawnRate: 1500, correctCount: 0 };
        const ll_letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let ll_gameLoop, ll_spawnTimer;
        
        function ll_startGame() {
            document.getElementById('ll_gameOver').classList.remove('show');
            ll_state = { score: 0, lives: 3, level: 1, target: '', isPlaying: true, items: [], speed: 2, spawnRate: 1500, correctCount: 0 };
            document.getElementById('ll_area').innerHTML = '';
            ll_updateUI();
            ll_nextTarget();
            if(ll_gameLoop) cancelAnimationFrame(ll_gameLoop);
            if(ll_spawnTimer) clearTimeout(ll_spawnTimer);
            ll_loop();
            ll_scheduleSpawn();
        }
        
        function ll_nextTarget() {
            ll_state.target = ll_letters[Math.floor(Math.random() * ll_letters.length)];
            document.getElementById('ll_targetLetter').textContent = ll_state.target;
            if (ah_audioCtx) ah_speakWord(ll_state.target, 'es'); // voice saying the letter
        }
        
        function ll_scheduleSpawn() {
            if(!ll_state.isPlaying) return;
            ll_spawnItem();
            ll_spawnTimer = setTimeout(ll_scheduleSpawn, ll_state.spawnRate);
        }
        
        function ll_spawnItem() {
            let type = 'letter';
            let val = ll_letters[Math.floor(Math.random() * ll_letters.length)];
            
            let r = Math.random();
            if (r < 0.2) val = ll_state.target; // 20% chance target
            else if (r < 0.3 && ll_state.lives < 3) type = 'heart'; // 10% heart
            else if (r < 0.45 && ll_state.level >= 3) type = 'bomb'; // 15% bomb on lvl 3+
            
            let el = document.createElement('div');
            el.className = 'll-falling ' + type;
            if(type === 'letter') {
                el.textContent = val;
                if(val === ll_state.target && Math.random()>0.5) el.classList.add('target');
            }
            else if(type === 'heart') el.textContent = '❤️';
            else if(type === 'bomb') el.textContent = '💣';
            
            let w = document.getElementById('ll_area').clientWidth;
            let x = Math.random() * (w - 60);
            el.style.left = x + 'px';
            el.style.top = '-60px';
            
            el.onclick = () => ll_handleClick(el, type, val);
            document.getElementById('ll_area').appendChild(el);
            ll_state.items.push({ el: el, y: -60, type: type, val: val });
        }
        
        function ll_handleClick(el, type, val) {
            if(!ll_state.isPlaying) return;
            if(type === 'letter' && val === ll_state.target) {
                ll_state.score += 10;
                ll_state.correctCount++;
                if(ah_audioCtx) ah_playSound('correct');
                el.remove();
                ll_removeItem(el);
                if(ll_state.correctCount >= 5) {
                    ll_state.level++;
                    ll_state.correctCount = 0;
                    ll_state.speed += 0.5;
                    ll_state.spawnRate = Math.max(500, ll_state.spawnRate - 150);
                    if(ah_audioCtx) ah_playSound('levelup');
                    al_showComboText(el.offsetLeft, el.offsetTop, "¡NIVEL " + ll_state.level + "!");
                }
                ll_nextTarget();
            } else if (type === 'heart') {
                ll_state.lives = Math.min(3, ll_state.lives + 1);
                if(ah_audioCtx) ah_playSound('streak');
                el.remove();
                ll_removeItem(el);
            } else if (type === 'bomb') {
                ll_state.lives--;
                if(ah_audioCtx) ah_playSound('wrong');
                el.remove();
                ll_removeItem(el);
                if(ll_state.lives <= 0) ll_endGame();
            } else {
                if(ah_audioCtx) ah_playSound('wrong');
                el.style.opacity = '0.5';
            }
            ll_updateUI();
        }
        
        function ll_removeItem(el) {
            ll_state.items = ll_state.items.filter(i => i.el !== el);
        }
        
        function ll_loop() {
            if(!ll_state.isPlaying) return;
            let h = document.getElementById('ll_area').clientHeight;
            for(let i=ll_state.items.length-1; i>=0; i--) {
                let item = ll_state.items[i];
                item.y += ll_state.speed;
                item.el.style.top = item.y + 'px';
                if(item.y > h) {
                    item.el.remove();
                    ll_state.items.splice(i, 1);
                    if(item.type === 'letter' && item.val === ll_state.target) {
                        ll_state.lives--;
                        if(ah_audioCtx) ah_playSound('wrong');
                        ll_updateUI();
                        if(ll_state.lives <= 0) { ll_endGame(); break; }
                        ll_nextTarget();
                    }
                }
            }
            ll_gameLoop = requestAnimationFrame(ll_loop);
        }
        
        function ll_updateUI() {
            document.getElementById('ll_score').textContent = ll_state.score;
            document.getElementById('ll_level').textContent = ll_state.level;
            document.getElementById('ll_lives').textContent = ll_state.lives;
        }
        
        function ll_endGame() {
            ll_state.isPlaying = false;
            if(ah_audioCtx) ah_playSound('gameover');
            document.getElementById('ll_finalScore').textContent = ll_state.score;
            document.getElementById('ll_finalLevel').textContent = ll_state.level;
            document.getElementById('ll_gameOver').classList.add('show');
        }

        // ==================== PALABRAS ESCONDIDAS JS ====================
        const pe_WORDS = [
            { w: 'CARRO', e: '🚗' }, { w: 'PERRO', e: '🐶' }, { w: 'GATO', e: '🐱' },
            { w: 'CASA', e: '🏠' }, { w: 'FLOR', e: '🌸' }, { w: 'SOL', e: '☀️' },
            { w: 'LUNA', e: '🌙' }, { w: 'ARBOL', e: '🌳' }, { w: 'MESA', e: '🪑' }
        ];
        const pe_PRIZES = [
            { e: '🦄', n: 'Unicornio Mágico' }, { e: '🦥🩷', n: 'Oso Perezoso Rosa' }, { e: '🐹', n: 'Capibara' },
            { e: '🐉', n: 'Dragón Bebé' }, { e: '🧜‍♀️', n: 'Sirena' }, { e: '🦖', n: 'Dinosaurio' }
        ];
        let pe_state = { score: 0, level: 1, currentWord: '', letters: [], slots: [], prizes: [] };
        
        function pe_startGame() {
            pe_state = { score: 0, level: 1, currentWord: '', letters: [], slots: [], prizes: [] };
            pe_updatePrizes();
            pe_nextWord();
        }
        
        function pe_nextWord() {
            document.getElementById('pe_winOverlay').classList.remove('show');
            document.getElementById('pe_prizeMsg').style.display = 'none';
            let wordObj = pe_WORDS[Math.floor(Math.random() * pe_WORDS.length)];
            pe_state.currentWord = wordObj.w;
            document.getElementById('pe_hint').textContent = wordObj.e;
            if(ah_audioCtx) ah_speakWord(wordObj.w, 'es');
            
            pe_state.slots = new Array(wordObj.w.length).fill('');
            pe_state.letters = wordObj.w.split('').sort(() => Math.random() - 0.5);
            
            pe_render();
        }
        
        function pe_render() {
            let slotsDiv = document.getElementById('pe_wordSlots');
            slotsDiv.innerHTML = '';
            pe_state.slots.forEach((val, i) => {
                let div = document.createElement('div');
                div.className = 'pe-slot' + (val ? ' filled' : '');
                div.textContent = val;
                if(val) div.onclick = () => pe_slotClick(i);
                slotsDiv.appendChild(div);
            });
            
            let lettersDiv = document.getElementById('pe_lettersArea');
            lettersDiv.innerHTML = '';
            pe_state.letters.forEach((val, i) => {
                let btn = document.createElement('button');
                btn.className = 'pe-letter-btn' + (val === null ? ' hidden' : '');
                btn.textContent = val;
                if(val !== null) btn.onclick = () => pe_letterClick(i);
                lettersDiv.appendChild(btn);
            });
            
            document.getElementById('pe_score').textContent = pe_state.score;
            document.getElementById('pe_level').textContent = pe_state.level;
        }
        
        function pe_letterClick(idx) {
            let val = pe_state.letters[idx];
            let emptyIdx = pe_state.slots.indexOf('');
            if(emptyIdx !== -1) {
                pe_state.slots[emptyIdx] = val;
                pe_state.letters[idx] = null;
                if(ah_audioCtx) ah_playSound('correct');
                pe_render();
                pe_checkWin();
            }
        }
        
        function pe_slotClick(idx) {
            let val = pe_state.slots[idx];
            if(val) {
                let emptyIdx = pe_state.letters.indexOf(null);
                if(emptyIdx !== -1) {
                    pe_state.letters[emptyIdx] = val;
                    pe_state.slots[idx] = '';
                    if(ah_audioCtx) ah_playSound('wrong');
                    pe_render();
                }
            }
        }
        
        function pe_checkWin() {
            if(!pe_state.slots.includes('')) {
                let formed = pe_state.slots.join('');
                if(formed === pe_state.currentWord) {
                    pe_state.score += 50;
                    pe_state.level++;
                    if(ah_audioCtx) ah_playSound('win');
                    al_createConfetti();
                    
                    let gotPrize = false;
                    if(pe_state.level % 3 === 0 && pe_state.prizes.length < pe_PRIZES.length) {
                        pe_state.prizes.push(pe_PRIZES[pe_state.prizes.length]);
                        pe_updatePrizes();
                        gotPrize = true;
                    }
                    
                    setTimeout(() => {
                        document.getElementById('pe_winTitle').textContent = '¡Palabra Correcta!';
                        if(gotPrize) {
                            document.getElementById('pe_prizeMsg').style.display = 'block';
                            document.getElementById('pe_prizeMsg').textContent = '¡Ganaste un nuevo premio: ' + pe_state.prizes[pe_state.prizes.length-1].n + '!';
                        }
                        document.getElementById('pe_winOverlay').classList.add('show');
                    }, 500);
                } else {
                    if(ah_audioCtx) ah_playSound('wrong');
                    // Shake animation
                    document.getElementById('pe_wordSlots').style.animation = 'wrongAnim 0.5s';
                    setTimeout(() => document.getElementById('pe_wordSlots').style.animation = '', 500);
                }
            }
        }
        
        function pe_updatePrizes() {
            let list = document.getElementById('pe_prizeList');
            list.innerHTML = '';
            pe_state.prizes.forEach(p => {
                let d = document.createElement('div');
                d.className = 'pe-prize-item';
                d.innerHTML = p.e + '<span>' + p.n + '</span>';
                list.appendChild(d);
            });
        }
"""
if "pe_WORDS" not in content:
    content = content.replace("// --- ALFABETO JS ---", js_to_insert + "\n\n        // --- ALFABETO JS ---")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("juegos_unidos.html patched successfully.")
