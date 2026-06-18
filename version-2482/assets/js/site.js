(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (toggle && mobileNav) {
      toggle.addEventListener('click', function () {
        mobileNav.classList.toggle('is-open');
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var current = 0;

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

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    var searchRoot = document.querySelector('[data-search-root]');

    if (searchRoot && window.MOVIE_INDEX) {
      var input = document.querySelector('[data-search-input]');
      var form = document.querySelector('[data-search-form]');
      var result = document.querySelector('[data-search-result]');
      var root = searchRoot.getAttribute('data-search-root') || '';
      var params = new URLSearchParams(window.location.search);
      var initial = params.get('q') || '';

      if (input) {
        input.value = initial;
      }

      function movieCard(movie) {
        var tags = movie.tags.slice(0, 3).map(function (tag) {
          return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');

        return [
          '<article class="movie-card">',
          '<a class="poster-frame" href="' + root + movie.url + '" aria-label="' + escapeHtml(movie.title) + '">',
          '<img src="' + root + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy" onerror="this.style.display=\'none\'">',
          '<span class="poster-shine"></span>',
          '<span class="card-type">' + escapeHtml(movie.type) + '</span>',
          '</a>',
          '<div class="card-content">',
          '<div class="card-meta"><span>' + escapeHtml(movie.type) + '</span><span>' + escapeHtml(movie.year) + '</span></div>',
          '<h2><a href="' + root + movie.url + '">' + escapeHtml(movie.title) + '</a></h2>',
          '<p>' + escapeHtml(movie.oneLine) + '</p>',
          '<div class="tag-row">' + tags + '</div>',
          '</div>',
          '</article>'
        ].join('');
      }

      function escapeHtml(value) {
        return String(value || '').replace(/[&<>'"]/g, function (char) {
          return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
          }[char];
        });
      }

      function render(query) {
        var q = String(query || '').trim().toLowerCase();
        var list = window.MOVIE_INDEX;

        if (q) {
          list = list.filter(function (movie) {
            return [movie.title, movie.year, movie.type, movie.genre, movie.oneLine, movie.tags.join(' ')]
              .join(' ')
              .toLowerCase()
              .indexOf(q) !== -1;
          });
        }

        list = list.slice(0, 80);

        if (!result) {
          return;
        }

        if (!list.length) {
          result.innerHTML = '<div class="empty-result">没有找到匹配的影片。</div>';
          return;
        }

        result.innerHTML = list.map(movieCard).join('');
      }

      if (form) {
        form.addEventListener('submit', function (event) {
          event.preventDefault();
          var query = input ? input.value : '';
          var url = new URL(window.location.href);
          if (query.trim()) {
            url.searchParams.set('q', query.trim());
          } else {
            url.searchParams.delete('q');
          }
          window.history.replaceState({}, '', url.toString());
          render(query);
        });
      }

      if (input) {
        input.addEventListener('input', function () {
          render(input.value);
        });
      }

      render(initial);
    }
  });
})();
