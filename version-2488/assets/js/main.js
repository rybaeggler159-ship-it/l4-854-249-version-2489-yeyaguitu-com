(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupMobileMenu() {
    var button = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (!button || !panel) {
      return;
    }

    button.addEventListener('click', function () {
      panel.classList.toggle('is-open');
      button.textContent = panel.classList.contains('is-open') ? '×' : '☰';
    });
  }

  function setupHero() {
    var root = document.querySelector('[data-hero]');
    if (!root) {
      return;
    }

    var slides = selectAll('.hero-slide', root);
    var dots = selectAll('[data-hero-dot]', root);
    var prev = root.querySelector('[data-hero-prev]');
    var next = root.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(parseInt(dot.getAttribute('data-hero-dot'), 10) || 0);
        start();
      });
    });

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function setupImageFallback() {
    selectAll('img').forEach(function (img) {
      img.addEventListener('error', function () {
        img.classList.add('is-missing');
        img.removeAttribute('src');
      });
    });
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function setupCardFilters() {
    var scope = document.querySelector('[data-filter-scope]');
    if (!scope) {
      return;
    }

    var input = scope.querySelector('[data-card-filter]');
    var count = scope.querySelector('[data-filter-count]');
    var buttons = selectAll('[data-filter-value]', scope);
    var cards = selectAll('.movie-card', scope);
    var currentGroup = 'all';
    var params = new URLSearchParams(window.location.search);
    var initial = {
      group: params.get('group') || '',
      genre: params.get('genre') || '',
      type: params.get('type') || '',
      year: params.get('year') || '',
      q: params.get('q') || ''
    };

    if (input && initial.q) {
      input.value = initial.q;
    }

    if (initial.group) {
      currentGroup = initial.group;
    }

    function matches(card, query) {
      var group = card.getAttribute('data-group') || '';
      var year = card.getAttribute('data-year') || '';
      var type = card.getAttribute('data-type') || '';
      var genre = card.getAttribute('data-genre') || '';
      var haystack = [
        card.getAttribute('data-title'),
        group,
        year,
        type,
        genre,
        card.getAttribute('data-tags')
      ].join(' ').toLowerCase();

      if (currentGroup !== 'all' && group !== currentGroup) {
        return false;
      }

      if (initial.genre && genre.indexOf(initial.genre) === -1) {
        return false;
      }

      if (initial.type && type.indexOf(initial.type) === -1) {
        return false;
      }

      if (initial.year && year !== initial.year) {
        return false;
      }

      return !query || haystack.indexOf(query) !== -1;
    }

    function apply() {
      var query = normalize(input ? input.value : initial.q);
      var visible = 0;

      cards.forEach(function (card) {
        var ok = matches(card, query);
        card.classList.toggle('hidden-card', !ok);
        if (ok) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = String(visible);
      }
    }

    buttons.forEach(function (button) {
      if (button.getAttribute('data-filter-value') === currentGroup) {
        button.classList.add('is-active');
      }

      button.addEventListener('click', function () {
        currentGroup = button.getAttribute('data-filter-value') || 'all';
        buttons.forEach(function (item) {
          item.classList.toggle('is-active', item === button);
        });
        apply();
      });
    });

    if (input) {
      input.addEventListener('input', apply);
    }

    apply();
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMobileMenu();
    setupHero();
    setupImageFallback();
    setupCardFilters();
  });
})();
