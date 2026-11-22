/* Make Your Planner — quiz → page mix → live personalized preview → print or order.
   Pages come from pages.json (exported by ~/Claude/planners/export_pages.py). */
(function () {
  'use strict';

  // ---- Shopify: fill both to switch on "Order it printed" ----------------
  // domain = the store's myshopify domain, variantId = numeric id of the
  // "Personalized planner kit" product variant. Empty = button stays hidden.
  var SHOP = { domain: 'vki3si-dd.myshopify.com', variantId: '68353092059380' };

  var COLOURS = [
    { id: 'coral', name: 'Coral', accent: '#e0583b', accent2: '#ffd166', wash: '#fde9e2', cover: '#e0583b' },
    { id: 'cobalt', name: 'Cobalt', accent: '#2f5bd3', accent2: '#ffd166', wash: '#e8eefc', cover: '#1f3a8a' },
    { id: 'sage', name: 'Sage', accent: '#3f7f5f', accent2: '#c6e5b1', wash: '#e6f1ea', cover: '#2f5d46' },
    { id: 'lavender', name: 'Lavender', accent: '#7353c0', accent2: '#f6c8e3', wash: '#efe9fb', cover: '#43347a' },
    { id: 'teal', name: 'Teal', accent: '#0d8587', accent2: '#ffcf5c', wash: '#e0f2f1', cover: '#0b5e60' },
    { id: 'sunny', name: 'Sunny', accent: '#b8650a', accent2: '#ffe08a', wash: '#fdf1d8', cover: '#c26d0c' }
  ];
  var PRIMARY = {
    stuck: { planner: '01-stuck-starter', colour: 'coral', short: 'Stuck Starter', back: '02-17', notes: '01-16',
      pages: ['01-04', '01-05', '01-09', '01-14', '01-15'] },
    goal: { planner: '02-goal-getter', colour: 'cobalt', short: 'Goal Getter', back: '02-17', notes: '02-18',
      pages: ['02-03', '02-05', '02-06', '02-07', '02-10', '02-11', '02-12', '02-13', '02-14'] },
    habit: { planner: '03-habit-builder', colour: 'sage', short: 'Habit Builder', back: '03-12', notes: '03-14',
      pages: ['03-03', '03-04', '03-05', '03-06', '03-07', '03-08', '03-13'] },
    gentle: { planner: '04-gentle-reset', colour: 'lavender', short: 'Gentle Reset', back: '04-12', notes: '04-13',
      pages: ['04-04', '04-05', '04-07', '04-08', '04-10'] },
    move: { planner: '05-move-more', colour: 'teal', short: 'Move More', back: '02-17', notes: '05-14',
      pages: ['05-03', '05-04', '05-08', '05-09', '05-11', '05-12', '05-13'] }
  };
  // The order pages appear in, whatever mix is chosen.
  var ORDER = ['02-03', '02-04', '05-03', '03-03', '02-05', '02-06', '02-07', '02-08', '03-07',
    '04-03', '04-04', '05-04', '04-05', '01-04', '01-05', '01-06', '05-05', '01-07', '05-06', '01-08', '01-09',
    '01-10', '01-11', '01-13', '04-06', '04-09', '02-10', '02-11', '02-12', '02-13', '05-08', '03-04', '03-05',
    '03-06', '05-09', '05-12', '02-09', '03-09', '05-10', '01-12', '02-16', '03-08', '03-10', '03-11', '05-07',
    '02-15', '01-14', '04-07', '01-15', '05-11', '04-08', '04-11', '04-12', '02-14', '03-13', '04-10', '05-13',
    '02-17', '03-12', '01-16', '02-18', '03-14', '04-13', '05-14'];
  var MAX_PAGES = 26;

  var QUIZ = [
    { q: 'What do you most want help with?', key: 'primary', opts: [
      ['stuck', '🌀', 'Getting started', 'I put things off, then feel bad about it'],
      ['goal', '🎯', 'A big goal', 'I know what I want — I need a route'],
      ['habit', '🌱', 'A habit that sticks', 'Something small, every day'],
      ['gentle', '🌙', 'Getting through heavy weeks', 'I’m running on low battery'],
      ['move', '🏃', 'Moving my body more', 'Walks, workouts, anything']] },
    { q: 'When something gets hard, you usually…', key: 'hard', opts: [
      ['avoid', '🙈', 'Avoid it', 'Same task, fourth week running'],
      ['choices', '🤯', 'Can’t pick where to start', 'Everything feels equally important'],
      ['bored', '🥱', 'Get bored', 'Suddenly the spice rack needs sorting'],
      ['burnout', '🪫', 'Run out of energy', 'I want to, I just can’t']] },
    { q: 'What actually gets you to do things?', key: 'motive', opts: [
      ['rewards', '🎁', 'A reward waiting for me', 'Coffee, an episode, a treat'],
      ['progress', '📈', 'Seeing my progress', 'A bar going up, a jar filling'],
      ['people', '🤝', 'Other people', 'Someone cheering or counting on me'],
      ['game', '🎲', 'Making it a game', 'Bingo, punch cards, points']] },
    { q: 'How much planning do you want to do?', key: 'time', opts: [
      ['tiny', '⏱️', 'As little as possible', 'Two minutes, tops'],
      ['weekly', '🗓️', 'A little each week', 'Ten minutes on Sunday'],
      ['love', '✍️', 'I love planning', 'Give me all the pages']] },
    { q: 'Cut, fold and build the pieces yourself?', key: 'hands', opts: [
      ['all', '✂️', 'Yes, give me everything', 'Spinners, dials, sliders, dice'],
      ['some', '📎', 'A little', 'Paperclip spinner and punch cards'],
      ['pen', '🖊️', 'Just a pen, thanks', 'No scissors']] },
    { q: 'Who is it for?', key: 'who', opts: [
      ['me', '🙋', 'Me', ''],
      ['gift', '💌', 'Someone else', 'You’ll add a note for page one']] }
  ];

  // Box labels that get the buyer's words. Value = field, or [field, index].
  var FILL = {
    'My goal': 'goal', 'A change I want to make': 'goal', 'My choice': 'goal',
    'The task I keep not doing': 'goal', 'The habit I want': 'habit', 'Habit': 'habit', 'My habit': 'habit',
    'Reward': ['r', 0], 'Bingo prize': ['r', 0], 'Blackout prize': ['r', 2], "At 100 I'll\u2026": ['r', 2],
    "At 50 sessions I'll\u2026": ['r', 2], 'Small': ['r', 0], 'Medium': ['r', 1], 'Big': ['r', 2]
  };
  var MAKE_TOOLS = { 'paperclip spinner': 'a paperclip', 'spinner': 'a paperclip', 'brad spinner': 'a brad (paper fastener)',
    'energy dial': 'a brad (paper fastener)', 'paper die': 'glue', 'pocket': 'glue', 'envelope': 'glue',
    'scratch-offs': 'scratch-off stickers (or tape + paint)', 'pull-tab': 'cardstock if you have it' };

  var used = {}, data = null, byId = {}, answers = {}, qi = 0, selected = [], manual = {};
  var state = { name: '', who: 'me', from: '', note: '', goal: '', habit: '', r: ['', '', ''], colour: '' };
  var $ = function (id) { return document.getElementById(id); };
  var frame = $('book');

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

  // ---------- saved progress (per viewer, optional) ----------
  function save() { try { localStorage.setItem('mk-planner', JSON.stringify({ answers: answers, state: state, manual: manual })); } catch (e) {} }
  function load() {
    try { var s = JSON.parse(localStorage.getItem('mk-planner') || 'null'); if (s) { answers = s.answers || {}; manual = s.manual || {}; for (var k in s.state) state[k] = s.state[k]; } } catch (e) {}
  }

  // ---------- quiz ----------
  function showQ() {
    var q = QUIZ[qi];
    $('dots').innerHTML = QUIZ.map(function (_, i) { return '<i class="' + (i <= qi ? 'on' : '') + '"></i>'; }).join('');
    $('qnum').textContent = 'Question ' + (qi + 1) + ' of ' + QUIZ.length;
    $('qtext').textContent = q.q;
    $('opts').innerHTML = q.opts.map(function (o) {
      return '<button class="opt" type="button" data-v="' + o[0] + '"><span class="em" aria-hidden="true">' + o[1] + '</span><span>' + esc(o[2]) +
        (o[3] ? '<small>' + esc(o[3]) + '</small>' : '') + '</span></button>';
    }).join('');
    $('back').style.visibility = qi ? 'visible' : 'hidden';
  }
  $('opts').addEventListener('click', function (e) {
    var b = e.target.closest('.opt'); if (!b) return;
    answers[QUIZ[qi].key] = b.dataset.v;
    if (qi === 0) state.colour = PRIMARY[b.dataset.v].colour;
    if (QUIZ[qi].key === 'who') state.who = b.dataset.v;
    manual = {};
    if (qi < QUIZ.length - 1) { qi++; showQ(); render(); } else { finishQuiz(); }
  });
  $('back').addEventListener('click', function () { if (qi) { qi--; showQ(); } });
  $('skip').addEventListener('click', function () {
    answers = { primary: answers.primary || 'stuck', hard: answers.hard || 'choices', motive: answers.motive || 'rewards', time: 'weekly', hands: 'some', who: state.who };
    if (!state.colour) state.colour = PRIMARY[answers.primary].colour;
    finishQuiz();
  });
  $('redo').addEventListener('click', function () { qi = 0; $('step-make').hidden = true; $('step-quiz').hidden = false; showQ(); });

  // ---------- choose pages from answers ----------
  function pickPages() {
    var p = PRIMARY[answers.primary || 'stuck'], set = {}, add = function (ids) { ids.forEach(function (i) { set[i] = 1; }); };
    add(p.pages);
    add({ avoid: ['01-10', '01-11', '01-13'], choices: ['01-05', '01-06'], bored: ['01-07', '01-08'], burnout: ['04-03', '04-06', '04-09'] }[answers.hard] || []);
    add({ rewards: ['01-12', '02-16', '03-08'], progress: ['02-09', '04-07'], people: ['04-11', '02-15'], game: ['03-10', '03-11'] }[answers.motive] || []);
    if (answers.time === 'tiny') ['02-07', '02-08', '02-11', '02-12', '02-13', '03-06', '02-14', '03-07'].forEach(function (i) { delete set[i]; });
    if (answers.time === 'love') add({ goal: ['02-04', '02-08'], stuck: ['02-05', '02-08'], move: ['02-06', '02-07'],
      habit: ['03-06', '03-07', '03-13'], gentle: ['04-11', '04-12', '04-08'] }[answers.primary] || []);
    if (answers.primary === 'move' && answers.hard === 'bored') add(['05-05', '05-06']);
    if (answers.primary === 'move' && answers.motive === 'game') { delete set['03-10']; delete set['03-11']; add(['05-07']); }
    if (answers.primary === 'gentle' && answers.motive === 'progress') delete set['02-09'];
    if (answers.primary === 'move' && answers.motive === 'progress') { delete set['02-09']; add(['05-10']); }
    if (answers.primary === 'habit' && answers.motive === 'progress') { delete set['02-09']; add(['03-09']); }
    // hands: remove cut-out pages the person doesn't want
    Object.keys(set).forEach(function (id) {
      var mk = byId[id] && byId[id].make;
      if (!mk) return;
      if (answers.hands === 'pen') delete set[id];
      else if (answers.hands === 'some' && ['paperclip spinner', 'spinner', 'punch card'].indexOf(mk) < 0) delete set[id];
    });
    if (set['01-11'] || set['01-10']) { if (answers.hands !== 'pen') set['01-13'] = 1; }
    add([p.back, p.notes]);
    for (var k in manual) { if (manual[k]) set[k] = 1; else delete set[k]; }
    var list = ORDER.filter(function (id) { return set[id] && byId[id]; });
    // keep it printable: trim optional extras from the middle if it runs long
    while (list.length > MAX_PAGES - 2) {
      var drop = list.slice().reverse().find(function (id) { return p.pages.indexOf(id) < 0 && id !== p.back && id !== p.notes && !manual[id]; });
      if (!drop) break;
      list.splice(list.indexOf(drop), 1);
    }
    return list;
  }

  function finishQuiz() {
    $('step-quiz').hidden = true; $('step-make').hidden = false;
    var who = document.querySelector('input[name=for][value=' + (state.who === 'gift' ? 'gift' : 'me') + ']'); if (who) who.checked = true;
    syncForm(); render(); save();
  }

  // ---------- form ----------
  function syncForm() {
    $('f-name').value = state.name; $('f-from').value = state.from; $('f-note').value = state.note;
    $('f-goal').value = state.goal; $('f-habit').value = state.habit;
    $('f-r1').value = state.r[0]; $('f-r2').value = state.r[1]; $('f-r3').value = state.r[2];
    $('gift').hidden = state.who !== 'gift';
    $('l-habit').hidden = answers.primary !== 'habit';
    $('swatches').innerHTML = COLOURS.map(function (c) {
      return '<button type="button" class="sw" data-c="' + c.id + '" aria-label="' + c.name + '" aria-pressed="' + (state.colour === c.id) + '" style="background:' + c.cover + '"></button>';
    }).join('');
  }
  var timer;
  $('form').addEventListener('input', function () {
    state.name = $('f-name').value.trim(); state.from = $('f-from').value.trim(); state.note = $('f-note').value.trim();
    state.goal = $('f-goal').value.trim(); state.habit = $('f-habit').value.trim();
    state.r = [$('f-r1').value.trim(), $('f-r2').value.trim(), $('f-r3').value.trim()];
    clearTimeout(timer); timer = setTimeout(function () { render(); save(); }, 180);
  });
  $('form').addEventListener('change', function (e) {
    if (e.target.name === 'for') { state.who = e.target.value; $('gift').hidden = state.who !== 'gift'; render(); save(); }
    if (e.target.dataset.pid) { manual[e.target.dataset.pid] = e.target.checked; render(); save(); }
  });
  $('swatches').addEventListener('click', function (e) {
    var b = e.target.closest('.sw'); if (!b) return;
    state.colour = b.dataset.c; syncForm(); render(); save();
  });

  // ---------- build the book ----------
  function colour() { return COLOURS.filter(function (c) { return c.id === state.colour; })[0] || COLOURS[0]; }
  function displayName() { return state.name || 'Your'; }
  function possessive(n) { return /s$/i.test(n) ? n + '’' : n + '’s'; }

  function coverHtml(p) {
    var src = byId[p.planner.slice(0, 2) + '-01'].html, n = state.name;
    var title = n ? possessive(esc(n)) + '<br>' + esc(p.short) : esc(p.short).replace(' ', '<br>');
    var size = n && n.length > 9 ? Math.max(44, 66 - (n.length - 9) * 3) : 66;
    src = src.replace(/<div class='title'>[\s\S]*?<\/div>/, "<div class='title' style='font-size:" + size + "pt'>" + title + '</div>');
    src = src.replace(/Planner 0\d · [A-Za-z]+/, state.who === 'gift' && state.from ? 'Made for you by ' + esc(state.from) : 'Made for ' + (n ? esc(n) : 'you'));
    src = src.replace("This planner belongs to</div>", 'This planner belongs to' + (n ? " <span style='font-family:var(--hand);font-size:20pt;letter-spacing:0;text-transform:none'>" + esc(n) + '</span>' : '') + '</div>');
    return src;
  }

  function hello(list, p) {
    var tools = {}, rows = list.map(function (id, i) {
      var pg = byId[id]; if (pg.make && MAKE_TOOLS[pg.make]) tools[MAKE_TOOLS[pg.make]] = 1;
      return '<tr><td style="height:24px">' + esc(pg.title) + (pg.make ? ' <span class="tag" style="padding:3px 6px;font-size:6.5pt">✂ make it</span>' : '') + '</td><td class="c" style="width:40px"><b>' + (i + 3) + '</b></td></tr>';
    }).join('');
    var r = state.r.filter(Boolean);
    var note = state.who === 'gift' && (state.note || state.from)
      ? "<div class='box wash' style='margin-bottom:12px'><div class='lbl'>A note from " + esc(state.from || 'me') + "</div><div class='fillwrap' style='margin-top:6px'>" + esc(state.note || 'Made with love.') + '</div></div>' : '';
    var need = Object.keys(tools);
    return "<section class='page'><div class='kicker'>Start here</div><h1>Hi, " + esc(state.name || 'you') + ".</h1>" +
      "<div class='sub'>This planner was built from " + (state.who === 'gift' ? 'answers about you.' : 'your answers.') + "</div><div class='grow'>" + note +
      "<div class='row'><div class='box'><div class='lbl'>" + (answers.primary === 'habit' ? 'My habit' : 'What this is for') + "</div><div class='fillwrap' style='margin-top:6px;min-height:27px'>" +
      esc((answers.primary === 'habit' ? state.habit : state.goal) || '') + "</div></div><div class='box'><div class='lbl'>Rewards I've earned</div><div class='fillwrap' style='margin-top:6px;min-height:27px'>" +
      (r.length ? r.map(esc).join(' · ') : '') + "</div></div></div>" +
      "<div class='howto mt'><h3>Three rules</h3><ol class='steps'><li>Use <b>one</b> page at a time.</li><li>Starting counts. Five messy minutes is a win.</li><li>Missed days erase nothing. Come back on page " +
      (list.indexOf(p.back) + 3) + '.</li></ol>' + (need.length ? "<p class='small' style='margin-top:6px'><b>For the ✂ pages:</b> scissors, " + need.join(', ') + '.</p>' : '') + '</div>' +
      "<h3 class='mt'>Your pages</h3><table class='t'>" + rows + '</table></div>' +
      "<div class='foot'><span>" + esc(possessive(displayName())) + " planner</span><span class='n'>02</span></div></section>";
  }

  function personalize(html, num, newNum, planner) {
    var r = state.r;
    var div = document.createElement('div'); div.innerHTML = html;
    var pg = div.firstElementChild;
    var rc = 0;
    pg.querySelectorAll('.box').forEach(function (bx) {
      var l = bx.querySelector('.lbl'); if (!l) return;
      var f = FILL[l.textContent.trim()];
      if (l.textContent.trim() === 'My reward') f = ['r', rc++ % 3];
      if (!f) return;
      var once = { 'Habit': 1, 'Reward': 1 }[l.textContent.trim()];
      if (once) { if (used[l.textContent.trim()]) return; used[l.textContent.trim()] = 1; }
      var v = Array.isArray(f) ? r[f[1]] : (f === 'goal' && answers.primary === 'habit' && !state.goal ? state.habit : state[f]);
      if (!v) return;
      var ln = bx.querySelector('.lines'); if (!ln) return;
      var d = document.createElement('div'); d.className = 'fillin'; d.textContent = v; ln.insertBefore(d, ln.firstChild);
    });
    var k = 0;
    pg.querySelectorAll('.hand').forEach(function (h) {
      if (h.textContent.trim() === 'reward under here') { var v = r[k++ % 3]; if (v) { h.textContent = v; h.style.color = '#26231f'; } }
    });
    // "page 6" style references inside a source planner → this book's numbers
    pg.innerHTML = pg.innerHTML.replace(/\b(on |to )?page (\d+)\b/g, function (m, pre, n) {
      var id = planner + '-' + (n.length < 2 ? '0' + n : n), at = newNum[id];
      return at ? (pre || '') + 'page ' + at : (pre === 'to ' ? 'to the back of this planner' : 'in the free Maker Guide');
    });
    var foot = pg.querySelector('.foot');
    if (foot) foot.innerHTML = '<span>' + esc(possessive(displayName())) + " planner</span><span class='n'>" + (num < 10 ? '0' : '') + num + '</span>';
    return pg.outerHTML;
  }

  var DEFAULTS = { primary: 'stuck', hard: 'choices', motive: 'rewards', time: 'weekly', hands: 'some', who: 'me' };
  function render() {
    if (!data) return;
    var real = answers; answers = {}; for (var k in DEFAULTS) answers[k] = real[k] || DEFAULTS[k];
    try { draw(); } finally { answers = real; }
  }
  function draw() {
    var p = PRIMARY[answers.primary], list = pickPages(), c = colour(), newNum = {};
    used = {};
    if (!state.colour) c = COLOURS.filter(function (x) { return x.id === p.colour; })[0];
    selected = list;
    list.forEach(function (id, i) { newNum[id] = i + 3; });
    var pages = [coverHtml(p), hello(list, p)].concat(list.map(function (id, i) { return personalize(byId[id].html, i + 3, newNum, id.slice(0, 2)); }));
    var caps = ['Cover', 'Start here'].concat(list.map(function (id) { return byId[id].title; }));
    var doc = frame.contentDocument; if (!doc || !doc.getElementById('book')) return;
    var b = doc.body;
    b.style.setProperty('--accent', c.accent); b.style.setProperty('--accent-2', c.accent2);
    b.style.setProperty('--wash', c.wash); b.style.setProperty('--cover', c.cover);
    doc.getElementById('book').innerHTML = pages.map(function (h, i) {
      return '<div class="slot"><div class="frame">' + h + '</div><div class="cap">' + (i + 1) + ' · ' + esc(caps[i] || '') + '</div></div>';
    }).join('');
    doc.title = possessive(displayName()) + ' ' + p.short;
    $('pv-title').textContent = state.name ? possessive(state.name) + ' ' + p.short : 'Your ' + p.short;
    $('pv-n').textContent = pages.length + ' pages';
    $('pcount').textContent = '(' + pages.length + ')';
    $('result').innerHTML = '<p class="qnum">Built for you</p><h2>' + esc(p.short) + ' + ' + (list.length - p.pages.length - 2 > 0 ? (list.length - p.pages.length - 2) + ' extras' : 'the essentials') + '</h2><p>' +
      esc(reason()) + '</p>';
    renderList(list);
    setupOrder(p, list, c);
  }

  function reason() {
    var a = { avoid: 'dare cards for the tasks you dodge', choices: 'a spinner so you never have to choose', bored: 'a dice game and a timer race for boring jobs', burnout: 'an energy dial and permission to rest' }[answers.hard];
    var b = { rewards: 'your rewards printed in', progress: 'a meter that climbs as you go', people: 'space for your people', game: 'bingo and punch cards' }[answers.motive];
    return [a, b].filter(Boolean).join(', plus ') + '.';
  }

  function renderList(list) {
    var groups = {};
    data.pages.forEach(function (pg) { if (pg.cover || pg.title === 'How this works' || pg.title === 'What you’ll need' || pg.title === "What you'll need") return; (groups[pg.planner] = groups[pg.planner] || []).push(pg); });
    $('plist').innerHTML = data.planners.map(function (pl) {
      return '<h4>' + esc(pl.title) + '</h4>' + (groups[pl.slug] || []).map(function (pg) {
        return '<label><input type="checkbox" data-pid="' + pg.id + '"' + (list.indexOf(pg.id) >= 0 ? ' checked' : '') + '/> ' + esc(pg.title) + (pg.make ? ' <em>✂ ' + esc(pg.make) + '</em>' : '') + '</label>';
      }).join('');
    }).join('');
  }

  // ---------- print + order ----------
  $('print').addEventListener('click', function () {
    var w = frame.contentWindow; if (!w) return;
    w.focus(); w.print();
  });

  function setupOrder(p, list, c) {
    var on = !!(SHOP.domain && SHOP.variantId), f = $('order');
    f.hidden = !on; $('soon').hidden = on; $('kitnote').hidden = !on;
    if (!on) return;
    f.action = 'https://' + SHOP.domain + '/cart/add';
    var props = { Planner: p.short, Name: state.name, Colour: c.name, Goal: state.goal, Habit: answers.primary === 'habit' ? state.habit : '',
      Rewards: state.r.filter(Boolean).join(' | '), Pages: list.join(','), 'Gift from': state.who === 'gift' ? state.from : '', 'Gift note': state.who === 'gift' ? state.note : '' };
    var inputs = '<input type="hidden" name="id" value="' + esc(SHOP.variantId) + '"><input type="hidden" name="quantity" value="1"><input type="hidden" name="return_to" value="/checkout">';
    for (var k in props) if (props[k]) inputs += '<input type="hidden" name="properties[' + esc(k) + ']" value="' + esc(props[k]) + '">';
    f.innerHTML = inputs + '<button class="btn btn-ghost" type="submit">Order it printed · $39</button>';
  }

  // ---------- start ----------
  function ready() {
    if (!data || !frame.contentDocument || !frame.contentDocument.getElementById('book')) return;
    if (answers.primary) finishQuiz(); else { showQ(); render(); }
  }
  load();
  frame.addEventListener('load', ready);
  fetch('pages.json').then(function (r) { return r.json(); }).then(function (d) {
    data = d; d.pages.forEach(function (p) { byId[p.id] = p; });
    showQ(); ready();
  }).catch(function () {
    $('qtext').textContent = 'The planner pages didn’t load. Refresh to try again.';
  });
})();
