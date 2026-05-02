// gameCore.js - Núcleo unificado del juego
(function(global) {
    // ==================== CONFIGURACIÓN ====================
    const STORAGE_USERS = 'aurora_users';
    const STORAGE_ACTIVE = 'aurora_active_user';
    const STORAGE_LEGACY = 'auroraPlayerProfile';

    const rewardCatalog = [
        { id: 'escudo_lluvia', name: 'Escudo de Lluvia', icon: '🛡️', rarity: 'raro', type: 'buff_lives_lluvia' },
        { id: 'lupa_magica', name: 'Lupa Reveladora', icon: '🔍', rarity: 'epico', type: 'buff_score_palabras' },
        { id: 'corazon_fenix', name: 'Corazón Fénix', icon: '❤️', rarity: 'legendario', type: 'buff_lives_global' },
        { id: 'letras_pro', name: 'Maestro de Letras', icon: '👑', rarity: 'comun', type: 'badge' }
    ];

    const defaultGameStats = {
        alfabeto: { score: 0, level: 1, plays: 0, wins: 0, bestScore: 0 },
        lluvia:   { score: 0, level: 1, plays: 0, wins: 0, bestScore: 0 },
        palabras: { score: 0, level: 1, plays: 0, wins: 0, bestScore: 0 },
        ahorcado: { score: 0, level: 1, plays: 0, wins: 0, bestScore: 0 }
    };

    // ==================== FUNCIONES DE USUARIO ====================
    function migrateLegacyProfile() {
        const legacy = localStorage.getItem(STORAGE_LEGACY);
        if (!legacy) return false;
        
        try {
            const profile = JSON.parse(legacy);
            const users = getAllUsers();
            if (!users.some(u => u.name === profile.name)) {
                const newUser = {
                    id: Date.now().toString(),
                    name: profile.name,
                    gender: profile.gender || 'boy',
                    avatar: profile.avatar || (profile.gender === 'boy' ? '👦' : '👧'),
                    createdAt: new Date().toISOString(),
                    stats: {
                        totalScore: 0,
                        level: 1,
                        xp: 0,
                        rewards: [],
                        games: JSON.parse(JSON.stringify(defaultGameStats))
                    }
                };
                users.push(newUser);
                saveAllUsers(users);
            }
            // No borramos legacy por seguridad, pero ya no lo usamos
            return true;
        } catch(e) { return false; }
    }

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

    // ==================== CLASE GameCore ====================
    class GameCore {
        constructor() {
            this.rewardCatalog = rewardCatalog;
            this.settings = { language: 'es' };
            this.progress = { letters: {}, words: {} };
            this.metrics = { gamesPlayed: 0 };
            
            // Migrar perfil antiguo si existe
            migrateLegacyProfile();
            
            // Cargar usuario activo o null
            this.loadUser();
        }

        loadUser() {
            const user = getActiveUser();
            if (!user) {
                this.player = null;
                return;
            }
            
            // Cargar datos específicos del usuario desde localStorage
            const userDataKey = `aurora_user_data_${user.id}`;
            let savedData = localStorage.getItem(userDataKey);
            
            if (savedData) {
                const data = JSON.parse(savedData);
                this.player = data.player || { ...user };
                this.settings = data.settings || { language: 'es' };
                this.progress = data.progress || { letters: {}, words: {} };
                this.metrics = data.metrics || { gamesPlayed: 0 };
            } else {
                // Crear nuevo estado para este usuario
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
                    gameStats: user.stats?.games || JSON.parse(JSON.stringify(defaultGameStats))
                };
            }
            
            this.applyBuffs();
            this.saveGame();
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
            
            // También actualizar la lista de usuarios
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

        applyBuffs() {
            if (!this.player) return;
            if (this.hasRewardType('buff_lives_global')) {
                this.player.lives = 4;
            } else {
                this.player.lives = 3;
            }
        }

        hasRewardType(type) {
            if (!this.player) return false;
            return this.player.rewards.some(rid => {
                const r = this.rewardCatalog.find(cat => cat.id === rid);
                return r && r.type === type;
            });
        }

        gainXP(amount) {
            if (!this.player) return;
            let multiplier = this.hasRewardType('buff_score_palabras') ? 1.2 : 1;
            this.player.xp += Math.floor(amount * multiplier);
            this.checkLevelUp();
            this.saveGame();
        }

        checkLevelUp() {
            if (!this.player) return;
            let nextLevelXP = this.player.level * 1000;
            if (this.player.xp >= nextLevelXP) {
                this.player.xp -= nextLevelXP;
                this.player.level++;
                this.checkUnlocks();
                const event = new CustomEvent('adv_levelup', { detail: { level: this.player.level } });
                document.dispatchEvent(event);
            }
        }

        checkUnlocks() {
            if (!this.player) return;
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
        }

        unlockReward(rewardId) {
            if (!this.player || this.player.rewards.includes(rewardId)) return;
            this.player.rewards.push(rewardId);
            this.saveGame();
            const reward = this.rewardCatalog.find(r => r.id === rewardId);
            if (reward) {
                const event = new CustomEvent('adv_reward', { detail: reward });
                document.dispatchEvent(event);
            }
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

        updateGameStats(gameId, score, level, won) {
            if (!this.player) return;
            if (!this.player.gameStats[gameId]) {
                this.player.gameStats[gameId] = { score: 0, level: 1, plays: 0, wins: 0, bestScore: 0 };
            }
            const stats = this.player.gameStats[gameId];
            stats.score += score;
            stats.plays++;
            stats.level = Math.max(stats.level, level);
            stats.bestScore = Math.max(stats.bestScore, score);
            if (won) stats.wins++;
            this.player.totalScore += score;
            this.saveGame();
        }

        getGameStats(gameId) {
            if (!this.player) return { score: 0, level: 1, plays: 0, wins: 0, bestScore: 0 };
            return this.player.gameStats[gameId] || { score: 0, level: 1, plays: 0, wins: 0, bestScore: 0 };
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
            this.player.lives = this.hasRewardType('buff_lives_global') ? 4 : 3;
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

        // Para juegos que necesitan acceso directo
        getPlayer() {
            return this.player;
        }

        isLoggedIn() {
            return this.player !== null;
        }
    }

    // Singleton
    let instance = null;
    function getGameCore() {
        if (!instance) instance = new GameCore();
        return instance;
    }

    global.gameCore = getGameCore();
})(window);
