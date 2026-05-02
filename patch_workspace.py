import os
import re
import json

workspace = r"c:\Users\elmer\Downloads\juegos-_unidos\juegos-_unidos-codex-create-gamecore-module-for-global-state-8b9amt"

def read_file(name):
    path = os.path.join(workspace, name)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    return None

def write_file(name, content):
    with open(os.path.join(workspace, name), 'w', encoding='utf-8') as f:
        f.write(content)

# 1. Update gameCore.js
game_core_content = """(function (global) {
  const STORAGE_KEY = 'juegosAuroraAdventure';

  const rewardCatalog = [
    { id: 'escudo_lluvia', name: 'Escudo de Lluvia', icon: '🛡️', rarity: 'raro', desc: '+1 Vida en Tormenta Veloz', type: 'buff_lives_lluvia' },
    { id: 'lupa_magica', name: 'Lupa Reveladora', icon: '🔍', rarity: 'epico', desc: 'Bonus de puntos en Ruinas Antiguas', type: 'buff_score_palabras' },
    { id: 'corazon_fenix', name: 'Corazón Fénix', icon: '❤️', rarity: 'legendario', desc: '+1 Intento extra permanente', type: 'buff_lives_global' },
    { id: 'letras_pro', name: 'Maestro de Letras', icon: '👑', rarity: 'comun', desc: 'Insignia de dominio del bosque', type: 'badge' }
  ];

  const defaultState = {
    player: {
      name: 'Aventurero',
      xp: 0,
      level: 1,
      lives: 3,
      rewards: [],
      unlockedZones: ['alfabeto']
    },
    settings: { language: 'es' },
    progress: { letters: {}, words: {} },
    metrics: { gamesPlayed: 0 }
  };

  function clone(v) { return JSON.parse(JSON.stringify(v)); }

  const gameCore = {
    ...clone(defaultState),
    rewardCatalog,

    saveGame() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        player: this.player,
        settings: this.settings,
        progress: this.progress,
        metrics: this.metrics
      }));
    },

    loadGame() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        this.player = { ...clone(defaultState.player), ...(data.player || {}) };
        this.settings = { ...clone(defaultState.settings), ...(data.settings || {}) };
        this.progress = {
          letters: { ...(data.progress && data.progress.letters ? data.progress.letters : {}) },
          words: { ...(data.progress && data.progress.words ? data.progress.words : {}) }
        };
        this.metrics = { ...clone(defaultState.metrics), ...(data.metrics || {}) };
      } catch (e) {
        console.warn('No se pudo cargar gameCore', e);
      }
    },

    gainXP(amount) {
      let multiplier = this.hasRewardType('buff_score_palabras') ? 1.2 : 1;
      this.player.xp += Math.floor(amount * multiplier);
      this.checkLevelUp();
      this.saveGame();
    },

    checkLevelUp() {
      let nextLevelXP = this.player.level * 1000;
      if (this.player.xp >= nextLevelXP) {
        this.player.xp -= nextLevelXP;
        this.player.level++;
        this.checkUnlocks();
        // Trigger visual event if possible
        const event = new CustomEvent('adv_levelup', { detail: { level: this.player.level } });
        document.dispatchEvent(event);
      }
    },

    checkUnlocks() {
      if (this.player.level >= 2 && !this.player.unlockedZones.includes('lluvia')) {
        this.player.unlockedZones.push('lluvia');
        this.unlockReward('escudo_lluvia');
      }
      if (this.player.level >= 5 && !this.player.unlockedZones.includes('palabras')) {
        this.player.unlockedZones.push('palabras');
        this.unlockReward('lupa_magica');
      }
      if (this.player.level >= 8 && !this.player.unlockedZones.includes('ahorcado')) {
        this.player.unlockedZones.push('ahorcado');
        this.unlockReward('corazon_fenix');
      }
    },

    unlockReward(rewardId) {
      if (this.player.rewards.includes(rewardId)) return;
      this.player.rewards.push(rewardId);
      this.saveGame();
      const reward = this.rewardCatalog.find(r => r.id === rewardId);
      if (reward) {
        const event = new CustomEvent('adv_reward', { detail: reward });
        document.dispatchEvent(event);
      }
    },

    hasRewardType(type) {
      return this.player.rewards.some(rid => {
        let r = this.rewardCatalog.find(cat => cat.id === rid);
        return r && r.type === type;
      });
    },

    applyBuffs() {
        if(this.hasRewardType('buff_lives_global')) {
            this.player.lives = 4;
        } else {
            this.player.lives = 3;
        }
    },

    registerLetterResult(letter, ok) {
      const key = String(letter || '').toUpperCase();
      if (!key) return;
      if (!this.progress.letters[key]) this.progress.letters[key] = { hits: 0, fails: 0, mastered: false };
      if (ok) {
        this.progress.letters[key].hits += 1;
        if(this.progress.letters[key].hits >= 5) this.progress.letters[key].mastered = true;
      } else {
        this.progress.letters[key].fails += 1;
      }
      this.saveGame();
    }
  };

  gameCore.loadGame();
  gameCore.applyBuffs();
  global.gameCore = gameCore;
})(window);
"""
write_file("gameCore.js", game_core_content)


