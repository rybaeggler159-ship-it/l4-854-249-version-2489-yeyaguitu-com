(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  ready(function () {
    var menuToggle = document.querySelector("[data-menu-toggle]");
    var mainNav = document.querySelector("[data-main-nav]");

    if (menuToggle && mainNav) {
      menuToggle.addEventListener("click", function () {
        var expanded = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!expanded));
        mainNav.classList.toggle("is-open", !expanded);
      });
    }

    var carousel = document.querySelector("[data-hero-carousel]");

    if (carousel) {
      var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
      var index = 0;

      function activate(nextIndex) {
        if (!slides.length) {
          return;
        }

        index = (nextIndex + slides.length) % slides.length;

        slides.forEach(function (slide, position) {
          slide.classList.toggle("is-active", position === index);
        });

        dots.forEach(function (dot, position) {
          dot.classList.toggle("active", position === index);
        });
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          var nextIndex = Number(dot.getAttribute("data-hero-dot"));
          activate(nextIndex);
        });
      });

      window.setInterval(function () {
        activate(index + 1);
      }, 5200);
    }

    var filterPanel = document.querySelector("[data-filter-panel]");
    var resultRoot = document.querySelector("[data-filter-results]");

    if (filterPanel && resultRoot) {
      var keywordInput = filterPanel.querySelector("[data-filter-keyword]");
      var yearInput = filterPanel.querySelector("[data-filter-year]");
      var typeInput = filterPanel.querySelector("[data-filter-type]");
      var categoryInput = filterPanel.querySelector("[data-filter-category]");
      var cards = Array.prototype.slice.call(resultRoot.querySelectorAll("[data-card]"));
      var params = new URLSearchParams(window.location.search);
      var query = params.get("q");

      if (query && keywordInput) {
        keywordInput.value = query;
      }

      function filterCards() {
        var keyword = normalize(keywordInput && keywordInput.value);
        var year = normalize(yearInput && yearInput.value);
        var type = normalize(typeInput && typeInput.value);
        var category = normalize(categoryInput && categoryInput.value);

        cards.forEach(function (card) {
          var content = normalize(card.getAttribute("data-search"));
          var cardYear = normalize(card.getAttribute("data-year"));
          var cardType = normalize(card.getAttribute("data-type"));
          var cardCategory = normalize(card.getAttribute("data-category"));
          var visible = true;

          if (keyword && content.indexOf(keyword) === -1) {
            visible = false;
          }

          if (year && cardYear.indexOf(year) === -1) {
            visible = false;
          }

          if (type && content.indexOf(type) === -1 && cardType.indexOf(type) === -1) {
            visible = false;
          }

          if (category && cardCategory !== category) {
            visible = false;
          }

          card.classList.toggle("is-hidden", !visible);
        });
      }

      [keywordInput, yearInput, typeInput, categoryInput].forEach(function (input) {
        if (!input) {
          return;
        }

        input.addEventListener("input", filterCards);
        input.addEventListener("change", filterCards);
      });

      filterCards();
    }
  });
})();
