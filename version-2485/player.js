(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var players = Array.prototype.slice.call(document.querySelectorAll("[data-stream]"));

    players.forEach(function (player) {
      var video = player.querySelector("video");
      var button = player.querySelector("[data-play-button]");
      var streamUrl = player.getAttribute("data-stream");
      var attached = false;
      var hls = null;

      function attachStream() {
        if (!video || !streamUrl || attached) {
          return;
        }

        attached = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = streamUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(streamUrl);
          hls.attachMedia(video);
        } else {
          video.src = streamUrl;
        }
      }

      function playMovie() {
        if (!video) {
          return;
        }

        attachStream();
        player.classList.add("is-playing");
        var attempt = video.play();

        if (attempt && typeof attempt.catch === "function") {
          attempt.catch(function () {
            player.classList.remove("is-playing");
          });
        }
      }

      if (button) {
        button.addEventListener("click", playMovie);
      }

      if (video) {
        video.addEventListener("click", function () {
          if (video.paused) {
            playMovie();
          }
        });

        video.addEventListener("play", function () {
          player.classList.add("is-playing");
        });

        video.addEventListener("ended", function () {
          player.classList.remove("is-playing");
        });
      }

      window.addEventListener("pagehide", function () {
        if (hls) {
          hls.destroy();
          hls = null;
        }
      });
    });
  });
})();