# 2. Update index.html
index_html = """<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mundo Mágico de Aurora</title>
  <link rel="icon" href="data:," />
  <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="./styles.css" />
  <script src="./gameCore.js"></script>
</head>
<body>
  <div class="bg-animation">
    <div class="bubble"></div><div class="bubble"></div><div class="bubble"></div>
    <div class="bubble"></div><div class="bubble"></div><div class="bubble"></div>
  </div>
  <div class="stars" id="global-stars"></div>

  <!-- Sistema de Aventura (Reemplaza al Main Menu) -->
  <div id="adventure-system" class="adventure-system">
      <div class="adv-header">
          <div class="adv-profile">
              <div class="adv-avatar" id="adv_avatar">🦸‍♂️</div>
              <div class="adv-stats">
                  <h2 id="adv_playerName">Aventurero</h2>
                  <div class="adv-level">Nivel <span id="adv_playerLevel">1</span></div>
              </div>
          </div>
          <div class="adv-progress">
              <div class="adv-progress-text">Exp: <span id="adv_progressText">0 / 1000</span></div>
              <div class="adv-progress-bar"><div class="adv-progress-fill" id="adv_progressFill" style="width: 0%"></div></div>
          </div>
          <button class="adv-inventory-btn" onclick="openInventory()">🎒 Inventario</button>
      </div>

      <h1 class="adv-title">El Mundo Mágico de Aurora</h1>

      <div class="adv-map">
          <!-- Zona 1: Bosque de Letras -->
          <a class="adv-zone zone-unlocked" id="zone_alfabeto" href="./aventura_alfabeto_2.html" style="text-decoration:none;">
              <div class="zone-icon">🌳</div>
              <div class="zone-name">Bosque de Letras</div>
          </a>

          <!-- Zona 2: Tormenta de Lluvia -->
          <a class="adv-zone zone-locked" id="zone_lluvia" href="#" onclick="checkLock(event, 'lluvia', './lluvia.html')" style="text-decoration:none;">
              <div class="zone-icon">☔</div>
              <div class="zone-name">Tormenta Veloz</div>
              <div class="zone-lock" id="lock_lluvia">🔒 Nivel 2</div>
          </a>

          <!-- Zona 3: Ruinas de Palabras -->
          <a class="adv-zone zone-locked" id="zone_palabras" href="#" onclick="checkLock(event, 'palabras', './palabras.html')" style="text-decoration:none;">
              <div class="zone-icon">🧩</div>
              <div class="zone-name">Ruinas Antiguas</div>
              <div class="zone-lock" id="lock_palabras">🔒 Nivel 5</div>
          </a>

          <!-- Zona 4: Torre del Ahorcado -->
          <a class="adv-zone zone-locked" id="zone_ahorcado" href="#" onclick="checkLock(event, 'ahorcado', './ahorcado.html')" style="text-decoration:none;">
              <div class="zone-icon">🎪</div>
              <div class="zone-name">Torre Mágica</div>
              <div class="zone-lock" id="lock_ahorcado">🔒 Nivel 8</div>
          </a>
      </div>
  </div>

  <!-- Inventory Overlay -->
  <div class="adv-inventory-overlay" id="adv_inventory" style="display: none;">
      <div class="adv-inventory-content">
          <button class="adv-close-btn" onclick="closeInventory()">✖</button>
          <h2>Tu Inventario Mágico 🎒</h2>
          <div class="adv-inventory-grid" id="adv_inventoryGrid"></div>
      </div>
  </div>

  <script>
    (function createStars(){
      const container = document.getElementById('global-stars');
      for (let i=0;i<50;i++) {
        const star = document.createElement('div');
        star.className='star';
        star.style.left = Math.random()*100+'%';
        star.style.top = Math.random()*100+'%';
        star.style.animationDelay = Math.random()*2+'s';
        star.style.width = star.style.height = (Math.random()*3+2)+'px';
        container.appendChild(star);
      }
    })();

    function updateUI() {
        document.getElementById('adv_playerLevel').textContent = gameCore.player.level;
        let nextXP = gameCore.player.level * 1000;
        document.getElementById('adv_progressText').textContent = `${gameCore.player.xp} / ${nextXP}`;
        document.getElementById('adv_progressFill').style.width = `${(gameCore.player.xp / nextXP) * 100}%`;

        const zones = ['lluvia', 'palabras', 'ahorcado'];
        zones.forEach(z => {
            let zEl = document.getElementById(`zone_${z}`);
            let lEl = document.getElementById(`lock_${z}`);
            if (zEl && lEl) {
                if (gameCore.player.unlockedZones.includes(z)) {
                    zEl.className = 'adv-zone zone-unlocked';
                    lEl.style.display = 'none';
                } else {
                    zEl.className = 'adv-zone zone-locked';
                    lEl.style.display = 'block';
                }
            }
        });
    }

    function checkLock(e, zone, url) {
        if (!gameCore.player.unlockedZones.includes(zone)) {
            e.preventDefault();
            let zEl = document.getElementById(`zone_${zone}`);
            zEl.style.transform = 'translateY(5px)';
            setTimeout(() => zEl.style.transform = 'none', 100);
            return false;
        } else {
            window.location.href = url;
        }
    }

    function openInventory() {
        document.getElementById('adv_inventory').style.display = 'flex';
        let grid = document.getElementById('adv_inventoryGrid');
        grid.innerHTML = '';
        
        if(gameCore.player.rewards.length === 0) {
            grid.innerHTML = '<p style="color:#aaa; grid-column:1/-1;">Sube de nivel para desbloquear premios mágicos.</p>';
        } else {
            gameCore.player.rewards.forEach(rid => {
                let item = gameCore.rewardCatalog.find(r => r.id === rid);
                if(item) {
                    let div = document.createElement('div');
                    div.className = `inv-item ${item.rarity}`;
                    div.innerHTML = `
                        <div class="inv-icon">${item.icon}</div>
                        <div class="inv-name">${item.name}</div>
                        <div class="inv-desc">${item.desc}</div>
                    `;
                    grid.appendChild(div);
                }
            });
        }
    }

    function closeInventory() {
        document.getElementById('adv_inventory').style.display = 'none';
    }

    // Listeners for UI updates
    document.addEventListener('adv_levelup', (e) => {
        alert(`¡Felicidades! Eres Nivel ${e.detail.level}`);
        updateUI();
    });
    
    document.addEventListener('adv_reward', (e) => {
        const reward = e.detail;
        alert(`¡NUEVO PREMIO MAGICO!\n${reward.icon} ${reward.name} (${reward.rarity})`);
    });

    window.addEventListener('load', updateUI);
  </script>
</body>
</html>"""
write_file("index.html", index_html)

