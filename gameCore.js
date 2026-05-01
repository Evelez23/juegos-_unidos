(function (global) {
 // Agregar al gameCore.js (actualizar)
const STORAGE_KEY = 'juegosAuroraAdventure';

const defaultState = {
  player: {
    name: 'Aventurero',
    gender: 'boy',
    avatar: '👦',
    xp: 0,
    level: 1,
    lives: 3,
    rewards: [],
    unlockedZones: ['alfabeto'],
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

// Agregar este método al gameCore
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
  
  // También guardar en localStorage separado para compatibilidad
  localStorage.setItem(`aurora_stats_${gameId}`, JSON.stringify(stats));
  this.saveGame();
},

// También agregar para obtener estadísticas
getGameStats(gameId) {
  return this.player.gameStats[gameId] || { score: 0, level: 1, plays: 0, wins: 0, bestScore: 0 };
}

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
