import os
import re

base_dir = r"c:\Users\elmer\Downloads\juegos aurora"
ahorcado_path = os.path.join(base_dir, "ahorcado_magico.html")
alfabeto_path = os.path.join(base_dir, "aventura_alfabeto (2).html")
output_path = os.path.join(base_dir, "juegos_unidos.html")

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

ahorcado_html = read_file(ahorcado_path)
alfabeto_html = read_file(alfabeto_path)

# Bug fix in Alfabeto logic before parsing
alfabeto_bugfix = r'''
            gameState.round++;
            if (gameState.round > gameState.totalRounds) {
                // Bug fix: Next Level instead of game over
                gameState.level++;
                gameState.round = 1;
                gameState.correctAnswers = 0; // reset correct answers for next level
                
                // Increase difficulty slightly
                if (gameState.level == 2) setMode('medio', true);
                if (gameState.level == 3) setMode('dificil', true);
                if (gameState.level > 3) setMode('dictado', true);
                
                playSound('levelup');
                showLevelUp();
                
                // Show custom Level Complete overlay
                document.getElementById('gameOverTitle').textContent = '¡Nivel ' + (gameState.level - 1) + ' Completado! 🎉';
                let btn = document.querySelector('#gameOver .restart-btn');
                let old_onclick = btn.getAttribute('onclick');
                btn.textContent = 'Siguiente Nivel 🚀';
                
                document.getElementById('finalScore').textContent = gameState.score;
                document.getElementById('finalStreak').textContent = gameState.bestStreak;
                document.getElementById('finalCorrect').textContent = gameState.correctAnswers;
                document.getElementById('finalTotal').textContent = gameState.totalRounds;
                document.getElementById('starsRating').textContent = '⭐⭐⭐⭐⭐';
                
                createConfetti();
                document.getElementById('gameOver').classList.add('show');
                return;
            }
'''
alfabeto_html = re.sub(
    r'gameState\.round\+\+;\s*if\s*\(gameState\.round\s*>\s*gameState\.totalRounds\)\s*\{\s*endGame\(\);\s*return;\s*\}',
    alfabeto_bugfix.strip(),
    alfabeto_html
)

# In Alfabeto, we need to modify setMode to not reset the game fully if we are passing true for level up
alfabeto_html = alfabeto_html.replace(
    "function setMode(mode) {", 
    "function setMode(mode, fromLevelUp = false) {"
)
alfabeto_html = alfabeto_html.replace(
    "            if (gameState.isPlaying) {\n                resetGame();\n                nextRound();\n            }",
    "            if (gameState.isPlaying && !fromLevelUp) {\n                resetGame();\n                nextRound();\n            }"
)

# Also fix the level-up every 3 correct answers, to not level up automatically, but just give points
alfabeto_html = alfabeto_html.replace(
    "if (gameState.correctAnswers % 3 === 0) {\n                    gameState.level++;\n                    playSound('levelup');\n                    showLevelUp();\n                }",
    "if (gameState.correctAnswers % 3 === 0) {\n                    playSound('streak');\n                }"
)


def extract_parts(html_content):
    css_match = re.search(r'<style>(.*?)</style>', html_content, re.DOTALL)
    css = css_match.group(1) if css_match else ""
    
    body_match = re.search(r'<body>(.*?)<script>', html_content, re.DOTALL)
    body = body_match.group(1) if body_match else ""
    
    js_match = re.search(r'<script>(.*?)</script>', html_content, re.DOTALL)
    js = js_match.group(1) if js_match else ""
    return css, body, js

ah_css, ah_body, ah_js = extract_parts(ahorcado_html)
al_css, al_body, al_js = extract_parts(alfabeto_html)

# We will prefix IDs to avoid collisions
def prefix_html(body, prefix):
    # IDs
    body = re.sub(r'id="([^"]+)"', rf'id="{prefix}\1"', body)
    # onclick, onsubmit...
    body = re.sub(r'(on[a-z]+)="([a-zA-Z0-9_]+)\(', rf'\1="{prefix}\2(', body)
    return body

ah_body = prefix_html(ah_body, "ah_")
al_body = prefix_html(al_body, "al_")

def prefix_js(js, prefix):
    # Rename functions
    funcs = re.findall(r'function\s+([a-zA-Z0-9_]+)\s*\(', js)
    for func in set(funcs):
        js = re.sub(rf'\b{func}\b(?=\s*\()', rf'{prefix}{func}', js)
    
    # Prefix globals
    globals_vars = ['gameState', 'WORDS', 'ALFABETO', 'ALFABETO_EN', 'audioCtx', 'CARD_COLORS', 'LETTER_NAMES_ES', 'LETTER_NAMES_EN', 'synth', 'MODE_CONFIG', 'PHASE_CONFIG']
    for g in globals_vars:
        js = re.sub(rf'\b{g}\b', rf'{prefix}{g}', js)
        
    # Document queries
    js = re.sub(r'getElementById\(([\'"])(.*?)([\'"])\)', rf'getElementById(\1{prefix}\2\3)', js)
    return js

ah_js = prefix_js(ah_js, "ah_")
al_js = prefix_js(al_js, "al_")

# Fix references to querySelector in JS
al_js = al_js.replace("querySelector('#al_gameOver .restart-btn')", "querySelector('#al_gameOver .restart-btn')")

