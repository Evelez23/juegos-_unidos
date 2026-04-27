(function (global) {
  const i18n = {
    es: {
      select_letter: 'Selecciona la letra',
      correct: 'Correcto',
      wrong: 'Intenta de nuevo',
      points: 'Puntos',
      lives: 'Vidas',
      level: 'Nivel',
      catch_letter: 'Atrapa la letra',
      game_over: '¡Juego Terminado!',
      next_word: 'Siguiente Palabra',
      collection_title: 'Colección de Recompensas',
      unlocked: 'Desbloqueadas',
      locked: 'Bloqueadas'
    },
    en: {
      select_letter: 'Select the letter',
      correct: 'Correct',
      wrong: 'Try again',
      points: 'Points',
      lives: 'Lives',
      level: 'Level',
      catch_letter: 'Catch the letter',
      game_over: 'Game Over!',
      next_word: 'Next Word',
      collection_title: 'Rewards Collection',
      unlocked: 'Unlocked',
      locked: 'Locked'
    }
  };

  function t(key) {
    const lang = (global.gameCore && global.gameCore.settings.language) || 'es';
    return (i18n[lang] && i18n[lang][key]) || i18n.es[key] || key;
  }

  global.i18n = i18n;
  global.t = t;
})(window);
