// ==================== LLUVIA DE LETRAS ====================

let ll_state = { target: '', isPlaying: false, items: [], speed: 2, spawnRate: 1500, correctCount: 0 };
const ll_letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let ll_gameLoop, ll_spawnTimer;

function ll_pickAdaptiveLetter() {
    const weighted = [];
    for (const l of ll_letters) {
        let weight = 3;
        if (window.gameCore) weight = window.gameCore.getLetterWeight(l);
        for (let i = 0; i < weight; i++) weighted.push(l);
    }
    return weighted[Math.floor(Math.random() * weighted.length)] || 'A';
}

function ll_startGame() {
    const gameOver = document.getElementById('ll_gameOver');
    if (gameOver) gameOver.classList.remove('show');
    
    if (window.gameCore) {
        window.gameCore.resetSessionLives(window.gameCore.player.level || 1);
        ll_state = { 
            target: '', isPlaying: true, items: [], 
            speed: 1.8 + (window.gameCore.player.level - 1) * 0.35, 
            spawnRate: Math.max(550, 1500 - ((window.gameCore.player.level - 1) * 120)), 
            correctCount: 0 
        };
    } else {
        ll_state = { target: '', isPlaying: true, items: [], speed: 2, spawnRate: 1500, correctCount: 0 };
    }
    
    const area = document.getElementById('ll_area');
    if (area) area.innerHTML = '';
    
    ll_updateUI();
    ll_nextTarget();
    if (ll_gameLoop) cancelAnimationFrame(ll_gameLoop);
    if (ll_spawnTimer) clearTimeout(ll_spawnTimer);
    ll_loop();
    ll_scheduleSpawn();
}

function ll_restartFromLevelOne() {
    if (window.gameCore) {
        window.gameCore.player.level = 1;
        window.gameCore.player.lives = 3;
        window.gameCore.saveGame();
    }
    ll_startGame();
}

function ll_nextTarget() {
    ll_state.target = ll_pickAdaptiveLetter();
    const targetLetter = document.getElementById('ll_targetLetter');
    if (targetLetter) targetLetter.textContent = ll_state.target;
    
    // Speak the letter
    try {
        const synth = window.speechSynthesis;
        synth.cancel();
        const utter = new SpeechSynthesisUtterance(ll_state.target);
        utter.lang = 'es-ES';
        utter.rate = 0.7;
        synth.speak(utter);
    } catch(e) {}
}

function ll_scheduleSpawn() {
    if (!ll_state.isPlaying) return;
    ll_spawnItem();
    ll_spawnTimer = setTimeout(ll_scheduleSpawn, ll_state.spawnRate);
}

function ll_spawnItem() {
    let type = 'letter';
    let val = ll_pickAdaptiveLetter();
    const r = Math.random();
    let lives = 3;
    let level = 1;
    if (window.gameCore) {
        lives = window.gameCore.player.lives;
        level = window.gameCore.player.level;
    }
    
    if (r < 0.25) val = ll_state.target;
    else if (r < 0.40 && lives < 5) type = 'heart';
    else if (r < 0.50 && level >= 3) type = 'bomb';

    let el = document.createElement('div');
    el.className = 'll-falling ' + type;
    if (type === 'letter') {
        el.textContent = val;
        if (val === ll_state.target && Math.random() > 0.5) el.classList.add('target');
    } else if (type === 'heart') el.textContent = '❤️';
    else if (type === 'bomb') el.textContent = '💣';

    const area = document.getElementById('ll_area');
    if (!area) return;
    const w = area.clientWidth;
    const x = Math.random() * (w - 60);
    el.style.left = x + 'px';
    el.style.top = '-60px';
    el.onclick = () => ll_handleClick(el, type, val);
    area.appendChild(el);
    ll_state.items.push({ el: el, y: -60, type: type, val: val });
}

function ll_removeItem(el) {
    ll_state.items = ll_state.items.filter(i => i.el !== el);
}

function ll_loop() {
    if (!ll_state.isPlaying) return;
    const area = document.getElementById('ll_area');
    if (!area) return;
    const h = area.clientHeight || 500;
    
    for (let i = ll_state.items.length - 1; i >= 0; i--) {
        const item = ll_state.items[i];
        item.y += ll_state.speed;
        item.el.style.top = item.y + 'px';
        if (item.y > h) {
            item.el.remove();
            ll_state.items.splice(i, 1);
            if (item.type === 'letter' && item.val === ll_state.target && window.gameCore) {
                window.gameCore.registerLetterResult(item.val, false);
                window.gameCore.loseLife();
                if (window.gameCore.player.lives <= 0) { ll_endGame(); break; }
                ll_nextTarget();
            }
        }
    }
    ll_gameLoop = requestAnimationFrame(ll_loop);
}

function ll_handleClick(el, type, val) {
    if (!ll_state.isPlaying) return;
    
    if (type === 'letter' && val === ll_state.target) {
        const points = 12 + (window.gameCore ? window.gameCore.player.level * 2 : 2);
        if (window.gameCore) {
            window.gameCore.addScore(points, 'lluvia');
            window.gameCore.registerLetterResult(val, true);
        }
        ll_state.correctCount++;
        el.remove();
        ll_removeItem(el);
        
        if (ll_state.correctCount >= 4 && window.gameCore) {
            window.gameCore.player.level++;
            ll_state.correctCount = 0;
            ll_state.speed += 0.30;
            ll_state.spawnRate = Math.max(420, ll_state.spawnRate - 100);
            if (window.gameCore.player.level >= 3) window.gameCore.unlockReward('escudo_lluvia');
        }
        ll_nextTarget();
    } else if (type === 'letter' && val !== ll_state.target) {
        if (window.gameCore) {
            window.gameCore.registerLetterResult(val, false);
            window.gameCore.loseLife();
        }
        el.remove();
        ll_removeItem(el);
    } else if (type === 'heart' && window.gameCore) {
        window.gameCore.gainLife();
        el.remove();
        ll_removeItem(el);
    } else if (type === 'bomb' && window.gameCore) {
        window.gameCore.loseLife();
        el.remove();
        ll_removeItem(el);
    }
    
    if (window.gameCore && window.gameCore.player.lives <= 0) ll_endGame();
    ll_updateUI();
}

function ll_updateUI() {
    if (window.gameCore) {
        const scoreEl = document.getElementById('ll_score');
        const levelEl = document.getElementById('ll_level');
        const livesEl = document.getElementById('ll_lives');
        if (scoreEl) scoreEl.textContent = window.gameCore.player.score;
        if (levelEl) levelEl.textContent = window.gameCore.player.level;
        if (livesEl) livesEl.textContent = window.gameCore.player.lives;
        window.gameCore.saveGame();
    }
}

function ll_endGame() {
    ll_state.isPlaying = false;
    const finalScore = document.getElementById('ll_finalScore');
    const finalLevel = document.getElementById('ll_finalLevel');
    const gameOver = document.getElementById('ll_gameOver');
    
    if (window.gameCore) {
        if (finalScore) finalScore.textContent = window.gameCore.player.score;
        if (finalLevel) finalLevel.textContent = window.gameCore.player.level;
        window.gameCore.saveGame();
    }
    if (gameOver) gameOver.classList.add('show');
}