# Main unified HTML
merged_html = f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Juegos Aurora</title>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        /* Shared Base CSS (from Ahorcado) */
        {ah_css}
        
        /* Menu Specific CSS */
        .main-menu {{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            position: relative;
            z-index: 10;
        }}
        
        .menu-title {{
            font-family: 'Fredoka One', cursive;
            font-size: 3.5rem;
            background: linear-gradient(90deg, var(--primary), var(--accent2), var(--accent1));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 40px;
            text-align: center;
            animation: bounce 2s infinite;
        }}
        
        .games-grid {{
            display: flex;
            gap: 30px;
            flex-wrap: wrap;
            justify-content: center;
        }}
        
        .game-card {{
            background: linear-gradient(135deg, var(--card), #1e2a4a);
            border-radius: 30px;
            padding: 40px;
            text-align: center;
            cursor: pointer;
            border: 2px solid rgba(255,255,255,0.1);
            box-shadow: 0 15px 50px rgba(0,0,0,0.3);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            width: 300px;
        }}
        
        .game-card:hover {{
            transform: translateY(-15px) scale(1.05);
            box-shadow: 0 30px 60px rgba(0,0,0,0.5);
            border-color: var(--accent2);
        }}
        
        .game-card .emoji {{
            font-size: 5rem;
            margin-bottom: 20px;
            display: block;
        }}
        
        .game-card h3 {{
            font-family: 'Fredoka One', cursive;
            font-size: 1.8rem;
            color: var(--text);
            margin-bottom: 15px;
        }}
        
        .game-card p {{
            color: #aaa;
            font-size: 1rem;
            line-height: 1.5;
        }}
        
        .back-btn {{
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 2000;
            background: linear-gradient(135deg, var(--accent4), var(--accent3));
            color: white;
            border: none;
            border-radius: 50px;
            padding: 10px 20px;
            font-family: 'Fredoka One', cursive;
            font-size: 1rem;
            cursor: pointer;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            transition: all 0.3s;
            display: none;
        }}
        
        .back-btn:hover {{
            transform: scale(1.1);
        }}
        
        /* Game containers */
        #ahorcado-app, #alfabeto-app {{
            display: none;
        }}
        
        /* Alfabeto Specific CSS Additions */
        .target-display {{ min-height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; }}
        .target-letter.hidden-letter {{ opacity: 0; transform: scale(0.5); filter: blur(10px); }}
        .target-letter.ear-icon {{ animation: earPulse 1s ease-in-out infinite; }}
        
        {al_css.replace(':root {', '/* :root {')} /* Strip root from AL since it's duplicate */
    </style>
</head>
<body>
    <div class="bg-animation">
        <div class="bubble"></div><div class="bubble"></div><div class="bubble"></div>
        <div class="bubble"></div><div class="bubble"></div><div class="bubble"></div>
    </div>
    <div class="stars" id="global-stars"></div>

    <button id="mainBackBtn" class="back-btn" onclick="showMainMenu()">🏠 Volver al Menú</button>

    <!-- Main Menu -->
    <div id="main-menu" class="main-menu">
        <h1 class="menu-title">Juegos Aurora<br><span style="font-size: 1.5rem; color: #a0a0a0;">Bilingual School</span></h1>
        
        <div class="games-grid">
            <div class="game-card" onclick="openGame('ahorcado')">
                <span class="emoji">🎪</span>
                <h3>Ahorcado Mágico</h3>
                <p>Descubre las palabras ocultas antes de que se dibuje el muñeco.</p>
            </div>
            
            <div class="game-card" onclick="openGame('alfabeto')">
                <span class="emoji">🌈</span>
                <h3>Aventura del Alfabeto</h3>
                <p>Encuentra y memoriza las letras con ayuda del unicornio mágico.</p>
            </div>
        </div>
    </div>

    <!-- Ahorcado Container -->
    <div id="ahorcado-app">
        {ah_body}
    </div>

    <!-- Alfabeto Container -->
    <div id="alfabeto-app">
        {al_body}
    </div>

    <script>
        // --- GLOBAL MENU LOGIC ---
        function showMainMenu() {{
            document.getElementById('main-menu').style.display = 'flex';
            document.getElementById('ahorcado-app').style.display = 'none';
            document.getElementById('alfabeto-app').style.display = 'none';
            document.getElementById('mainBackBtn').style.display = 'none';
            
            // Stop audio if exists
            try {{ if(ah_audioCtx) ah_audioCtx.suspend(); }} catch(e){{}}
            try {{ if(al_audioCtx) al_audioCtx.suspend(); }} catch(e){{}}
            try {{ window.speechSynthesis.cancel(); }} catch(e){{}}
        }}

        function openGame(game) {{
            document.getElementById('main-menu').style.display = 'none';
            document.getElementById('mainBackBtn').style.display = 'block';
            
            if (game === 'ahorcado') {{
                document.getElementById('ahorcado-app').style.display = 'block';
                // start ahorcado
                try {{ if(ah_audioCtx) ah_audioCtx.resume(); }} catch(e){{}}
                ah_resetHangman();
                ah_nextWord();
            }} else {{
                document.getElementById('alfabeto-app').style.display = 'block';
                // stop startScreen from blocking
                const scr = document.getElementById('al_startScreen');
                if(scr) scr.classList.remove('hidden');
                try {{ if(al_audioCtx) al_audioCtx.resume(); }} catch(e){{}}
            }}
        }}
        
        function globalCreateStars() {{
            const container = document.getElementById('global-stars');
            for (let i = 0; i < 50; i++) {{
                const star = document.createElement('div');
                star.className = 'star';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.animationDelay = Math.random() * 2 + 's';
                star.style.width = star.style.height = (Math.random() * 3 + 2) + 'px';
                container.appendChild(star);
            }}
        }}
        globalCreateStars();
        
        // Disable original createStars inside games individually so they don't spawn multiple times
        function ah_createStars() {{}}
        function al_createStars() {{}}

        // --- AHORCADO JS ---
        {ah_js}

        // --- ALFABETO JS ---
        {al_js}
        
    </script>
</body>
</html>
"""

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(merged_html)

print("juegos_unidos.html created successfully.")
