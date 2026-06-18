(function () {
  function initVideoPlayer(config) {
    var video = document.getElementById(config.videoId);
    var button = document.getElementById(config.buttonId);
    var cover = document.getElementById(config.coverId);
    var source = config.source;
    var hls = null;

    if (!video || !button || !source) {
      return;
    }

    if (config.poster) {
      video.setAttribute('poster', config.poster);
    }

    function setMessage(text) {
      button.innerHTML = '<span class="play-ring">!</span><strong>' + text + '</strong>';
    }

    function attachSource() {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            setMessage('视频加载失败，请刷新页面重试');
            button.classList.remove('is-hidden');
          }
        });
        return;
      }

      setMessage('当前浏览器无法播放此视频');
    }

    function playVideo() {
      button.classList.add('is-hidden');
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          button.classList.remove('is-hidden');
        });
      }
    }

    button.addEventListener('click', function (event) {
      event.preventDefault();
      playVideo();
    });

    video.addEventListener('click', function () {
      if (video.paused) {
        playVideo();
      }
    });

    video.addEventListener('play', function () {
      button.classList.add('is-hidden');
    });

    video.addEventListener('pause', function () {
      if (!video.ended) {
        button.classList.remove('is-hidden');
      }
    });

    video.addEventListener('ended', function () {
      button.classList.remove('is-hidden');
    });

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });

    if (cover) {
      cover.classList.add('player-ready');
    }

    attachSource();
  }

  window.initVideoPlayer = initVideoPlayer;
})();
