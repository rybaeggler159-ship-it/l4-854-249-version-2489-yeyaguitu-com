(function () {
  var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

  function setMessage(player, text) {
    var message = player.querySelector('.player-message');
    if (!message) {
      return;
    }
    message.textContent = text;
    message.hidden = !text;
  }

  function createHlsPlayer(video, sourceUrl, player) {
    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hls.loadSource(sourceUrl);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {
          setMessage(player, '请再次点击视频开始播放。');
        });
      });
      hls.on(window.Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          setMessage(player, '当前视频加载失败，请稍后重试。');
          hls.destroy();
        }
      });
      player.hlsInstance = hls;
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = sourceUrl;
      video.addEventListener('loadedmetadata', function () {
        video.play().catch(function () {
          setMessage(player, '请再次点击视频开始播放。');
        });
      }, { once: true });
      return;
    }

    setMessage(player, '当前浏览器暂不支持在线播放。');
  }

  players.forEach(function (player) {
    var video = player.querySelector('video');
    var overlay = player.querySelector('.player-overlay');
    var sourceUrl = player.getAttribute('data-stream-url');
    var started = false;

    function start() {
      if (!video || !sourceUrl) {
        setMessage(player, '当前视频加载失败，请稍后重试。');
        return;
      }

      player.classList.add('is-started');
      video.setAttribute('controls', 'controls');

      if (!started) {
        started = true;
        createHlsPlayer(video, sourceUrl, player);
      } else {
        video.play().catch(function () {
          setMessage(player, '请再次点击视频开始播放。');
        });
      }
    }

    if (overlay) {
      overlay.addEventListener('click', function (event) {
        event.preventDefault();
        start();
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        if (!started || video.paused) {
          start();
        }
      });
      video.addEventListener('play', function () {
        setMessage(player, '');
      });
    }
  });
})();
