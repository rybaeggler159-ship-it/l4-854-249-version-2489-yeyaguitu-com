(function () {
  var mobileToggle = document.querySelector('[data-mobile-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var carousel = document.querySelector('[data-hero-carousel]');

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var prev = carousel.querySelector('[data-hero-prev]');
    var next = carousel.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function restartTimer() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        restartTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        restartTimer();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
        restartTimer();
      });
    });

    restartTimer();
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var categoryFilter = document.querySelector('[data-category-filter]');
  var yearFilter = document.querySelector('[data-year-filter]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));

  function getQueryValue() {
    var params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function matchYear(cardYear, selectedYear) {
    if (!selectedYear) {
      return true;
    }
    if (selectedYear === '2020') {
      var numericYear = parseInt(cardYear, 10);
      return !Number.isNaN(numericYear) && numericYear <= 2020;
    }
    return cardYear === selectedYear;
  }

  function applyFilters() {
    var keyword = normalize(filterInput ? filterInput.value : '');
    var category = normalize(categoryFilter ? categoryFilter.value : '');
    var selectedYear = yearFilter ? yearFilter.value : '';

    cards.forEach(function (card) {
      var searchText = normalize(card.getAttribute('data-search'));
      var cardCategory = normalize(card.getAttribute('data-category'));
      var cardYear = card.getAttribute('data-year') || '';
      var matched = true;

      if (keyword && searchText.indexOf(keyword) === -1) {
        matched = false;
      }

      if (category && cardCategory !== category) {
        matched = false;
      }

      if (!matchYear(cardYear, selectedYear)) {
        matched = false;
      }

      card.classList.toggle('is-hidden', !matched);
    });
  }

  if (filterInput || categoryFilter || yearFilter) {
    var query = getQueryValue();
    if (filterInput && query) {
      filterInput.value = query;
    }

    [filterInput, categoryFilter, yearFilter].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });

    applyFilters();
  }
})();
