(function () {
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function initMenu() {
    var button = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }
    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }
    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        start();
      });
    });
    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function initFilters() {
    document.querySelectorAll("[data-search-scope]").forEach(function (scope) {
      var input = scope.querySelector("[data-search-input]");
      var chips = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-group]"));
      var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card]"));
      var empty = scope.querySelector("[data-empty-state]");
      var filters = {};
      chips.forEach(function (chip) {
        if (chip.getAttribute("data-filter-value") === "") {
          chip.classList.add("active");
        }
        chip.addEventListener("click", function () {
          var group = chip.getAttribute("data-filter-group");
          var value = chip.getAttribute("data-filter-value") || "";
          filters[group] = value;
          chips.filter(function (item) {
            return item.getAttribute("data-filter-group") === group;
          }).forEach(function (item) {
            item.classList.toggle("active", (item.getAttribute("data-filter-value") || "") === value);
          });
          update();
        });
      });
      if (input) {
        input.addEventListener("input", update);
      }
      function update() {
        var query = input ? input.value.trim().toLowerCase() : "";
        var shown = 0;
        cards.forEach(function (card) {
          var text = (card.getAttribute("data-search-text") || "").toLowerCase();
          var matched = !query || text.indexOf(query) !== -1;
          Object.keys(filters).forEach(function (group) {
            var value = filters[group];
            if (value && (card.getAttribute("data-" + group) || "") !== value) {
              matched = false;
            }
          });
          card.style.display = matched ? "" : "none";
          if (matched) {
            shown += 1;
          }
        });
        if (empty) {
          empty.classList.toggle("show", shown === 0);
        }
      }
      update();
    });
  }

  window.setupVideoPlayer = function (videoId, layerId, mediaUrl) {
    var video = document.getElementById(videoId);
    var layer = document.getElementById(layerId);
    if (!video || !mediaUrl) {
      return;
    }
    var hls = null;
    var attached = false;
    function attach() {
      if (attached) {
        return;
      }
      attached = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = mediaUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(mediaUrl);
        hls.attachMedia(video);
      } else {
        video.src = mediaUrl;
      }
    }
    function play() {
      attach();
      if (layer) {
        layer.classList.add("is-hidden");
      }
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {
          if (layer) {
            layer.classList.remove("is-hidden");
          }
        });
      }
    }
    if (layer) {
      layer.addEventListener("click", play);
    }
    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });
    video.addEventListener("play", function () {
      if (layer) {
        layer.classList.add("is-hidden");
      }
    });
    video.addEventListener("pause", function () {
      if (layer && video.currentTime === 0) {
        layer.classList.remove("is-hidden");
      }
    });
    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
  };

  onReady(function () {
    initMenu();
    initHero();
    initFilters();
  });
})();