# 3. Inject CSS into styles.css
styles = read_file("styles.css")
if "/* ==================== ADVENTURE SYSTEM ==================== */" not in styles:
    adventure_css = """
/* ==================== ADVENTURE SYSTEM ==================== */
.adventure-system { display: flex; flex-direction: column; align-items: center; min-height: 100vh; position: relative; z-index: 10; padding: 20px; }
.adv-header { display: flex; justify-content: space-between; align-items: center; width: 100%; max-width: 900px; background: linear-gradient(135deg, var(--card), #1e2a4a); padding: 15px 30px; border-radius: 20px; border: 2px solid rgba(255,255,255,0.1); box-shadow: 0 10px 30px rgba(0,0,0,0.5); margin-bottom: 30px; }
.adv-profile { display: flex; align-items: center; gap: 15px; }
.adv-avatar { font-size: 3rem; background: rgba(255,255,255,0.1); border-radius: 50%; padding: 10px; }
.adv-stats h2 { color: var(--accent1); font-family: 'Fredoka One', cursive; font-size: 1.5rem; margin-bottom: 5px; }
.adv-level { color: #fff; font-weight: bold; background: var(--accent4); padding: 5px 10px; border-radius: 10px; display: inline-block; }
.adv-progress { flex-grow: 1; margin: 0 30px; text-align: center; }
.adv-progress-text { color: #aaa; margin-bottom: 5px; font-weight: bold; }
.adv-progress-bar { width: 100%; height: 15px; background: rgba(0,0,0,0.5); border-radius: 10px; overflow: hidden; border: 1px solid rgba(255,255,255,0.2); }
.adv-progress-fill { height: 100%; background: linear-gradient(90deg, #f1c40f, #e67e22); width: 0%; transition: width 0.5s ease-out; }
.adv-inventory-btn { padding: 10px 20px; border: none; border-radius: 15px; background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; font-family: 'Fredoka One', cursive; font-size: 1.2rem; cursor: pointer; transition: transform 0.2s; }
.adv-inventory-btn:hover { transform: scale(1.05); }
.adv-title { font-family: 'Fredoka One', cursive; font-size: 3.5rem; background: linear-gradient(90deg, var(--accent2), var(--accent1)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 40px; text-align: center; text-shadow: 0 0 20px rgba(18,203,196,0.3); }
.adv-map { display: flex; gap: 30px; flex-wrap: wrap; justify-content: center; position: relative; max-width: 1000px; }
.adv-zone { width: 200px; height: 250px; background: linear-gradient(135deg, var(--card), #1e2a4a); border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 3px solid rgba(255,255,255,0.1); cursor: pointer; transition: all 0.3s; position: relative; color: white; }
.adv-zone.zone-unlocked { border-color: var(--accent1); box-shadow: 0 0 30px rgba(255,195,18,0.3); }
.adv-zone.zone-unlocked:hover { transform: translateY(-10px) scale(1.05); box-shadow: 0 0 40px rgba(255,195,18,0.6); }
.adv-zone.zone-locked { filter: grayscale(1); opacity: 0.7; cursor: not-allowed; }
.zone-icon { font-size: 5rem; margin-bottom: 15px; filter: drop-shadow(0 5px 10px rgba(0,0,0,0.5)); }
.zone-name { font-family: 'Fredoka One', cursive; font-size: 1.2rem; text-align: center; }
.zone-lock { position: absolute; bottom: 15px; background: rgba(0,0,0,0.8); padding: 5px 15px; border-radius: 10px; color: #e74c3c; font-weight: bold; }
.adv-inventory-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(26,26,46,0.95); z-index: 3000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); }
.adv-inventory-content { background: var(--card); padding: 40px; border-radius: 30px; border: 2px solid var(--accent2); width: 80%; max-width: 800px; position: relative; text-align: center; }
.adv-close-btn { position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 2rem; color: white; cursor: pointer; }
.adv-inventory-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 20px; margin-top: 30px; }
.inv-item { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 15px; display: flex; flex-direction: column; align-items: center; border: 2px solid transparent; color: white; }
.inv-item.comun { border-color: #bdc3c7; }
.inv-item.raro { border-color: #3498db; box-shadow: 0 0 15px rgba(52,152,219,0.5); }
.inv-item.epico { border-color: #9b59b6; box-shadow: 0 0 20px rgba(155,89,182,0.6); }
.inv-item.legendario { border-color: #f1c40f; box-shadow: 0 0 25px rgba(241,196,15,0.7); animation: pulseLegendary 2s infinite; }
@keyframes pulseLegendary { 0% { box-shadow: 0 0 15px rgba(241,196,15,0.5); } 50% { box-shadow: 0 0 30px rgba(241,196,15,1); } 100% { box-shadow: 0 0 15px rgba(241,196,15,0.5); } }
.inv-icon { font-size: 3rem; margin-bottom: 10px; }
.inv-name { font-weight: bold; font-size: 1rem; margin-bottom: 5px; }
.inv-desc { font-size: 0.8rem; color: #aaa; }
"""
    write_file("styles.css", styles + "\n" + adventure_css)

