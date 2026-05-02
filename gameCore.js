// gameCore.js - Núcleo con progresión evolutiva
(function(global) {
    const STORAGE_USERS = 'aurora_users';
    const STORAGE_ACTIVE = 'aurora_active_user';
    const STORAGE_LEGACY = 'auroraPlayerProfile';

    // Orden de desbloqueo de juegos
    const GAME_ORDER = ['alfabeto', 'lluvia', 'palabras', 'ahorcado'];
    const GAME_NAMES = {
        alfabeto: '🌳 Bosque de Letras',
        lluvia: '☔ Torrente de Palabras',
        palabras: '🧩 Ruinas Antiguas',
        ahorcado: '🎪 Torre del Ahorcado'
    };

    // Niveles requeridos para desbloquear cada juego
    const UNLOCK_LEVELS = {
        alfabeto: 1,    // Siempre desbloqueado
        lluvia: 3,      // Nivel 3 del juego anterior
        palabras: 5,
        ahorcado: 8
    };

    const rewardCatalog = [
        { id: 'llave_lluvia', name: '🌊 Llave del Torrente', icon: '🔑', rarity: 'comun', type: 'unlock_lluvia' },
        { id: 'llave_palabras', name: '🗝️ Llave de las Ruinas', icon: '🔑', rarity: 'raro', type: 'unlock_palabras' },
        { id: 'llave_ahorcado', name: '🔐 Llave de la Torre', icon: '🔑', rarity: 'epico', type: 'unlock_ahorcado' },
        { id: 'corona_leyenda', name: '👑 Corona Legendaria', icon: '👑', rarity: 'legendario', type: 'game_complete' }
    ];

    const defaultGameStats = {
        alfabeto: { 
            score: 0, 
            currentLevel: 1,      // Nivel actual dentro del juego
            currentPhase: 1,      // Fase 1,2,3 (Ver, Memorizar, Escuchar)
            maxLevelReached: 1,
            completed: false,
            plays: 0, 
            wins: 0, 
            bestScore: 0 
        },
        lluvia: { 
            score: 0, 
            currentLevel: 1, 
            maxLevelReached: 1,
            completed: false,
            plays: 0, 
            wins: 0, 
            bestScore: 0 
        },
        palabras: { 
            score: 0, 
            currentLevel: 1, 
            maxLevelReached: 1,
            completed: false,
            plays: 0, 
            wins: 0, 
            bestScore: 0 
        },
        ahorcado: { 
            score: 0, 
            currentLevel: 1, 
            maxLevelReached: 1,
            completed: false,
            plays: 0, 
            wins: 0, 
            bestScore: 0 
        }
    };

    function getAllUsers() {
        const data = localStorage.getItem(STORAGE_USERS);
        return data ? JSON.parse(data) : [];
    }

    function saveAllUsers(users) {
        localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
    }

    function getActiveUser() {
        const activeId = localStorage.getItem(STORAGE_ACTIVE);
        if (!activeId) return null;
        const users = getAllUsers();
        return users.find(u => u.id === activeId) || null;
    }

    function saveUser(user) {
        const users = getAllUsers();
        const index = users.findIndex(u => u.id === user.id);
        if (index !== -1) users[index] = user;
        else users.push(user);
        saveAllUsers(users);
    }

    class GameCore {
        constructor() {
            this.rewardCatalog = rewardCatalog;
            this.settings = { language: 'es' };
            this.progress = { letters: {}, words: {} };
            this.metrics = { gamesPlayed: 0 };
            this.loadUser();
        }

        loadUser() {
            const user = getActiveUser();
            if (!user) {
                this.player = null;
                return;
            }
            
            const userDataKey = `aurora_user_data_${user.id}`;
            let savedData = localStorage.getItem(userDataKey);
            
            if (savedData) {
                const data = JSON.parse(savedData);
                this.player = data.player || { ...user };
                this.settings = data.settings || { language: 'es' };
                this.progress = data.progress || { letters: {}, words: {} };
                this.metrics = data.metrics || { gamesPlayed: 0 };
                
                // Asegurar que los gameStats tengan la estructura correcta
                if (!this.player.gameStats) {
                    this.player.gameStats = JSON.parse(JSON.stringify(defaultGameStats));
                } else {
                    // Migrar campos faltantes
                    for (const game of GAME_ORDER) {
                        if (!this.player.gameStats[game]) {
                            this.player.gameStats[game] = JSON.parse(JSON.stringify(defaultGameStats[game]));
                        }
                        if (this.player.gameStats[game].currentLevel === undefined) {
                            this.player.gameStats[game].currentLevel = 1;
                        }
                        if (this.player.gameStats[game].currentPhase === undefined && game === 'alfabeto') {
                            this.player.gameStats[game].currentPhase = 1;
                        }
                    }
                }
            } else {
                this.player = {
                    id: user.id,
                    name: user.name,
                    gender: user.gender,
                    avatar: user.avatar,
                    xp: user.stats?.xp || 0,
                    level: user.stats?.level || 1,
                    lives: 3,
                    rewards: user.stats?.rewards || [],
                    unlockedZones: ['alfabeto'],
                    totalScore: user.stats?.totalScore || 0,
                    gameStats: JSON.parse(JSON.stringify(defaultGameStats))
                };
            }
            
            this.syncUnlockedZones();
            this.saveGame();
        }

        // Sincronizar zonas desbloqueadas basado en progreso
        syncUnlockedZones() {
            if (!this.player) return;
            
            const newUnlocked = ['alfabeto'];
            
            // Verificar si alfabeto está completado (nivel 3 alcanzado)
            if (this.player.gameStats.alfabeto.maxLevelReached >= 3) {
                newUnlocked.push('lluvia');
            }
            
            // Verificar si lluvia está completado (nivel 5 alcanzado)
            if (this.player.gameStats.lluvia.maxLevelReached >= 5) {
                newUnlocked.push('palabras');
            }
            
            // Verificar si palabras está completado (nivel 8 alcanzado)
            if (this.player.gameStats.palabras.maxLevelReached >= 8) {
                newUnlocked.push('ahorcado');
            }
            
            this.player.unlockedZones = newUnlocked;
        }

        saveGame() {
            if (!this.player) return;
            
            const userDataKey = `aurora_user_data_${this.player.id}`;
            localStorage.setItem(userDataKey, JSON.stringify({
                player: this.player,
                settings: this.settings,
                progress: this.progress,
                metrics: this.metrics
            }));
            
            // Actualizar lista de usuarios
            const users = getAllUsers();
            const idx = users.findIndex(u => u.id === this.player.id);
            if (idx !== -1) {
                users[idx].stats = {
                    totalScore: this.player.totalScore,
                    level: this.player.level,
                    xp: this.player.xp,
                    rewards: this.player.rewards,
                    games: this.player.gameStats
                };
                saveAllUsers(users);
            }
        }

        // ==================== MÉTODOS DE PROGRESIÓN ====================
        
        // Obtener el juego actual que debe jugar el usuario
        getCurrentGame() {
            if (!this.player) return 'alfabeto';
            
            for (const game of GAME_ORDER) {
                const stats = this.player.gameStats[game];
                const requiredLevel = UNLOCK_LEVELS[game];
                
                // Si no ha completado este juego, es el actual
                if (stats.maxLevelReached < requiredLevel && !stats.completed) {
                    return game;
                }
            }
            return 'alfabeto'; // fallback
        }
        
        // Verificar si un juego está desbloqueado
        isGameUnlocked(gameId) {
            if (!this.player) return gameId === 'alfabeto';
            return this.player.unlockedZones.includes(gameId);
        }
        
        // Verificar si el juego está completamente terminado
        isGameCompleted(gameId) {
            if (!this.player) return false;
            return this.player.gameStats[gameId]?.completed || false;
        }
        
        // Registrar progreso en Alfabeto (tiene fases)
        advanceAlfabeto(correctCount, totalLevels = 10) {
            if (!this.player) return { levelUp: false, phaseUp: false, gameCompleted: false };
            
            const stats = this.player.gameStats.alfabeto;
            
            // Si ya completó 10 letras en el nivel actual
            if (correctCount >= totalLevels) {
                // Subir de nivel dentro del juego
                stats.currentLevel++;
                stats.maxLevelReached = Math.max(stats.maxLevelReached, stats.currentLevel);
                
                // Cada 3 niveles, subir de fase (1→2→3)
                let phaseUp = false;
                if (stats.currentLevel % 3 === 0 && stats.currentPhase < 3) {
                    stats.currentPhase++;
                    phaseUp = true;
                }
                
                // Si llegó a nivel 3 (fase 3 completada), el juego está listo para dar premio
                let gameCompleted = false;
                if (stats.currentLevel >= 3 && !stats.completed) {
                    stats.completed = true;
                    gameCompleted = true;
                    this.unlockReward('llave_lluvia');
                }
                
                this.saveGame();
                return { levelUp: true, phaseUp, gameCompleted, newLevel: stats.currentLevel, newPhase: stats.currentPhase };
            }
            
            return { levelUp: false, phaseUp: false, gameCompleted: false };
        }
        
        // Registrar progreso en Lluvia de Letras
        advanceLluvia(newLevel) {
            if (!this.player) return { gameCompleted: false };
            
            const stats = this.player.gameStats.lluvia;
            stats.currentLevel = newLevel;
            stats.maxLevelReached = Math.max(stats.maxLevelReached, newLevel);
            
            let gameCompleted = false;
            if (newLevel >= 5 && !stats.completed) {
                stats.completed = true;
                gameCompleted = true;
                this.unlockReward('llave_palabras');
            }
            
            this.saveGame();
            return { gameCompleted, completedLevel: newLevel };
        }
        
        // Registrar progreso en Palabras Escondidas
        advancePalabras(newLevel) {
            if (!this.player) return { gameCompleted: false };
            
            const stats = this.player.gameStats.palabras;
            stats.currentLevel = newLevel;
            stats.maxLevelReached = Math.max(stats.maxLevelReached, newLevel);
            
            let gameCompleted = false;
            if (newLevel >= 8 && !stats.completed) {
                stats.completed = true;
                gameCompleted = true;
                this.unlockReward('llave_ahorcado');
            }
            
            this.saveGame();
            return { gameCompleted, completedLevel: newLevel };
        }
        
        // Registrar progreso en Ahorcado (juego final)
        advanceAhorcado(newLevel) {
            if (!this.player) return { gameCompleted: false };
            
            const stats = this.player.gameStats.ahorcado;
            stats.currentLevel = newLevel;
            stats.maxLevelReached = Math.max(stats.maxLevelReached, newLevel);
            
            let gameCompleted = false;
            if (newLevel >= 10 && !stats.completed) {
                stats.completed = true;
                gameCompleted = true;
                this.unlockReward('corona_leyenda');
            }
            
            this.saveGame();
            return { gameCompleted, completedLevel: newLevel };
        }

        // ==================== MÉTODOS EXISTENTES ====================
        
        gainXP(amount) {
            if (!this.player) return;
            this.player.xp += amount;
            this.checkLevelUp();
            this.saveGame();
        }

        checkLevelUp() {
            if (!this.player) return;
            let nextLevelXP = this.player.level * 500;
            if (this.player.xp >= nextLevelXP) {
                this.player.xp -= nextLevelXP;
                this.player.level++;
                this.syncUnlockedZones();
                const event = new CustomEvent('adv_levelup', { detail: { level: this.player.level } });
                document.dispatchEvent(event);
            }
        }

        unlockReward(rewardId) {
            if (!this.player || this.player.rewards.includes(rewardId)) return false;
            this.player.rewards.push(rewardId);
            this.saveGame();
            const reward = this.rewardCatalog.find(r => r.id === rewardId);
            if (reward) {
                const event = new CustomEvent('adv_reward', { detail: reward });
                document.dispatchEvent(event);
            }
            return true;
        }

        addScore(points, gameId) {
            if (!this.player) return;
            this.player.totalScore += points;
            if (gameId && this.player.gameStats[gameId]) {
                this.player.gameStats[gameId].score += points;
                this.player.gameStats[gameId].bestScore = Math.max(this.player.gameStats[gameId].bestScore, this.player.gameStats[gameId].score);
            }
            this.saveGame();
        }

        setLanguage(lang) {
            this.settings.language = lang;
            this.saveGame();
        }

        loseLife() {
            if (!this.player) return;
            this.player.lives = Math.max(0, this.player.lives - 1);
            this.saveGame();
        }

        gainLife() {
            if (!this.player) return;
            this.player.lives = Math.min(5, this.player.lives + 1);
            this.saveGame();
        }

        resetSessionLives() {
            if (!this.player) return;
            this.player.lives = 3;
        }

        registerLetterResult(letter, correct) {
            if (!this.player) return;
            const key = letter.toUpperCase();
            if (!this.progress.letters[key]) this.progress.letters[key] = { correct: 0, wrong: 0 };
            if (correct) this.progress.letters[key].correct++;
            else this.progress.letters[key].wrong++;
            this.saveGame();
        }

        registerWordResult(word, correct) {
            if (!this.player) return;
            const key = word.toUpperCase();
            if (!this.progress.words[key]) this.progress.words[key] = { correct: 0, wrong: 0 };
            if (correct) this.progress.words[key].correct++;
            else this.progress.words[key].wrong++;
            this.saveGame();
        }

        canUseWord(word) {
            if (!this.player) return true;
            const usage = this.progress.words[word.toUpperCase()];
            if (!usage) return true;
            return usage.correct < 2;
        }

        getLetterWeight(letter) {
            if (!this.player) return 3;
            const usage = this.progress.letters[letter.toUpperCase()];
            if (!usage) return 3;
            const total = usage.correct + usage.wrong;
            if (total === 0) return 3;
            const ratio = usage.correct / total;
            if (ratio < 0.3) return 5;
            if (ratio < 0.6) return 3;
            return 1;
        }

        getGameStats(gameId) {
            if (!this.player) return { score: 0, currentLevel: 1, maxLevelReached: 1, completed: false };
            return this.player.gameStats[gameId] || { score: 0, currentLevel: 1, maxLevelReached: 1, completed: false };
        }

        getPlayer() { return this.player; }
        isLoggedIn() { return this.player !== null; }
        
        // Obtener el siguiente juego después de completar uno
        getNextGame(currentGame) {
            const currentIndex = GAME_ORDER.indexOf(currentGame);
            if (currentIndex === -1 || currentIndex === GAME_ORDER.length - 1) return null;
            return GAME_ORDER[currentIndex + 1];
        }
    }

    const instance = new GameCore();
    global.gameCore = instance;
    global.GAME_ORDER = GAME_ORDER;
    global.GAME_NAMES = GAME_NAMES;
})(window);
