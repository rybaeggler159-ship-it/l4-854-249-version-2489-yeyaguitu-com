(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  var navButton = qs('[data-nav-toggle]');
  var nav = qs('#mainNav');

  if (navButton && nav) {
    navButton.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  var hero = qs('[data-hero]');

  if (hero) {
    var slides = qsa('[data-hero-slide]', hero);
    var prev = qs('[data-hero-prev]', hero);
    var next = qs('[data-hero-next]', hero);
    var index = 0;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }
      slides[index].classList.remove('is-active');
      index = (nextIndex + slides.length) % slides.length;
      slides[index].classList.add('is-active');
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(index - 1);
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(index + 1);
      });
    }

    window.setInterval(function () {
      showSlide(index + 1);
    }, 5600);
  }

  qsa('[data-filter-panel]').forEach(function (panel) {
    var section = panel.closest('section') || document;
    var list = qs('[data-movie-list]', section) || qs('[data-movie-list]');
    var input = qs('[data-search-input]', panel);
    var year = qs('[data-year-filter]', panel);
    var region = qs('[data-region-filter]', panel);

    if (!list) {
      return;
    }

    var cards = qsa('.movie-card', list);

    function applyFilter() {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var selectedYear = year ? year.value : '';
      var selectedRegion = region ? region.value : '';

      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region')
        ].join(' ').toLowerCase();
        var yearMatched = !selectedYear || card.getAttribute('data-year') === selectedYear;
        var regionMatched = !selectedRegion || card.getAttribute('data-region') === selectedRegion;
        var keywordMatched = !keyword || text.indexOf(keyword) > -1;
        card.style.display = yearMatched && regionMatched && keywordMatched ? '' : 'none';
      });
    }

    [input, year, region].forEach(function (el) {
      if (el) {
        el.addEventListener('input', applyFilter);
        el.addEventListener('change', applyFilter);
      }
    });
  });
})();
