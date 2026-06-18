(function () {
  var blocks = Array.prototype.slice.call(document.querySelectorAll('[data-video]'));

  blocks.forEach(function (block) {
    var video = block.querySelector('video');
    var button = block.querySelector('.player-start');
    var url = block.getAttribute('data-video');
    var ready = false;
    var hls;

    var load = function () {
      if (!video || !url) {
        return;
      }
      if (!ready) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ maxBufferLength: 30 });
          hls.loadSource(url);
          hls.attachMedia(video);
        } else {
          video.src = url;
        }
        ready = true;
      }
      block.classList.add('is-playing');
      var play = video.play();
      if (play && play.catch) {
        play.catch(function () {});
      }
    };

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        load();
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        if (!ready || video.paused) {
          load();
        }
      });
      video.addEventListener('play', function () {
        block.classList.add('is-playing');
      });
    }

    window.addEventListener('pagehide', function () {
      if (hls && hls.destroy) {
        hls.destroy();
      }
    });
  });
})();
