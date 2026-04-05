/* ── CALCULATEUR ── */
function fmt(n){return new Intl.NumberFormat('fr-FR').format(Math.round(n))+' €'}
function updateCalc(){
  const nb=parseFloat(document.getElementById('nb-slider').value);
  const h=parseFloat(document.getElementById('h-slider').value);
  const taux=parseFloat(document.getElementById('taux-slider').value);
  const total=nb*h*taux*5*48;
  const heures=nb*h*5*48;
  document.getElementById('nb-display').textContent=nb;
  document.getElementById('h-display').textContent=h+'h';
  document.getElementById('taux-display').textContent=taux+'€';
  document.getElementById('total-display').textContent=fmt(total);
  document.getElementById('bd-heures').textContent=new Intl.NumberFormat('fr-FR').format(heures)+' h';
  document.getElementById('bd-taux').textContent=taux+' €/h';
  document.getElementById('bd-ca').textContent='+'+fmt(total*0.5);
  document.getElementById('perte-span').textContent=fmt(total);
  // Sync hero panel
  const heroLoss=document.getElementById('hero-loss');
  if(heroLoss) heroLoss.textContent=fmt(total);
  // Sync mobile loss banner
  const mobileLoss = document.getElementById('mobile-loss-val');
  if (mobileLoss) mobileLoss.textContent = fmt(total);
}
['nb-slider','h-slider','taux-slider'].forEach(id=>
  document.getElementById(id).addEventListener('input',updateCalc));
updateCalc();

/* ── EMAIL CAPTURE — Redirection vers Cal.com ── */
function submitCalcEmail(){
  const email=document.getElementById('calc-email').value.trim();
  if(!email||!email.includes('@')){
    document.getElementById('calc-email').style.borderColor='var(--red)';
    return;
  }
  // UI: montrer confirmation + ouvrir Cal.com
  document.getElementById('calc-capture-form').style.display='none';
  document.getElementById('calc-thanks').style.display='block';
  // Ouvrir le calendrier Cal.com
  if(window.Cal && Cal.ns && Cal.ns["diagnostic-15-min"]) {
    Cal.ns["diagnostic-15-min"]("floatingButton", {
      "calLink": "pierre-andrieux-iagence/diagnostic-15-min",
      "config": { "layout": "month_view", "useSlotsViewOnSmallScreen": "true", "theme": "auto" },
      "hideButtonIcon": true,
      "buttonText": "Diagnostic stratégique — 15 min"
    });
  }
}

/* ── AXES TABS ── */
document.querySelectorAll('.axes-tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    document.querySelectorAll('.axes-tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.axes-panel').forEach(p=>p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('panel-'+tab.dataset.panel).classList.add('active');
  });
});

/* ── NAVIGATION SCROLL ── */
window.addEventListener('scroll',()=>{
  const nav=document.getElementById('main-nav');
  nav.classList.toggle('scrolled',window.scrollY>40);
  // Masquer popup trigger si en bas de page
  const trig=document.getElementById('popup-trigger');
  const nearBottom=(window.innerHeight+window.scrollY)>=(document.body.offsetHeight-200);
  if(nearBottom) trig.classList.add('hidden');
});

/* ── MOBILE NAV ── */
function openMobileNav(){document.getElementById('mobile-nav').classList.add('open')}
function closeMobileNav(){document.getElementById('mobile-nav').classList.remove('open')}

/* ── SCROLL REVEAL ── */
const revealEls=document.querySelectorAll('.reveal');
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible')}});
},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
revealEls.forEach(el=>observer.observe(el));

/* ── CAL.COM OFFICIEL — Floating Button + Inline Embed ── */
(function(C, A, L) {
  let p = function(a, ar) { a.q.push(ar); };
  let d = C.document;
  C.Cal = C.Cal || function() {
    let cal = C.Cal;
    let ar = arguments;
    if (!cal.loaded) {
      cal.ns = {};
      cal.q = cal.q || [];
      d.head.appendChild(d.createElement("script")).src = A;
      cal.loaded = true;
    }
    if (ar[0] === L) {
      const api = function() { p(api, arguments); };
      const namespace = ar[1];
      api.q = api.q || [];
      if (typeof namespace === "string") {
        cal.ns[namespace] = cal.ns[namespace] || api;
        p(cal.ns[namespace], ar);
        p(cal, ["initNamespace", namespace]);
      } else p(cal, ar);
      return;
    }
    p(cal, ar);
  };
})(window, "https://app.cal.com/embed/embed.js", "init");

Cal("init", "diagnostic-15-min", { origin: "https://app.cal.com" });
Cal.ns["diagnostic-15-min"]("floatingButton", {
  "calLink": "pierre-andrieux-iagence/diagnostic-15-min",
  "config": { "layout": "month_view", "useSlotsViewOnSmallScreen": "true", "theme": "auto" },
  "hideButtonIcon": true,
  "buttonText": "Diagnostic stratégique — 15 min"
});
Cal.ns["diagnostic-15-min"]("ui", { "hideEventTypeDetails": false, "layout": "month_view" });