/* ============================================================
   j4mes.dev — shared nav.js
   Include on every page after closing </main> tag
   ============================================================ */

/* ── Search index — add a line every time you publish ── */
const SEARCH_INDEX = [
  { title: "About",                             path: "~/about",                      url: "/about",                    tags: [] },
  { title: "Writing",                           path: "~/writing",                    url: "/writing",                  tags: [] },
  { title: "Getting OSCP in 2026",              path: "~/writing/getting-oscp-2026",  url: "/posts/getting-oscp-2026",  tags: ["--cert", "--offsec"] },
  { title: "Why I use FFUF over everything",    path: "~/writing/why-i-use-ffuf",     url: "/posts/why-i-use-ffuf",     tags: ["--tools"] },
  { title: "Salary negotiation as a pentester", path: "~/writing/salary-negotiation", url: "/posts/salary-negotiation", tags: ["--career"] }
];

/* ── Search ── */
(function() {
  const input   = document.getElementById('search-input');
  const cursor  = document.getElementById('search-cursor');
  const results = document.getElementById('search-results');
  if (!input || !cursor || !results) return;

  let activeIdx = -1;
  let isOpen    = false;

  function openSearch() {
    if (isOpen) return;
    isOpen = true;
    input.classList.add('open');
    cursor.classList.add('typing');
    setTimeout(() => input.focus(), 50);
  }

  function closeSearch() {
    isOpen = false;
    input.classList.remove('open');
    cursor.classList.remove('typing');
    input.value = '';
    results.classList.remove('open');
    results.innerHTML = '';
    activeIdx = -1;
  }

  function runQuery(val) {
    if (!val.trim()) { results.classList.remove('open'); results.innerHTML = ''; return; }
    const q = val.toLowerCase();
    const matches = SEARCH_INDEX.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.path.toLowerCase().includes(q)  ||
      item.tags.some(t => t.toLowerCase().includes(q))
    );
    renderResults(matches, val);
  }

  function renderResults(matches, val) {
    results.innerHTML = '';
    activeIdx = -1;
    if (!matches.length) {
      results.innerHTML = `<div class="search-no-match"><span class="nm">${val}</span>: no matches found</div>`;
    } else {
      matches.forEach((item, i) => {
        const a = document.createElement('a');
        a.href = item.url;
        a.className = 'search-result-item';
        a.innerHTML = `<span class="r-arrow">&gt;</span><span class="r-path">${item.path}</span>${item.tags.length ? `<span class="r-tag">${item.tags[0]}</span>` : ''}`;
        a.addEventListener('mouseenter', () => setActive(i));
        results.appendChild(a);
      });
    }
    results.classList.add('open');
  }

  function setActive(i) {
    const items = results.querySelectorAll('.search-result-item');
    items.forEach(el => el.classList.remove('active'));
    activeIdx = i;
    if (items[i]) items[i].classList.add('active');
  }

  document.querySelector('.nav-search').addEventListener('click', openSearch);
  cursor.addEventListener('click', openSearch);
  input.addEventListener('input', () => runQuery(input.value));
  input.addEventListener('keydown', (e) => {
    const items = results.querySelectorAll('.search-result-item');
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(Math.min(activeIdx + 1, items.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(Math.max(activeIdx - 1, 0)); }
    if (e.key === 'Enter' && items[activeIdx]) window.location.href = items[activeIdx].href;
    if (e.key === 'Escape') closeSearch();
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-search')) closeSearch();
  });
})();

/* ── Search ghost animation ── */
(function() {
  const ghost = document.getElementById('search-ghost');
  const inp   = document.getElementById('search-input');
  if (!ghost || !inp) return;

  const word = 'search';
  let t;
  let active = false;

  inp.addEventListener('focus', () => {
    active = true;
    clearTimeout(t);
    ghost.textContent = '';
    ghost.style.display = 'none';
  });
  inp.addEventListener('blur', () => {
    active = false;
    ghost.style.display = 'inline';
    t = setTimeout(run, 300);
  });

  function run() {
    clearTimeout(t);
    let i = 0;
    function typeWord() {
      if (active) return;
      ghost.textContent = word.slice(0, i + 1);
      i++;
      if (i < word.length) { t = setTimeout(typeWord, 110); }
      else { t = setTimeout(() => typeDots(0, 0), 400); }
    }
    function typeDots(loop, di) {
      if (active) return;
      if (loop === 3 && di === 0) {
        ghost.textContent = '';
        t = setTimeout(run, 500);
        return;
      }
      ghost.textContent = word + '.'.repeat(di + 1);
      if (di + 1 > 2) { t = setTimeout(() => typeDots(loop + 1, 0), 400); }
      else             { t = setTimeout(() => typeDots(loop, di + 1), 400); }
    }
    typeWord();
  }

  run();
})();

/* ── Matrix rain ── */
(function() {
  const canvas = document.getElementById('matrix');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', () => { resize(); init(); });

  const chars = 'アイウエオカキクケコ0123456789ABCDEF<>{}[]|;:#!$%'.split('');
  const fs = 13;
  let drops = [];

  function init() {
    drops = Array.from({ length: Math.floor(canvas.width / fs) }, () => Math.floor(Math.random() * -50));
  }
  init();

  function draw() {
    ctx.fillStyle = 'rgba(13,13,13,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ff2222';
    ctx.font = fs + 'px monospace';
    drops.forEach((y, i) => {
      if (y >= 0) ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fs, y * fs);
      if (y * fs > canvas.height && Math.random() > 0.975) drops[i] = Math.floor(Math.random() * -20);
      drops[i]++;
    });
  }

  setInterval(draw, 55);
})();
