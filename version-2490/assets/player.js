(function () {
  function startPlayer(card) {
    var video = card.querySelector('video');
    var overlay = card.querySelector('[data-play-button]');

    if (!video) {
      return;
    }

    var source = video.getAttribute('data-video-src');

    if (!source) {
      return;
    }

    if (!video.getAttribute('src')) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    video.controls = true;

    if (overlay) {
      overlay.classList.add('is-hidden');
    }

    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        if (overlay) {
          overlay.classList.remove('is-hidden');
        }
      });
    }
  }

  document.querySelectorAll('[data-player]').forEach(function (card) {
    var overlay = card.querySelector('[data-play-button]');
    var video = card.querySelector('video');

    if (overlay) {
      overlay.addEventListener('click', function () {
        startPlayer(card);
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        startPlayer(card);
      });
    }
  });
})();
