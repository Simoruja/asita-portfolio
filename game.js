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
    { id: 'card',   label: 'Playing cards', icon: '🂡' },
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

  /* ───────────── Settings ───────────── */

  const SIZES = { '4x4': [4, 4], '5x5': [5, 5], '6x6': [6, 6], '7x7': [7, 7], '8x8': [8, 8] };
  const DIM_RANGE = [2, 8];          // custom rows and columns
  const MISMATCH_MS = 900;           // how long two cards that don't match stay face up
  const custom = { rows: 4, cols: 5 };

  /* ───────────── Helpers ───────────── */

  const $ = id => document.getElementById(id);
  const sections = { setup: $('setup'), play: $('play'), results: $('results') };
  const show = name => {
    Object.entries(sections).forEach(([k, el]) => el.hidden = k !== name);
    document.body.classList.toggle('playing', name === 'play');
    window.scrollTo(0, 0);
  };
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const radio = name => document.querySelector(`input[name="${name}"]:checked`).value;
  const checkedCats = () => [...document.querySelectorAll('input[name="cat"]:checked')].map(i => i.value);
  const plural = (n, one, many = one + 's') => `${n} ${n === 1 ? one : many}`;
  const sizeLabel = (r, c) => `${r} × ${c}`;
  const fmt = ms => {
    const t = Math.max(0, Math.floor(ms / 100)); // tenths
    const m = Math.floor(t / 600), s = Math.floor(t / 10) % 60, d = t % 10;
    return `${m}:${String(s).padStart(2, '0')}.${d}`;
  };
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

  /* ───────────── Setup screen ───────────── */

  const catSeg = $('catSeg');
  CATEGORIES.forEach(c => {
    catSeg.insertAdjacentHTML('beforeend',
      `<input type="checkbox" name="cat" id="cat-${c.id}" value="${c.id}" checked><label for="cat-${c.id}"><span aria-hidden="true">${c.icon}</span>${c.label}</label>`);
  });

  const saved = store.get('match-settings');
  if (saved && typeof saved === 'object') {
    const el = [...document.querySelectorAll('input[name="size"]')].find(i => i.value === String(saved.size));
    if (el) el.checked = true;
    if (Array.isArray(saved.cats) && saved.cats.length) {
      document.querySelectorAll('input[name="cat"]').forEach(i => i.checked = saved.cats.includes(i.value));
    }
    const num = (v, fallback) => typeof v === 'number' && Number.isFinite(v) ? Math.min(DIM_RANGE[1], Math.max(DIM_RANGE[0], Math.round(v))) : fallback;
    if (saved.custom && typeof saved.custom === 'object') {
      custom.rows = num(saved.custom.rows, custom.rows);
      custom.cols = num(saved.custom.cols, custom.cols);
    }
  }

  function boardDims() {
    const size = radio('size');
    return size === 'custom' ? [custom.rows, custom.cols] : SIZES[size];
  }
  const bestKey = (r, c) => `match-best-${r}x${c}`;

  function setCustom(field, raw) {
    const n = String(raw).trim() === '' ? NaN : Number(raw);
    if (Number.isFinite(n)) custom[field] = Math.min(DIM_RANGE[1], Math.max(DIM_RANGE[0], Math.round(n)));
    renderCustom();
    updateSetup();
  }

  function renderCustom() {
    for (const field of ['rows', 'cols']) $('c-' + field).value = custom[field];
    document.querySelectorAll('#customField .step').forEach(b => {
      const v = custom[b.dataset.for.slice(2)];
      const off = +b.dataset.step < 0 ? v <= DIM_RANGE[0] : v >= DIM_RANGE[1];
      // a focused button that becomes disabled would drop focus to <body>; hand it to the opposite button
      if (off && document.activeElement === b) b.parentElement.querySelector(`.step[data-step="${-b.dataset.step}"]`).focus();
      b.disabled = off;
    });
  }

  function updateSetup() {
    const [rows, cols] = boardDims(), cats = checkedCats();
    const spaces = rows * cols, pairs = Math.floor(spaces / 2), free = spaces % 2 === 1;
    $('customField').hidden = radio('size') !== 'custom';
    $('sizeHint').textContent = `${sizeLabel(rows, cols)}: ${pairs * 2} cards (${plural(pairs, 'pair')})` +
      (free ? ', plus a free space in the middle.' : '.');

    const available = CATALOGUE.filter(it => cats.includes(it.cat)).length;
    const hint = $('catHint');
    let ok = true;
    if (!cats.length) { hint.textContent = 'Choose at least one kind of object.'; ok = false; }
    else if (available < pairs) {
      hint.textContent = `Not enough different objects for ${plural(pairs, 'pair')}: the kinds you chose have ${available}. Add another kind of object or choose a smaller board.`;
      ok = false;
    } else hint.textContent = `${available} different objects to deal from. Each round deals new ones.`;
    hint.classList.toggle('warn', !ok);
    $('startBtn').disabled = !ok;

    const best = store.get(bestKey(rows, cols));
    $('bestLine').innerHTML = best && best.time
      ? `Your best on ${sizeLabel(rows, cols)}: <b>${fmt(best.time)}</b>` + (best.moves ? `, fewest moves <b>${best.moves}</b>` : '')
      : `No best time on ${sizeLabel(rows, cols)} yet.`;
  }

  document.querySelectorAll('#setup input[type="radio"], #setup input[type="checkbox"]').forEach(i =>
    i.addEventListener('change', updateSetup));
  document.querySelectorAll('#customField .step').forEach(b =>
    b.addEventListener('click', () => setCustom(b.dataset.for.slice(2), custom[b.dataset.for.slice(2)] + +b.dataset.step)));
  ['rows', 'cols'].forEach(field => $('c-' + field).addEventListener('change', e => setCustom(field, e.target.value)));
  renderCustom();
  updateSetup();

  /* ───────────── Game ───────────── */

  let game = null;
  let recent = new Set();   // objects dealt last round, avoided in the next one where possible
  const history = [];       // rounds played this visit
  let clockRaf = 0;

  function deal() {
    const [rows, cols] = boardDims(), cats = checkedCats();
    store.set('match-settings', { size: radio('size'), cats, custom });
    const spaces = rows * cols, pairs = Math.floor(spaces / 2);

    const pool = CATALOGUE.filter(it => cats.includes(it.cat));
    const chosen = pickBalanced(pairs, pool.filter(it => !recent.has(it.key)));
    if (chosen.length < pairs) {
      const taken = new Set(chosen.map(i => i.key));
      chosen.push(...pickBalanced(pairs - chosen.length, pool.filter(it => !taken.has(it.key))));
    }
    recent = new Set(chosen.map(i => i.key));

    clearPending();
    stopClock();
    game = {
      rows, cols, pairs, found: 0, moves: 0, misses: 0,
      cards: [], first: null, pending: null,
      started: false, running: false, paused: false, done: false,
      elapsed: 0, t0: 0,
    };

    const deck = shuffle([...chosen, ...chosen]);
    const freeIdx = spaces % 2 === 1 ? Math.floor(spaces / 2) : -1;
    const board = $('board');
    board.replaceChildren();
    board.classList.remove('paused-hide');
    for (let i = 0; i < spaces; i++) {
      if (i === freeIdx) {
        const f = document.createElement('div');
        f.className = 'free';
        f.textContent = '★';
        f.setAttribute('aria-hidden', 'true');
        board.appendChild(f);
        continue;
      }
      const it = deck.pop();
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'mcard';
      el.innerHTML = `<span class="inner" aria-hidden="true"><span class="side back"></span><span class="side face">${it.html}</span></span>`;
      const card = { idx: game.cards.length, key: it.key, name: it.name, el, up: false, matched: false, pos: i };
      el.addEventListener('click', () => onCard(card));
      game.cards.push(card);
      board.appendChild(el);
    }
    game.cards.forEach(labelCard);

    $('hudTotal').textContent = pairs;
    $('pausedCover').hidden = true;
    $('pauseBtn').textContent = 'Pause';
    setStatus('The timer starts on your first tap.');
    updateHud();
    show('play');
    layout();
    $('hudTime').textContent = fmt(0);
  }

  function labelCard(c) {
    const where = `Row ${Math.floor(c.pos / game.cols) + 1}, column ${c.pos % game.cols + 1}`;
    c.el.setAttribute('aria-label', c.matched ? `${c.name}, matched` : c.up ? `${where}: ${c.name}` : `${where}: face down`);
    c.el.setAttribute('aria-disabled', String(c.matched));
  }

  function setStatus(text, kind = '') {
    const s = $('status');
    s.textContent = text;
    s.className = 'status' + (kind ? ' ' + kind : '');
  }

  function updateHud() {
    $('hudPairs').textContent = game.found;
    $('hudMoves').textContent = game.moves;
  }

  function onCard(c) {
    if (!game || game.done || game.paused || c.matched) return;
    // tapping on while two non-matching cards are still showing turns them back at once
    if (game.pending) clearPending();
    if (c.up) return;
    if (!game.started) startClock();

    c.up = true;
    c.el.classList.add('up');
    labelCard(c);

    if (!game.first) { game.first = c; return; }
    const a = game.first;
    game.first = null;
    game.moves++;
    if (a.key === c.key) {
      for (const x of [a, c]) {
        x.matched = true;
        x.el.classList.add('matched', 'just-matched');
        labelCard(x);
      }
      game.found++;
      setStatus(`Match: ${c.name}`, 'good');
      if (game.found === game.pairs) finish();
    } else {
      game.misses++;
      a.el.classList.add('miss');
      c.el.classList.add('miss');
      setStatus('Not a match.', 'bad');
      game.pending = { cards: [a, c], timer: setTimeout(clearPending, MISMATCH_MS) };
    }
    updateHud();
  }

  // Turns the two cards of a failed try face down again.
  function clearPending() {
    if (!game || !game.pending) return;
    clearTimeout(game.pending.timer);
    for (const x of game.pending.cards) {
      x.up = false;
      x.el.classList.remove('up', 'miss');
      labelCard(x);
    }
    game.pending = null;
  }

  /* ───────────── Clock ───────────── */

  const now = () => performance.now();
  const elapsed = () => game.elapsed + (game.running ? now() - game.t0 : 0);
  function startClock() {
    game.started = true;
    game.running = true;
    game.t0 = now();
    tick();
  }
  function tick() {
    if (!game || !game.running) return;
    $('hudTime').textContent = fmt(elapsed());
    clockRaf = requestAnimationFrame(tick);
  }
  function stopClock() {
    cancelAnimationFrame(clockRaf);
    if (game && game.running) { game.elapsed = elapsed(); game.running = false; }
  }

  function pause() {
    if (!game || game.done || game.paused) return;
    clearPending();
    stopClock();
    game.paused = true;
    $('board').classList.add('paused-hide');
    $('pausedCover').hidden = false;
    $('pauseBtn').textContent = 'Resume';
    $('resumeBtn').focus();
  }
  function resume() {
    if (!game || !game.paused) return;
    game.paused = false;
    $('board').classList.remove('paused-hide');
    $('pausedCover').hidden = true;
    $('pauseBtn').textContent = 'Pause';
    if (game.started) { game.running = true; game.t0 = now(); tick(); }
    $('hudTime').textContent = fmt(elapsed());
  }
  // a timed game can't keep running while the player is in another app or tab
  document.addEventListener('visibilitychange', () => { if (document.hidden && game && game.started) pause(); });

  /* ───────────── Board layout ─────────────
     Cards are sized so the whole board fits on screen without scrolling. A rectangular board
     is turned to match the screen if that gives bigger cards. */

  function layout() {
    if (!game || sections.play.hidden) return;
    const board = $('board'), wrap = $('boardWrap');
    const viewH = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    const W = wrap.clientWidth;
    const top = wrap.getBoundingClientRect().top + window.scrollY;
    const below = $('playActions').offsetHeight + 12 + 18; // action buttons, their margin, page padding
    const H = Math.max(160, viewH - top - below);
    const gap = parseFloat(getComputedStyle(board).getPropertyValue('--gap')) || 8;
    const fit = (cols, rows) => Math.floor(Math.min((W - gap * (cols - 1)) / cols, (H - gap * (rows - 1)) / rows));

    let cols = game.cols, rows = game.rows, cs = fit(cols, rows);
    if (rows !== cols && fit(rows, cols) > cs) { [cols, rows] = [rows, cols]; cs = fit(cols, rows); }
    cs = Math.max(26, Math.min(cs, 132));
    game.dispCols = cols;
    board.style.setProperty('--cols', cols);
    board.style.setProperty('--cs', cs + 'px');
  }
  window.addEventListener('resize', layout);
  if (window.visualViewport) window.visualViewport.addEventListener('resize', layout);

  // Arrow keys move between cards on the board.
  $('board').addEventListener('keydown', e => {
    if (!game) return;
    const moves = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -game.dispCols, ArrowDown: game.dispCols };
    if (!(e.key in moves)) return;
    const cells = [...$('board').children];
    let i = cells.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    do { i += moves[e.key]; } while (cells[i] && !cells[i].matches('button'));
    if (cells[i]) cells[i].focus();
  });

  /* ───────────── Finish ───────────── */

  function finish() {
    stopClock();
    game.done = true;
    const time = game.elapsed;
    $('hudTime').textContent = fmt(time);
    setStatus('All pairs found!', 'good');

    const key = bestKey(game.rows, game.cols);
    const prev = store.get(key) || {};
    const newBestTime = !prev.time || time < prev.time;
    const newBestMoves = !prev.moves || game.moves < prev.moves;
    store.set(key, { time: newBestTime ? time : prev.time, moves: newBestMoves ? game.moves : prev.moves });

    const acc = Math.round(100 * game.pairs / game.moves);
    history.push({ size: sizeLabel(game.rows, game.cols), time, moves: game.moves, acc, best: newBestTime });

    setTimeout(() => showResults({ time, newBestTime, newBestMoves, prev, acc }), 750);
  }

  function showResults({ time, newBestTime, newBestMoves, prev, acc }) {
    const size = sizeLabel(game.rows, game.cols);
    $('resultTitle').textContent = 'Table cleared!';
    $('finalTime').textContent = fmt(time);
    const msg = $('finalMsg');
    if (newBestTime && prev.time) { msg.textContent = `New best time on ${size}! Your previous best was ${fmt(prev.time)}.`; msg.className = 'best'; }
    else if (newBestTime) { msg.textContent = `Your first time on ${size}. Play again to beat it.`; msg.className = ''; }
    else { msg.textContent = `Your best on ${size} is ${fmt(prev.time)}.`; msg.className = ''; }

    $('finalStats').innerHTML = [
      ['Moves', game.moves + (newBestMoves && prev.moves ? ' ★' : '')],
      ['Misses', game.misses],
      ['Accuracy', acc + '%'],
      ['Pairs', game.pairs],
    ].map(([k, v]) => `<div class="stat"><div class="v">${v}</div><div class="k">${k}</div></div>`).join('');

    $('roundsTable').innerHTML = `
      <thead><tr><th>Round</th><th>Board</th><th>Time</th><th>Moves</th><th>Accuracy</th></tr></thead>
      <tbody>${history.map((r, i) => `<tr class="${i === history.length - 1 ? 'latest' : ''}"><td>${i + 1}</td><td>${r.size}</td><td class="${r.best ? 'best' : ''}">${fmt(r.time)}${r.best ? ' ★' : ''}</td><td>${r.moves}</td><td>${r.acc}%</td></tr>`).join('')}</tbody>`;
    show('results');
    updateSetup();
    $('againBtn').focus();
  }

  function quit() {
    clearPending();
    stopClock();
    game = null;
    show('setup');
    updateSetup();
  }

  $('startBtn').addEventListener('click', deal);
  $('pauseBtn').addEventListener('click', () => game && (game.paused ? resume() : pause()));
  $('resumeBtn').addEventListener('click', resume);
  $('restartBtn').addEventListener('click', deal);
  $('quitBtn').addEventListener('click', quit);
  $('againBtn').addEventListener('click', deal);
  $('setupBtn').addEventListener('click', () => { show('setup'); updateSetup(); });

  // exposed for automated tests only
  window.__match = { CATALOGUE, get game() { return game; } };
})();
