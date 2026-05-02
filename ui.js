// ui.js - Funciones comunes de interfaz
function showMainMenu() {
    document.getElementById('main-menu').style.display = 'flex';
    document.getElementById('ahorcado-app').style.display = 'none';
    document.getElementById('alfabeto-app').style.display = 'none';
    document.getElementById('lluvia-app').style.display = 'none';
    document.getElementById('palabras-app').style.display = 'none';
    document.getElementById('mainBackBtn').style.display = 'none';
    
    try { if(window.ah_audioCtx) ah_audioCtx.suspend(); } catch(e){}
    try { if(window.al_audioCtx) al_audioCtx.suspend(); } catch(e){}
    try { window.speechSynthesis.cancel(); } catch(e){}
}

function openGame(game) {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('mainBackBtn').style.display = 'block';
    
    const containers = {
        ahorcado: 'ahorcado-app',
        alfabeto: 'alfabeto-app',
        lluvia: 'lluvia-app',
        palabras: 'palabras-app'
    };
    
    const containerId = containers[game];
    if (!containerId) return;
    
    const container = document.getElementById(containerId);
    container.style.display = 'block';
    
    // Inicializar el juego específico
    switch(game) {
        case 'ahorcado':
            if (typeof ah_resetHangman === 'function') ah_resetHangman();
            if (typeof ah_nextWord === 'function') ah_nextWord();
            break;
        case 'alfabeto':
            if (typeof al_startGame === 'function') al_startGame();
            break;
        case 'lluvia':
            if (typeof ll_startGame === 'function') ll_startGame();
            break;
        case 'palabras':
            if (typeof pe_startGame === 'function') pe_startGame();
            break;
    }
}

function switchUser() {
    localStorage.removeItem('aurora_active_user');
    window.location.href = 'user_manager.html';
}

function updateUserBar() {
    const activeId = localStorage.getItem('aurora_active_user');
    if (!activeId) {
        window.location.href = 'user_manager.html';
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('aurora_users') || '[]');
    const user = users.find(u => u.id === activeId);
    
    if (!user) {
        localStorage.removeItem('aurora_active_user');
        window.location.href = 'user_manager.html';
        return;
    }
    
    document.getElementById('userAvatar').textContent = user.avatar || '👤';
    document.getElementById('userName').textContent = user.name || 'Aventurero';
    document.getElementById('userScore').innerHTML = `🏆 ${user.stats?.totalScore || 0} pts`;
    
    const welcomeMsg = document.getElementById('welcomeMessage');
    if (welcomeMsg) {
        welcomeMsg.innerHTML = `✨ ¡Bienvenido, ${user.name}! Elige un juego para comenzar ✨`;
    }
}

function createStars() {
    const container = document.getElementById('global-stars');
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

function renderGamesGrid() {
    const games = [
        { id: 'alfabeto', emoji: '🌈', title: 'Aventura del Alfabeto', desc: 'Encuentra y memoriza las letras con ayuda del unicornio mágico.' },
        { id: 'lluvia', emoji: '☔', title: 'Lluvia de Letras', desc: 'Atrapa las letras correctas que caen del cielo. ¡Cuidado con las bombas!' },
        { id: 'palabras', emoji: '🧩', title: 'Palabras Escondidas', desc: 'Ordena las letras para formar la palabra y colecciona premios mágicos.' },
        { id: 'ahorcado', emoji: '🎪', title: 'Ahorcado Mágico', desc: 'Descubre las palabras ocultas antes de que se dibuje el muñeco.' }
    ];
    
    const grid = document.getElementById('gamesGrid');
    if (!grid) return;
    
    grid.innerHTML = games.map(game => `
        <div class="game-card" onclick="openGame('${game.id}')">
            <span class="emoji">${game.emoji}</span>
            <h3>${game.title}</h3>
            <p>${game.desc}</p>
        </div>
    `).join('');
}

// Inicialización
createStars();
renderGamesGrid();

// Verificar usuario activo
const activeId = localStorage.getItem('aurora_active_user');
if (!activeId) {
    window.location.href = 'user_manager.html';
} else {
    updateUserBar();
}

showMainMenu();
