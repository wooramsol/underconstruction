// Masonry for .gallery: places each image (in order) into the currently
// shortest column, using width/height attributes so no image load is needed.
(function () {
  var COLUMNS = 2;
  var desktop = window.matchMedia('(min-width: 601px)');

  function ratio(img) {
    var w = +img.getAttribute('width') || img.naturalWidth || 1;
    var h = +img.getAttribute('height') || img.naturalHeight || 1;
    return h / w;
  }

  function layout(g) {
    var imgs = g._imgs || (g._imgs = Array.prototype.slice.call(g.querySelectorAll('img, video')));
    g.innerHTML = '';
    if (!desktop.matches || imgs.length < 2) {
      g.classList.remove('is-masonry');
      imgs.forEach(function (img) { g.appendChild(img); });
      return;
    }
    g.classList.add('is-masonry');
    var cols = [], heights = [];
    for (var i = 0; i < COLUMNS; i++) {
      var c = document.createElement('div');
      c.className = 'gallery-col';
      g.appendChild(c);
      cols.push(c);
      heights.push(0);
    }
    imgs.forEach(function (img) {
      var k = heights.indexOf(Math.min.apply(null, heights));
      cols[k].appendChild(img);
      heights[k] += ratio(img) + 0.02; // 0.02 ≈ gap
    });
  }

  function layoutAll() {
    document.querySelectorAll('.gallery').forEach(layout);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', layoutAll);
  else layoutAll();
  if (desktop.addEventListener) desktop.addEventListener('change', layoutAll);
  else desktop.addListener(layoutAll);
})();
