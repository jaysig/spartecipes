angular.module('recipes.video', [])
  .directive('videoBackground', [function() {
    return {
      restrict: 'A',
      template: '<div id="video-big"></div>',
      replace: true,
      link: function(scope, el, attr) {
        /**
         * Injects Youtube API script to body if it doesn't exist
         */
        if (typeof YT === 'undefined') {
          var tag = document.createElement('script');
          tag.src = "https://www.youtube.com/player_api";
          var firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        /**
         * When Youtube API is loaded, replaces template with iframe
         * video-id must be passed as an attribute to the directive
         */
        var player;
        window.onYouTubePlayerAPIReady = function() {

          player = new YT.Player(attr.id, {
            videoId: attr.videoId,
            autoplay: 1,
            controls: 0,
            enablejsapi: 1,
            end: 1,
            start: 5,
            fs: 0,
            loop: 1,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            showinfo: 0,
            events: {
              'onReady': function(e) {
                e.target.playVideo();
                e.target.setVolume(0);
                e.target.setPlaybackQuality('hd720');
              },
              'onStateChange': function(e) {
                e.target.playVideo();
              }
            }
          });
        };
      }
    };
  }]);