# 4. Inject script to individual games
def inject_gamecore(filename, xp_hook_js):
    content = read_file(filename)
    if not content: return
    
    # Insert gameCore.js if not present
    if "gameCore.js" not in content:
        content = content.replace("</head>", '    <script src="./gameCore.js"></script>\n</head>')
    
    # Insert Back to Map button if not present
    back_btn = '<a href="./index.html" style="position:fixed; top:20px; left:20px; z-index:2000; background:linear-gradient(135deg, #6C5CE7, #B53471); color:white; border:none; border-radius:50px; padding:10px 20px; font-family:\'Fredoka One\',cursive; text-decoration:none; box-shadow:0 5px 15px rgba(0,0,0,0.3);">🗺️ Mapa</a>'
    if "🗺️ Mapa" not in content:
        content = content.replace("<body>", f"<body>\n    {back_btn}")
        
    # Inject monkey-patch XP hook
    if "adv_xp_hook_applied" not in content:
        hook_script = f"\n<script>\n// adv_xp_hook_applied\nwindow.addEventListener('load', () => {{\n{xp_hook_js}\n}});\n</script>\n</body>"
        content = content.replace("</body>", hook_script)
        
    write_file(filename, content)

# Ahorcado
inject_gamecore("ahorcado.html", """
    const orig_checkWin = window.checkWin;
    if(orig_checkWin) {
        window.checkWin = function() {
            let oldWins = gameState.wins;
            orig_checkWin();
            if(gameState.wins > oldWins) window.gameCore.gainXP(150);
        };
    }
""")

