(function () {
  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function cardTemplate(movie) {
    var tags = (movie.tags || []).slice(0, 3).join(' ');
    return [
      '<a class="movie-card compact-card" href="' + escapeHtml(movie.href) + '">',
      '  <div class="poster-frame">',
      '    <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '    <span class="card-badge">' + escapeHtml(movie.group) + '</span>',
      '    <div class="poster-meta"><span>' + escapeHtml(movie.type) + '</span><span>' + escapeHtml(movie.year) + '</span></div>',
      '  </div>',
      '  <div class="card-body">',
      '    <h3>' + escapeHtml(movie.title) + '</h3>',
      '    <p>' + escapeHtml(movie.oneLine) + '</p>',
      '    <div class="card-foot"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(tags) + '</span></div>',
      '  </div>',
      '</a>'
    ].join('');
  }

  function runSearch(query) {
    var results = document.querySelector('[data-search-results]');
    var status = document.querySelector('[data-search-status]');
    var movies = window.SEARCH_MOVIES || SEARCH_MOVIES || [];
    var keyword = normalize(query);

    if (!results || !status) {
      return;
    }

    if (!keyword) {
      results.innerHTML = '';
      status.textContent = '请输入关键词开始搜索';
      return;
    }

    var matched = movies.filter(function (movie) {
      var haystack = [
        movie.title,
        movie.year,
        movie.region,
        movie.group,
        movie.type,
        movie.genre,
        (movie.tags || []).join(' '),
        movie.oneLine
      ].join(' ').toLowerCase();
      return haystack.indexOf(keyword) !== -1;
    }).slice(0, 120);

    status.textContent = matched.length ? '找到 ' + matched.length + ' 个相关结果' : '没有找到相关结果';
    results.innerHTML = matched.map(cardTemplate).join('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('[data-search-page-form]');
    var input = form ? form.querySelector('input[name="q"]') : null;
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';

    if (input) {
      input.value = query;
    }

    if (form && input) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var nextQuery = input.value.trim();
        var nextUrl = nextQuery ? './search.html?q=' + encodeURIComponent(nextQuery) : './search.html';
        window.history.replaceState(null, '', nextUrl);
        runSearch(nextQuery);
      });
    }

    runSearch(query);
  });
})();
