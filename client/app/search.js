

/*============================================
=            Video Player Section            =
============================================*/

// Load the IFrame Player API code asynchronously.
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/player_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // Replace the 'ytplayer' element with an <iframe> and
  // YouTube player after the API code downloads.
  var player;
  function onYouTubePlayerAPIReady() {
    player = new YT.Player('video-big', {
      videoId: 'Uj49PA8-L1E',
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
        'onReady' : function (e) {e.target.playVideo(); e.target.setVolume(0); e.target.setPlaybackQuality(hd720); },
        'onStateChange' : function (e) {e.target.playVideo(); }
      }
    });
  }

  /*===================================
  =            Login Modal            =
  ===================================*/



