/* Simple FAQ chatbot used by the demo sites.
   In a live build this would call an AI model; here it answers from a fixed FAQ list. */
window.mountBot = function (cfg) {
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const css = `
  .bot-btn{position:fixed;right:max(16px,env(safe-area-inset-right,0px));bottom:16px;z-index:50;display:flex;align-items:center;gap:8px;height:52px;padding:0 20px;border:0;border-radius:26px;background:${cfg.color};color:${cfg.ink || '#fff'};font-weight:600;font-size:15px;font-family:inherit;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.25)}
  .bot-btn:focus-visible,.bot-panel button:focus-visible,.bot-panel input:focus-visible{outline:3px solid ${cfg.focus || '#ffcf3a'};outline-offset:2px}
  .bot-btn svg{width:20px;height:20px}
  .bot-panel{position:fixed;right:max(16px,env(safe-area-inset-right,0px));bottom:80px;z-index:51;width:min(360px,calc(100vw - 32px));height:min(480px,calc(100vh - 120px));display:none;flex-direction:column;background:var(--bg,#fff);color:var(--ink,#111);border:1px solid color-mix(in srgb,currentColor 18%,transparent);border-radius:16px;overflow:hidden;box-shadow:0 12px 32px rgba(0,0,0,.25)}
  .bot-panel.open{display:flex}
  .bot-head{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;background:${cfg.color};color:${cfg.ink || '#fff'};font-weight:700}
  .bot-head small{display:block;font-weight:400;opacity:.85;font-size:13px}
  .bot-head button{width:44px;height:44px;border:0;background:transparent;color:inherit;font-size:22px;cursor:pointer;border-radius:8px}
  .bot-log{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px}
  .bot-msg{max-width:85%;padding:9px 12px;border-radius:14px;font-size:15px;line-height:1.4;white-space:pre-line}
  .bot-msg.b{align-self:flex-start;background:color-mix(in srgb,currentColor 8%,transparent)}
  .bot-msg.u{align-self:flex-end;background:${cfg.color};color:${cfg.ink || '#fff'}}
  .bot-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 10px}
  .bot-chips button{min-height:36px;padding:6px 12px;border-radius:18px;border:1px solid color-mix(in srgb,currentColor 30%,transparent);background:transparent;color:inherit;font-size:14px;font-family:inherit;cursor:pointer}
  .bot-form{display:flex;gap:6px;padding:10px;border-top:1px solid color-mix(in srgb,currentColor 15%,transparent)}
  .bot-form input{flex:1;height:44px;padding:0 12px;font-size:16px;font-family:inherit;border-radius:10px;border:1px solid color-mix(in srgb,currentColor 30%,transparent);background:transparent;color:inherit}
  .bot-form button{height:44px;padding:0 14px;border:0;border-radius:10px;background:${cfg.color};color:${cfg.ink || '#fff'};font-weight:600;font-size:15px;font-family:inherit;cursor:pointer}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const btn = document.createElement('button');
  btn.className = 'bot-btn'; btn.type = 'button'; btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 5h16v11H9l-5 4z"/></svg>Ask us';
  const panel = document.createElement('div');
  panel.className = 'bot-panel'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', cfg.name + ' assistant');
  panel.innerHTML = `<div class="bot-head"><div>${esc(cfg.name)} assistant<small>Instant answers, 24/7</small></div><button type="button" aria-label="Close chat">×</button></div>
    <div class="bot-log" aria-live="polite"></div>
    <div class="bot-chips">${cfg.faqs.map((f, i) => `<button type="button" data-i="${i}">${esc(f.q)}</button>`).join('')}</div>
    <form class="bot-form"><input id="bot-input" aria-label="Type a question" placeholder="Type a question…" autocomplete="off"><button>Send</button></form>`;
  document.body.append(btn, panel);
  const log = panel.querySelector('.bot-log');
  const say = (t, who) => { const d = document.createElement('div'); d.className = 'bot-msg ' + who; d.textContent = t; log.appendChild(d); log.scrollTop = log.scrollHeight; };
  const answer = q => {
    const s = q.toLowerCase();
    const hit = cfg.faqs.find(f => f.keys.some(k => s.includes(k)));
    setTimeout(() => say(hit ? hit.a : cfg.fallback, 'b'), 350);
  };
  let greeted = false;
  const toggle = open => {
    panel.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open));
    if (open && !greeted) { say(cfg.greeting, 'b'); greeted = true; }
    if (open) panel.querySelector('input').focus();
  };
  btn.addEventListener('click', () => toggle(!panel.classList.contains('open')));
  panel.querySelector('.bot-head button').addEventListener('click', () => { toggle(false); btn.focus(); });
  panel.addEventListener('keydown', e => { if (e.key === 'Escape') { toggle(false); btn.focus(); } });
  panel.querySelector('.bot-chips').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const f = cfg.faqs[+b.dataset.i]; say(f.q, 'u'); setTimeout(() => say(f.a, 'b'), 350);
  });
  panel.querySelector('form').addEventListener('submit', e => {
    e.preventDefault(); const i = panel.querySelector('input'); const v = i.value.trim(); if (!v) return;
    say(v, 'u'); i.value = ''; answer(v);
  });
  window.openBot = () => toggle(true);
};
