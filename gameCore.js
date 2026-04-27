(function (global) {
  const STORAGE_KEY = 'juegosAuroraGameCoreV1';

  const rewardCatalog = [
    { id: 'letters_streak_10', nombre: 'Racha de 10 letras', icono: '🔤', condicion: 'completar 10 letras sin fallar' },
    { id: 'word_master_1', nombre: 'Primer constructor', icono: '🧩', condicion: 'completar una palabra completa' },
    { id: 'rain_survivor_lvl3', nombre: 'Superviviente lluvia', icono: '☔', condicion: 'sobrevivir nivel 3 en juego de caída' },
    { id: 'polyglot', nombre: 'Bilingüe curioso', icono: '🌍', condicion: 'jugar en español e inglés' }
  ];

  const defaultState = {
    player: {
      name: 'Peque Explorer',
      score: 0,
      lives: 3,
      level: 1,
      rewards: []
    },
    settings: {
      language: 'es'
    },
    progress: {
      letters: {},
      words: {}
    },
    metrics: {
      lettersWithoutFail: 0,
      languagesUsed: ['es']
    }
  };

  function clone(v) {
    return JSON.parse(JSON.stringify(v));
  }

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

    addScore(points) {
      const safe = Number(points) || 0;
      this.player.score += safe;
      this.saveGame();
    },

    loseLife() {
      this.player.lives = Math.max(0, this.player.lives - 1);
      this.metrics.lettersWithoutFail = 0;
      this.saveGame();
      return this.player.lives;
    },

    gainLife() {
      this.player.lives = Math.min(5, this.player.lives + 1);
      this.saveGame();
      return this.player.lives;
    },

    setLanguage(lang) {
      if (!['es', 'en'].includes(lang)) return;
      this.settings.language = lang;
      if (!this.metrics.languagesUsed.includes(lang)) {
        this.metrics.languagesUsed.push(lang);
      }
      if (this.metrics.languagesUsed.includes('es') && this.metrics.languagesUsed.includes('en')) {
        this.unlockReward('polyglot');
      }
      this.saveGame();
    },

    unlockReward(rewardId) {
      if (this.player.rewards.includes(rewardId)) return;
      this.player.rewards.push(rewardId);
      this.saveGame();
    },

    registerLetterResult(letter, ok) {
      const key = String(letter || '').toUpperCase();
      if (!key) return;
      if (!this.progress.letters[key]) this.progress.letters[key] = { hits: 0, fails: 0 };
      if (ok) {
        this.progress.letters[key].hits += 1;
        this.metrics.lettersWithoutFail += 1;
      } else {
        this.progress.letters[key].fails += 1;
        this.metrics.lettersWithoutFail = 0;
      }
      if (this.metrics.lettersWithoutFail >= 10) this.unlockReward('letters_streak_10');
      this.saveGame();
    },

    registerWordResult(word, completed) {
      const key = String(word || '').toUpperCase();
      if (!key) return;
      if (!this.progress.words[key]) this.progress.words[key] = { completed: 0, attempts: 0 };
      this.progress.words[key].attempts += 1;
      if (completed) {
        this.progress.words[key].completed += 1;
        this.unlockReward('word_master_1');
      }
      this.saveGame();
    },

    getLetterWeight(letter) {
      const l = this.progress.letters[String(letter || '').toUpperCase()] || { hits: 0, fails: 0 };
      const delta = l.fails - l.hits;
      return Math.max(1, 1 + delta);
    },

    canUseWord(word) {
      const len = String(word || '').replace(/\s/g, '').length;
      if (this.player.level <= 1) return len <= 3;
      if (this.player.level === 2) return len <= 4;
      return len >= 5;
    },

    resetSessionLives(level) {
      this.player.lives = 3;
      if (typeof level === 'number') this.player.level = level;
      this.saveGame();
    }
  };

  gameCore.loadGame();
  global.gameCore = gameCore;
})(window);
