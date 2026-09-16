(function () {
  'use strict';

  var DOC_ORDER = ['docA', 'docB', 'docC'];
  var byDoc = {};
  PAGES.forEach(function (p) {
    (byDoc[p.doc] = byDoc[p.doc] || []).push(p);
  });

  // Render thumbnail grids
  document.querySelectorAll('.grid[data-doc]').forEach(function (grid) {
    var doc = grid.getAttribute('data-doc');
    (byDoc[doc] || []).forEach(function (p, i) {
      var b = document.createElement('button');
      b.className = 'thumb';
      b.setAttribute('data-doc', doc);
      b.setAttribute('data-idx', i);
      var img = document.createElement('img');
      img.src = 'img/thumbs/' + p.f;
      img.alt = p.header || p.f;
      img.loading = 'lazy';
      var cap = document.createElement('span');
      cap.textContent = label(p, i);
      b.appendChild(img);
      b.appendChild(cap);
      b.addEventListener('click', function () { openLightbox(doc, i); });
      grid.appendChild(b);
    });
  });

  function label(p, i) {
    if (p.page && p.page !== 'front') return 'p. ' + p.page + ' — ' + p.header;
    return p.header || p.f;
  }

  // Chapter jump buttons
  document.querySelectorAll('[data-goto]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.getAttribute('data-goto');
      var pages = byDoc['docB'] || [];
      for (var i = 0; i < pages.length; i++) {
        if (pages[i].f === target) { openLightbox('docB', i); return; }
      }
    });
  });

  // Lightbox
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbCap = document.getElementById('lb-cap');
  var lbNum = document.getElementById('lb-num');
  var curDoc = null, curIdx = 0;

  function openLightbox(doc, i) {
    curDoc = doc; curIdx = i;
    render();
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lb.hidden = true;
    document.body.style.overflow = '';
  }

  function render() {
    var pages = byDoc[curDoc];
    var p = pages[curIdx];
    lbImg.src = 'img/' + p.f;
    lbImg.alt = p.header || p.f;
    lbCap.textContent = p.header || p.f;
    lbNum.textContent = (curIdx + 1) + ' / ' + pages.length;
  }

  function step(d) {
    var pages = byDoc[curDoc];
    curIdx = (curIdx + d + pages.length) % pages.length;
    render();
  }

  lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
  lb.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); step(-1); });
  lb.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); step(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });

  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });
})();
