(function() {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function() {
      mobileNav.classList.toggle('open');
      menuButton.textContent = mobileNav.classList.contains('open') ? '×' : '☰';
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showHero(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function(slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    var next = function() {
      showHero(current + 1);
    };

    var previous = function() {
      showHero(current - 1);
    };

    var nextButton = hero.querySelector('[data-hero-next]');
    var previousButton = hero.querySelector('[data-hero-prev]');

    if (nextButton) {
      nextButton.addEventListener('click', next);
    }
    if (previousButton) {
      previousButton.addEventListener('click', previous);
    }
    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        showHero(Number(dot.getAttribute('data-hero-dot') || 0));
      });
    });

    window.setInterval(next, 5200);
  }

  var filterInput = document.querySelector('[data-page-filter]');
  var queryInput = document.querySelector('[data-query-input]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
  var chips = Array.prototype.slice.call(document.querySelectorAll('[data-filter-chip]'));
  var activeChip = '';

  function normalize(text) {
    return String(text || '').trim().toLowerCase();
  }

  function applyFilter() {
    var query = normalize(filterInput ? filterInput.value : '');
    var chip = normalize(activeChip);

    cards.forEach(function(card) {
      var haystack = normalize(card.getAttribute('data-search'));
      var passQuery = !query || haystack.indexOf(query) !== -1;
      var passChip = !chip || haystack.indexOf(chip) !== -1;
      card.classList.toggle('hidden', !(passQuery && passChip));
    });
  }

  if (queryInput) {
    var params = new URLSearchParams(window.location.search);
    var queryValue = params.get('q');
    if (queryValue) {
      queryInput.value = queryValue;
    }
  }

  if (filterInput) {
    filterInput.addEventListener('input', applyFilter);
  }

  chips.forEach(function(chipButton) {
    chipButton.addEventListener('click', function() {
      activeChip = chipButton.getAttribute('data-filter-chip') || '';
      chips.forEach(function(button) {
        button.classList.toggle('active', button === chipButton);
      });
      applyFilter();
    });
  });

  applyFilter();
}());
