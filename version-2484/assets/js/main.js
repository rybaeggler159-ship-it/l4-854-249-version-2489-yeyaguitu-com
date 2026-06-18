(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
      menuButton.textContent = mobileMenu.classList.contains('is-open') ? '✕' : '☰';
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var index = 0;

    var showSlide = function (next) {
      if (!slides.length) {
        return;
      }
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    };

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(parseInt(dot.getAttribute('data-hero-dot'), 10) || 0);
      });
    });

    setInterval(function () {
      showSlide(index + 1);
    }, 5200);
  }

  var applySearch = function (root) {
    var input = root.querySelector('[data-search-input]');
    var cards = Array.prototype.slice.call(root.querySelectorAll('.movie-card'));
    var filterButtons = Array.prototype.slice.call(root.querySelectorAll('[data-filter]'));
    var activeFilter = '';

    if (!input && !filterButtons.length) {
      return;
    }

    var refresh = function () {
      var query = input ? input.value.trim().toLowerCase() : '';
      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-tags'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type')
        ].join(' ').toLowerCase();
        var okQuery = !query || text.indexOf(query) !== -1;
        var okFilter = !activeFilter || text.indexOf(activeFilter.toLowerCase()) !== -1;
        card.hidden = !(okQuery && okFilter);
      });
    };

    if (input) {
      input.addEventListener('input', refresh);
    }

    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        filterButtons.forEach(function (item) {
          item.classList.remove('is-active');
        });
        activeFilter = button.getAttribute('data-filter') || '';
        button.classList.add('is-active');
        refresh();
      });
    });
  };

  Array.prototype.slice.call(document.querySelectorAll('main')).forEach(applySearch);
})();
