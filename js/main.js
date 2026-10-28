(function () {
  'use strict';
  var d = document, root = d.documentElement;
  root.classList.add('js');

  /* Mobile menu */
  var btn = d.querySelector('.menu-btn'), menu = d.getElementById('mobile-nav'), header = d.querySelector('.site-header');
  function setMenu(open) {
    if (!btn || !menu) return;
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('open', open);
    if (open) menu.style.top = Math.max(header.getBoundingClientRect().bottom, 0) + 'px';
    d.body.style.overflow = open ? 'hidden' : '';
  }
  if (btn && menu) {
    btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth >= 900) setMenu(false); });
  }

  /* Header shadow */
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 8); }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  /* Reveal on scroll */
  var els = d.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('in'); }); }

  /* Year */
  var y = d.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

  /* Enquiry form -> WhatsApp */
  var form = d.getElementById('enquiry-form');
  if (form) {
    var NUMBER = form.getAttribute('data-wa');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (inp) {
        var f = inp.closest('.field'), v = inp.value.trim();
        var bad = !v || (inp.name === 'phone' && v.replace(/\D/g, '').length < 10);
        f.classList.toggle('bad', bad);
        if (bad) ok = false;
      });
      if (!ok) { var first = form.querySelector('.bad input, .bad select'); if (first) first.focus(); return; }
      var g = function (n) { return (form.elements[n].value || '').trim(); };
      var lines = [
        'Hello Yash AutoTech, I want to enquire about a service.',
        '',
        'Name: ' + g('name'),
        'Phone: ' + g('phone'),
        'Car: ' + (g('car') || '-'),
        'Service: ' + g('service'),
        'Message: ' + (g('message') || '-')
      ];
      window.open('https://wa.me/' + NUMBER + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    });
    var svc = new URLSearchParams(location.search).get('service');
    if (svc && form.elements.service) {
      Array.prototype.forEach.call(form.elements.service.options, function (o) { if (o.value === svc) o.selected = true; });
    }
  }
})();