# Alfabeto
inject_gamecore("aventura_alfabeto_2.html", """
    const orig_nextRound = window.nextRound;
    if(orig_nextRound) {
        window.nextRound = function() {
            let oldLevel = gameState.level;
            orig_nextRound();
            if(gameState.level > oldLevel) window.gameCore.gainXP(100);
        };
    }
""")

# Lluvia
inject_gamecore("lluvia.html", """
    if(window.gameCore.hasRewardType('buff_lives_lluvia')) {
        const orig_startGame = window.startGame;
        if(orig_startGame) {
            window.startGame = function() {
                orig_startGame();
                state.lives = 4; // Buff
                updateUI();
            };
        }
    }
    
    const orig_handleClick = window.handleClick;
    if(orig_handleClick) {
        window.handleClick = function(el, type, val) {
            let oldLevel = state.level;
            orig_handleClick(el, type, val);
            if(state.level > oldLevel) window.gameCore.gainXP(100);
        };
    }
""")

# Palabras
inject_gamecore("palabras.html", """
    const orig_checkWin = window.checkWin;
    if(orig_checkWin) {
        window.checkWin = function() {
            let oldLevel = state.level;
            orig_checkWin();
            if(state.level > oldLevel) window.gameCore.gainXP(150);
        };
    }
""")

print("Successfully applied Adventure System to the workspace!")
