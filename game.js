(() => {
  'use strict';

  /* ───────────── Object catalogue ─────────────
     Every object has a unique key, a category, a readable name and a visual. */

  const EMOJI = [
    ['🔑','Key'],['⌚','Watch'],['📎','Paper clip'],['✏️','Pencil'],['🪙','Coin'],['🕯️','Candle'],
    ['🧭','Compass'],['🔦','Torch'],['🧵','Thread'],['🧷','Safety pin'],['✂️','Scissors'],['📏','Ruler'],
    ['🔋','Battery'],['💡','Light bulb'],['🔍','Magnifier'],['📌','Pin'],['🖊️','Pen'],['🎲','Die'],
    ['🧩','Puzzle piece'],['🪀','Yo-yo'],['🎈','Balloon'],['🧸','Teddy bear'],['🪁','Kite'],['🍎','Apple'],
    ['🍋','Lemon'],['🥕','Carrot'],['🍌','Banana'],['🧀','Cheese'],['🥚','Egg'],['🍄','Mushroom'],
    ['🌰','Chestnut'],['🐚','Shell'],['🪶','Feather'],['🍂','Leaf'],['🌸','Flower'],['🪨','Stone'],
    ['🥄','Spoon'],['🍴','Fork'],['☕','Cup'],['🔔','Bell'],['✉️','Envelope'],['📚','Books'],
    ['🧲','Magnet'],['🪥','Toothbrush'],['🧼','Soap'],['🧽','Sponge'],['👓','Glasses'],['🧤','Gloves'],
    ['🧦','Socks'],['🎩','Top hat'],['🧣','Scarf'],['💍','Ring'],['🎀','Ribbon'],['⚽','Football'],
    ['🏀','Basketball'],['🎾','Tennis ball'],['🎯','Dart board'],['⏰','Alarm clock'],['📷','Camera'],['📱','Phone'],
    ['🎧','Headphones'],['🪜','Ladder'],['🔨','Hammer'],['🪛','Screwdriver'],['🔧','Spanner'],['🧰','Toolbox'],
    ['🪣','Bucket'],['🌂','Umbrella'],['🎸','Guitar'],['🥁','Drum'],['🎺','Trumpet'],['🚲','Bicycle'],
    ['⚓','Anchor'],['🏆','Trophy'],['🎁','Gift'],['🧁','Cupcake'],['🍩','Doughnut'],['🐢','Tortoise'],
    ['🦋','Butterfly'],['🐝','Bee'],['🌵','Cactus'],['🌙','Moon'],['☂️','Parasol'],['🪴','Pot plant'],
  ];

  const COLOURS = [
    ['Red', '#d64541'], ['Orange', '#e67e22'], ['Yellow', '#f1c40f'],
    ['Green', '#27ae60'], ['Blue', '#2e86de'], ['Purple', '#8e44ad'],
  ];
  // SVG bodies drawn in a 100×100 box; {c} is replaced with the fill colour
  const SHAPES = {
    Circle:   '<circle cx="50" cy="50" r="42" fill="{c}"/>',
    Square:   '<rect x="12" y="12" width="76" height="76" rx="6" fill="{c}"/>',
    Triangle: '<polygon points="50,8 94,88 6,88" fill="{c}" stroke="{c}" stroke-width="4" stroke-linejoin="round"/>',
    Star:     '<polygon points="50,5 61,38 96,38 68,59 78,93 50,72 22,93 32,59 4,38 39,38" fill="{c}"/>',
    Heart:    '<path d="M50 90 C20 68 4 50 4 32 C4 16 16 6 30 6 C40 6 46 12 50 20 C54 12 60 6 70 6 C84 6 96 16 96 32 C96 50 80 68 50 90Z" fill="{c}"/>',
    Hexagon:  '<polygon points="50,4 90,27 90,73 50,96 10,73 10,27" fill="{c}"/>',
    Diamond:  '<polygon points="50,4 94,50 50,96 6,50" fill="{c}"/>',
    Moon:     '<path d="M64 6 A44 44 0 1 0 94 70 A36 36 0 1 1 64 6Z" fill="{c}"/>',
  };
  const SUITS = [['♠','spades',false],['♥','hearts',true],['♦','diamonds',true],['♣','clubs',false]];
  const RANKS = [['A','Ace'],['2','2'],['3','3'],['4','4'],['5','5'],['6','6'],['7','7'],['8','8'],['9','9'],['10','10'],['J','Jack'],['Q','Queen'],['K','King']];

  const CATEGORIES = [
    { id: 'emoji',  label: 'Pictures', icon: '🍎' },
    { id: 'shape',  label: 'Shapes',   icon: '🔷' },
    { id: 'number', label: 'Numbers',  icon: '🔢' },
    { id: 'letter', label: 'Letters',  icon: '🔤' },
    { id: 'card',   label: 'Cards',    icon: '🂡' },
  ];

  const CATALOGUE = [];
  EMOJI.forEach(([e, name]) => CATALOGUE.push({ key: 'e:' + name, cat: 'emoji', name, html: `<span class="vis emoji">${e}</span>` }));
  for (const [shape, svg] of Object.entries(SHAPES)) {
    for (const [cname, hex] of COLOURS) {
      CATALOGUE.push({
        key: `s:${cname}:${shape}`, cat: 'shape', name: `${cname} ${shape.toLowerCase()}`,
        html: `<span class="vis shape"><svg viewBox="0 0 100 100" aria-hidden="true">${svg.replaceAll('{c}', hex)}</svg></span>`,
      });
    }
  }
  for (let n = 1; n <= 99; n++) CATALOGUE.push({ key: 'n:' + n, cat: 'number', name: 'Number ' + n, html: `<span class="vis number">${n}</span>` });
  for (const L of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') CATALOGUE.push({ key: 'l:' + L, cat: 'letter', name: 'Letter ' + L, html: `<span class="vis letter">${L}</span>` });
  for (const [sym, suit, red] of SUITS) {
    for (const [r, rname] of RANKS) {
      CATALOGUE.push({
        key: `c:${r}${sym}`, cat: 'card', name: `${rname} of ${suit}`,
        html: `<span class="vis card${red ? ' red' : ''}"><span>${r}</span><span class="suit">${sym}</span></span>`,
      });
    }
  }
  const BY_KEY = new Map(CATALOGUE.map(it => [it.key, it]));

  /* ───────────── Settings ───────────── */

  // shown: objects on the tray; study: seconds; missing: objects removed (missing mode);
  // pool: total choices in recall mode
  const LEVELS = {
    easy:   { shown: 8,  study: 20, missing: 1, pool: 14 },
    medium: { shown: 12, study: 25, missing: 2, pool: 20 },
    hard:   { shown: 16, study: 30, missing: 3, pool: 28 },
  };
  const COVER_MS = 1800;
  const decoyCount = (mode, lvl) => mode === 'missing' ? Math.max(5, lvl.missing * 3) : lvl.pool - lvl.shown;

  /* ───────────── Helpers ───────────── */

  const $ = id => document.getElementById(id);
  const sections = { setup: $('setup'), play: $('play'), summary: $('summary') };
  const show = name => {
    Object.entries(sections).forEach(([k, el]) => el.hidden = k !== name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const radio = name => document.querySelector(`input[name="${name}"]:checked`).value;
  const checkedCats = () => [...document.querySelectorAll('input[name="cat"]:checked')].map(i => i.value);
  const plural = (n, one, many = one + 's') => `${n} ${n === 1 ? one : many}`;

  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };

  // Picks n items spread evenly across categories (round-robin over shuffled groups).
  function pickBalanced(n, candidates) {
    const groups = new Map();
    for (const it of shuffle(candidates)) {
      if (!groups.has(it.cat)) groups.set(it.cat, []);
      groups.get(it.cat).push(it);
    }
    const lists = shuffle([...groups.values()]);
    const out = [];
    while (out.length < n && lists.some(l => l.length)) {
      for (const l of lists) if (l.length && out.length < n) out.push(l.pop());
    }
    return out;
  }

  // Prefers objects the player hasn't seen at all this game, then falls back to ones only seen as decoys.
  // Objects that have been on a tray are never reused.
  function pickFresh(n, exclude = new Set()) {
    const ok = it => game.cats.includes(it.cat) && !game.onTray.has(it.key) && !exclude.has(it.key);
    const fresh = pickBalanced(n, CATALOGUE.filter(it => ok(it) && !game.seen.has(it.key)));
    if (fresh.length < n) {
      const taken = new Set(fresh.map(i => i.key));
      fresh.push(...pickBalanced(n - fresh.length, CATALOGUE.filter(it => ok(it) && game.seen.has(it.key) && !taken.has(it.key))));
    }
    return fresh;
  }

  function itemEl(it, { button = false } = {}) {
    const el = document.createElement(button ? 'button' : 'div');
    el.className = 'item';
    if (button) { el.type = 'button'; el.setAttribute('aria-pressed', 'false'); el.setAttribute('aria-label', it.name); }
    el.innerHTML = `${it.html}<span class="nm">${it.name}</span>`;
    el.dataset.key = it.key;
    return el;
  }
  function trayOf(items, cls = '') {
    const g = document.createElement('div');
    g.className = 'tray';
    items.forEach(it => { const e = itemEl(it); if (cls) e.classList.add(cls); g.appendChild(e); });
    return g;
  }

  /* ───────────── Setup screen ───────────── */

  const catSeg = $('catSeg');
  CATEGORIES.forEach(c => {
    catSeg.insertAdjacentHTML('beforeend',
      `<input type="checkbox" name="cat" id="cat-${c.id}" value="${c.id}" checked><label for="cat-${c.id}"><span aria-hidden="true">${c.icon}</span>${c.label}</label>`);
  });

  const saved = store.get('kims-settings');
  if (saved) {
    for (const k of ['mode', 'diff', 'rounds']) {
      const el = document.querySelector(`input[name="${k}"][value="${saved[k]}"]`);
      if (el) el.checked = true;
    }
    if (Array.isArray(saved.cats) && saved.cats.length) {
      document.querySelectorAll('input[name="cat"]').forEach(i => i.checked = saved.cats.includes(i.value));
    }
  }

  function updateSetup() {
    const mode = radio('mode'), lvl = LEVELS[radio('diff')], rounds = +radio('rounds'), cats = checkedCats();
    $('diffHint').textContent = `${lvl.shown} objects, ${lvl.study} seconds to study.`;
    $('modeHint').textContent = mode === 'missing'
      ? `Spot the ${lvl.missing === 1 ? 'object' : lvl.missing + ' objects'} taken off the tray.`
      : `Pick out all ${lvl.shown} objects from a mix of ${lvl.pool}.`;

    const available = CATALOGUE.filter(it => cats.includes(it.cat)).length;
    const needed = rounds * lvl.shown + decoyCount(mode, lvl);
    const hint = $('catHint');
    let ok = true;
    if (!cats.length) { hint.textContent = 'Choose at least one kind of object.'; ok = false; }
    else if (available < needed) {
      hint.textContent = `Not enough different objects for ${rounds} rounds without repeats. Add another kind or play fewer rounds.`;
      ok = false;
    } else hint.textContent = `${available} different objects. None will appear on the tray twice in a game.`;
    hint.classList.toggle('warn', !ok);
    $('startBtn').disabled = !ok;
  }
  document.querySelectorAll('#setup input').forEach(i => i.addEventListener('change', updateSetup));
  updateSetup();

  /* ───────────── Game flow ───────────── */

  let game = null;
  const timer = { raf: 0, remaining: 0, last: 0, total: 0, done: null };
  let coverTimeout = 0;

  function startGame() {
    const settings = { mode: radio('mode'), diff: radio('diff'), rounds: radio('rounds'), cats: checkedCats() };
    store.set('kims-settings', settings);
    game = {
      ...settings, rounds: +settings.rounds, lvl: LEVELS[settings.diff],
      round: 0, score: 0, history: [],
      onTray: new Set(), // keys that have been on a tray: never shown on a tray again
      seen: new Set(),   // keys shown in any way (tray or decoy)
    };
    $('hudRounds').textContent = game.rounds;
    $('hudMode').textContent = (game.mode === 'missing' ? "What's missing?" : 'Recall') + ' · ' + game.diff[0].toUpperCase() + game.diff.slice(1);
    show('play');
    nextRound();
  }

  function setButtons({ skip = false, submit = false, next = false }) {
    $('skipBtn').hidden = !skip;
    $('submitBtn').hidden = !submit;
    $('nextBtn').hidden = !next;
  }

  function nextRound() {
    game.round++;
    $('hudRound').textContent = game.round;
    $('hudScore').textContent = game.score;

    game.tray = shuffle(pickFresh(game.lvl.shown));
    game.tray.forEach(it => { game.onTray.add(it.key); game.seen.add(it.key); });
    game.picked = new Set();
    game.checked = false;

    $('scorecard').hidden = true;
    $('choicesWrap').hidden = true;
    $('timer').hidden = false;
    setButtons({ skip: true });
    $('phase').textContent = 'Memorise';
    $('trayWrap').replaceChildren(trayOf(game.tray));
    startTimer(game.lvl.study * 1000, coverTray);
  }

  // Study timer. It pauses while the page is hidden (e.g. switching apps on a phone).
  function startTimer(ms, done) {
    cancelAnimationFrame(timer.raf);
    Object.assign(timer, { remaining: ms, total: ms, last: performance.now(), done });
    timer.raf = requestAnimationFrame(tickTimer);
  }
  function tickTimer(now) {
    timer.remaining -= now - timer.last;
    timer.last = now;
    const f = Math.max(0, timer.remaining / timer.total);
    $('timerBar').style.transform = `scaleX(${f})`;
    $('instr').textContent = `Study the tray carefully. ${Math.ceil(Math.max(0, timer.remaining) / 1000)}s left`;
    if (timer.remaining > 0) timer.raf = requestAnimationFrame(tickTimer);
    else { timer.done = null; coverTray(); }
  }
  function stopTimer() { cancelAnimationFrame(timer.raf); timer.done = null; }
  document.addEventListener('visibilitychange', () => {
    if (!timer.done) return;
    if (document.hidden) cancelAnimationFrame(timer.raf);
    else { timer.last = performance.now(); timer.raf = requestAnimationFrame(tickTimer); }
  });

  function coverTray() {
    stopTimer();
    setButtons({});
    $('timer').hidden = true;
    $('phase').textContent = 'Covered';
    $('instr').textContent = 'The tray is covered…';
    const blank = document.createElement('div');
    blank.className = 'tray blank';
    blank.innerHTML = '<div class="big" aria-hidden="true">?</div>';
    $('trayWrap').replaceChildren(blank);
    coverTimeout = setTimeout(game.mode === 'missing' ? askMissing : askRecall, COVER_MS);
  }

  function askMissing() {
    const removed = shuffle(game.tray).slice(0, game.lvl.missing);
    game.answer = new Set(removed.map(i => i.key));
    game.need = removed.length;

    $('phase').textContent = "What's missing?";
    $('instr').textContent = `${game.need === 1 ? 'One object has' : game.need + ' objects have'} been taken away.`;
    $('trayWrap').replaceChildren(trayOf(shuffle(game.tray).filter(it => !game.answer.has(it.key))));

    const decoys = pickFresh(decoyCount('missing', game.lvl));
    $('choicesLabel').textContent = `Pick the ${game.need === 1 ? 'missing object' : game.need + ' missing objects'}:`;
    renderChoices(shuffle([...removed, ...decoys]));
  }

  function askRecall() {
    game.answer = new Set(game.tray.map(i => i.key));
    game.need = game.tray.length;
    const decoys = pickFresh(decoyCount('recall', game.lvl));

    $('phase').textContent = 'Recall the tray';
    $('instr').textContent = '';
    $('trayWrap').replaceChildren();
    $('choicesLabel').textContent = `Pick all ${game.need} objects that were on the tray:`;
    renderChoices(shuffle([...game.tray, ...decoys]));
  }

  function renderChoices(list) {
    list.forEach(it => game.seen.add(it.key));
    const grid = $('choices');
    grid.replaceChildren();
    list.forEach(it => {
      const b = itemEl(it, { button: true });
      b.addEventListener('click', () => togglePick(b, it.key));
      grid.appendChild(b);
    });
    $('choicesWrap').hidden = false;
    setButtons({ submit: true });
    updateSubmit();
  }

  function togglePick(el, key) {
    if (game.checked) return;
    if (game.picked.has(key)) game.picked.delete(key);
    else {
      if (game.picked.size >= game.need) return; // can't pick more than the answer size
      game.picked.add(key);
    }
    el.classList.toggle('sel', game.picked.has(key));
    el.setAttribute('aria-pressed', String(game.picked.has(key)));
    updateSubmit();
  }

  function updateSubmit() {
    const n = game.picked.size;
    $('submitBtn').disabled = n === 0;
    $('submitBtn').textContent = `Check answer (${n}/${game.need})`;
  }

  /* ───────────── Round scoring ───────────── */

  function checkAnswer() {
    game.checked = true;
    const correct = [], wrong = [], missed = [];
    for (const key of game.picked) (game.answer.has(key) ? correct : wrong).push(BY_KEY.get(key));
    for (const key of game.answer) if (!game.picked.has(key)) missed.push(BY_KEY.get(key));

    const pts = Math.max(0, correct.length - wrong.length);
    game.score += pts;
    game.history.push({ round: game.round, correct: correct.length, wrong: wrong.length, missed: missed.length, need: game.need, pts });
    $('hudScore').textContent = game.score;

    const perfect = correct.length === game.need && !wrong.length;
    $('phase').textContent = perfect ? 'Perfect round!' : correct.length ? `Round ${game.round} scorecard` : 'Not this time';
    $('instr').textContent = '';
    $('trayWrap').replaceChildren();
    $('choicesWrap').hidden = true;

    renderScorecard({ correct, wrong, missed, pts, perfect });

    setButtons({ next: true });
    $('nextBtn').textContent = game.round >= game.rounds ? 'See final results' : 'Next round';
    $('play').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderScorecard({ correct, wrong, missed, pts, perfect }) {
    const answerWhy = game.mode === 'missing' ? 'Each one was taken off the tray.' : 'Each one was on the tray.';
    const section = (cls, title, why, items, tileCls) => items.length ? `
      <div class="sc-sec">
        <h4 class="${cls}">${title}</h4>
        <p class="why">${why}</p>
        <div class="tray" data-tiles="${tileCls}" data-keys="${items.map(i => i.key).join('|')}"></div>
      </div>` : '';

    const sc = $('scorecard');
    sc.className = 'scorecard';
    sc.innerHTML = `
      <div class="sc-head">
        <div class="pts">+${pts}<small>${pts === 1 ? 'point' : 'points'} this round</small></div>
        <div class="sc-tally">
          <span class="pill good">✓ ${correct.length} correct</span>
          <span class="pill bad">✗ ${wrong.length} wrong</span>
          <span class="pill miss">○ ${missed.length} missed</span>
        </div>
      </div>
      ${section('good', '✓ You answered correctly', `${answerWhy} +1 point each.`, correct, 'good')}
      ${section('bad', '✗ You answered incorrectly', game.mode === 'missing'
          ? 'These were never on the tray. −1 point each.'
          : 'These were not on the tray. −1 point each.', wrong, 'bad')}
      ${section('miss', '○ You missed', `You didn't pick these. ${answerWhy}`, missed, 'missed')}
      ${perfect ? '<div class="sc-sec"><h4 class="good">Perfect! You found every one with no mistakes.</h4></div>' : ''}
      <div class="sc-sec">
        <details>
          <summary class="why" style="cursor:pointer;margin:0">Show the whole tray from this round</summary>
          <div class="tray" style="margin-top:10px" data-tiles="full" data-keys="${game.tray.map(i => i.key).join('|')}"></div>
        </details>
      </div>
      <div class="sc-calc">${correct.length} correct − ${wrong.length} wrong = <b>${pts} ${pts === 1 ? 'point' : 'points'}</b>${correct.length - wrong.length < 0 ? ' (a round never goes below zero)' : ''} · Running total: <b>${game.score}</b></div>`;

    sc.querySelectorAll('.tray[data-keys]').forEach(g => {
      const kind = g.dataset.tiles;
      g.dataset.keys.split('|').forEach(k => {
        const it = BY_KEY.get(k), el = itemEl(it);
        if (kind === 'full') { if (game.answer.has(k)) el.classList.add(game.picked.has(k) ? 'good' : 'missed'); }
        else el.classList.add(kind);
        g.appendChild(el);
      });
    });
    sc.hidden = false;
  }

  /* ───────────── Final results ───────────── */

  function finish() {
    const h = game.history;
    const sum = k => h.reduce((a, r) => a + r[k], 0);
    const possible = sum('need'), correct = sum('correct'), wrong = sum('wrong'), missed = sum('missed');
    const perfectRounds = h.filter(r => r.correct === r.need && !r.wrong).length;

    const key = `kims-best-${game.mode}-${game.diff}-${game.rounds}-${[...game.cats].sort().join('')}`;
    const best = store.get(key) || 0;
    const newBest = game.score > best;
    if (newBest) store.set(key, game.score);
    const acc = possible ? Math.round(100 * correct / possible) : 0;

    $('finalScore').textContent = `${game.score} / ${possible}`;
    $('finalMsg').textContent = newBest && best > 0 ? 'New personal best!'
      : acc >= 90 ? 'An eye like Kim himself.'
      : acc >= 60 ? 'Sharp observation. Try a harder level?'
      : 'Keep practising. Your memory will sharpen.';
    $('finalStats').innerHTML = [
      ['Accuracy', acc + '%'],
      ['Perfect rounds', `${perfectRounds}/${game.rounds}`],
      ['Wrong picks', wrong],
      ['Best score', Math.max(best, game.score)],
    ].map(([k, v]) => `<div class="stat"><div class="v">${v}</div><div class="k">${k}</div></div>`).join('');

    $('roundsTable').innerHTML = `
      <thead><tr><th>Round</th><th>Correct</th><th>Wrong</th><th>Missed</th><th>Points</th></tr></thead>
      <tbody>${h.map(r => `<tr><td>${r.round}</td><td class="good">${r.correct}/${r.need}</td><td class="${r.wrong ? 'bad' : ''}">${r.wrong}</td><td>${r.missed}</td><td><b>${r.pts}</b></td></tr>`).join('')}</tbody>
      <tfoot><tr><td>Total</td><td class="good">${correct}/${possible}</td><td class="${wrong ? 'bad' : ''}">${wrong}</td><td>${missed}</td><td>${game.score}</td></tr></tfoot>`;
    show('summary');
  }

  function quit() {
    stopTimer();
    clearTimeout(coverTimeout);
    game = null;
    show('setup');
  }

  $('startBtn').addEventListener('click', startGame);
  $('skipBtn').addEventListener('click', coverTray);
  $('submitBtn').addEventListener('click', checkAnswer);
  $('nextBtn').addEventListener('click', () => game.round >= game.rounds ? finish() : nextRound());
  $('quitBtn').addEventListener('click', quit);
  $('againBtn').addEventListener('click', startGame);
  $('setupBtn').addEventListener('click', () => show('setup'));

  // exposed for automated tests only
  window.__kims = { CATALOGUE, get game() { return game; } };
})();
