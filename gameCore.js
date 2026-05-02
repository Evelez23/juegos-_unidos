// gameCore.js - Versión Multi-Usuario
(function (global) {
  const STORAGE_KEY = 'juegosAuroraAdventure';
  
  const rewardCatalog = [
    { id: 'escudo_lluvia', name: 'Escudo de Lluvia', icon: '🛡️', rarity: 'raro', desc: '+1 Vida en Tormenta Veloz' },
    { id: 'lupa_magica', name: 'Lupa Reveladora', icon: '🔍', rarity: 'epico', desc: 'Bonus de puntos en Ruinas Antiguas' },
    { id: 'corazon_fenix', name: 'Corazón Fénix', icon: '❤️', rarity: 'legendario', desc: '+1 Intento extra permanente' }
  ];

  // Obtener usuario activo
  function getActiveUser() {
    const activeId = localStorage.getItem('aurora_active_user');
    if (!activeId) return null;
    
    const users = JSON.parse(localStorage.getItem('aurora_users') || '[]');
    return users.find(u => u.id === activeId);
  }

  // Guardar usuario
  function saveUser(user) {
    const users = JSON.parse(localStorage.getItem('aurora_users') || '[]');
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem('aurora_users', JSON.stringify(users));
  }

  // Estado por defecto para nuevo usuario
  function getDefaultStateForUser(userId, userName) {
    return {
      player: {
        id: userId,
        name: userName || 'Aventurero',
        xp: 0,
        level: 1,
        lives: 3,
        rewards: [],
        unlockedZones: ['alfabeto'],
        totalScore: 0,
        gameStats: {
          alfabeto: { score: 0, level: 1, plays: 0, wins: 0, bestScore: 0 },
          lluvia: { score: 0, level: 1, plays: 0, wins: 0, bestScore: 0 },
          palabras: { score: 0, level: 1, plays: 0, wins: 0, bestScore: 0 },
          ahorcado: { score: 0, level: 1, plays: 0, wins: 0, bestScore: 0 }
        }
      },
      settings: { language: 'es' },
      progress: { letters: {}, words: {} },
      metrics: { gamesPlayed: 0 }
    };
  }

  let gameCoreInstance = null;

  function getGameCore() {
    const activeUser = getActiveUser();
    if (!activeUser) {
      // Redirigir a selección de usuario si no hay activo
      if (window.location.pathname.indexOf('user_manager.html') === -1) {
        window.location.href = 'user_manager.html';
      }
      return null;
    }

    if (gameCoreInstance && gameCoreInstance.player.id === activeUser.id) {
      return gameCoreInstance;
    }

    // Cargar datos del usuario desde localStorage
    const userDataKey = `aurora_user_data_${activeUser.id}`;
    let savedData = localStorage.getItem(userDataKey);
    
    let state;
    if (savedData) {
      state = JSON.parse(savedData);
    } else {
      state = getDefaultStateForUser(activeUser.id, activeUser.name);
    }
    
    state.player.totalScore = activeUser.stats?.totalScore || 0;
    
    gameCoreInstance = {
      ...state,
      rewardCatalog,
      
      saveGame() {
        localStorage.setItem(userDataKey, JSON.stringify({
          player: this.player,
          settings: this.settings,
          progress: this.progress,
          metrics: this.metrics
        }));
        
        // También actualizar stats en la lista de usuarios
        const users = JSON.parse(localStorage.getItem('aurora_users') || '[]');
        const userIndex = users.findIndex(u => u.id === this.player.id);
        if (userIndex !== -1) {
          users[userIndex].stats = {
            totalScore: this.player.totalScore,
            level: this.player.level,
            xp: this.player.xp,
            rewards: this.player.rewards,
            games: this.player.gameStats
          };
          localStorage.setItem('aurora_users', JSON.stringify(users));
        }
      },
      
      loadGame() {
        // Ya se cargó al instanciar
      },
      
      gainXP(amount) {
        this.player.xp += amount;
        this.checkLevelUp();
        this.saveGame();
      },
      
      checkLevelUp() {
        let nextLevelXP = this.player.level * 500;
        if (this.player.xp >= nextLevelXP) {
          this.player.xp -= nextLevelXP;
          this.player.level++;
          this.checkUnlocks();
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
      
      addScore(amount, gameId) {
        this.player.totalScore += amount;
        if (gameId && this.player.gameStats[gameId]) {
          this.player.gameStats[gameId].score += amount;
          this.player.gameStats[gameId].bestScore = Math.max(this.player.gameStats[gameId].bestScore, this.player.gameStats[gameId].score);
        }
        this.saveGame();
      },
      
      updateGameStats(gameId, score, level, won) {
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
      },
      
      getGameStats(gameId) {
        return this.player.gameStats[gameId] || { score: 0, level: 1, plays: 0, wins: 0, bestScore: 0 };
      },
      
      setLanguage(lang) {
        this.settings.language = lang;
        this.saveGame();
      },
      
      loseLife() {
        this.player.lives = Math.max(0, this.player.lives - 1);
        this.saveGame();
      },
      
      gainLife() {
        this.player.lives = Math.min(5, this.player.lives + 1);
        this.saveGame();
      },
      
      resetSessionLives(level) {
        this.player.lives = 3;
        this.player.level = level;
      },
      
      registerLetterResult(letter, correct) {
        if (!this.progress.letters[letter]) this.progress.letters[letter] = { correct: 0, wrong: 0 };
        if (correct) this.progress.letters[letter].correct++;
        else this.progress.letters[letter].wrong++;
        this.saveGame();
      },
      
      registerWordResult(word, correct) {
        if (!this.progress.words[word]) this.progress.words[word] = { correct: 0, wrong: 0 };
        if (correct) this.progress.words[word].correct++;
        else this.progress.words[word].wrong++;
        this.saveGame();
      },
      
      canUseWord(word) {
        const usage = this.progress.words[word];
        if (!usage) return true;
        return usage.correct < 2;
      },
      
      getLetterWeight(letter) {
        const usage = this.progress.letters[letter];
        if (!usage) return 3;
        const ratio = usage.correct / (usage.correct + usage.wrong + 1);
        if (ratio < 0.3) return 5;
        if (ratio < 0.6) return 3;
        return 1;
      }
    };
    
    return gameCoreInstance;
  }

  // Exponer al global
  Object.defineProperty(global, 'gameCore', {
    get: function() { return getGameCore(); }
  });
  
  // Forzar redirección si no hay usuario activo
  if (!getActiveUser() && window.location.pathname.indexOf('user_manager.html') === -1 && window.location.pathname.indexOf('profile.html') === -1) {
    setTimeout(() => {
      window.location.href = 'user_manager.html';
    }, 100);
  }
})(window);
