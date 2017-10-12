var t, e, i;
e = function(t, i, n) {
  this.id = t || '';
  this.videoId = i || '';
  this.size = n || {
    w: 640,
    h: 480
  };
  this.videoElem = document.getElementById(t);
  this.videoImageElem = this.videoElem.parentNode.childNodes[0];
  this.player = null;
  this.init = function(t, n) {
    var r;
    this.videoImageElem.style.backgroundImage = 'url(\'//img.youtube.com/vi/' + i + '/maxresdefault.jpg\')';
    this.size.w = t || this.size.w;
    this.size.h = n || this.size.h;
    this.tryLoadYoutubeApi();
    e.youtubeVideoInstances.push(this)
  };
  this.onVideoImageClick = function(e) {
    this.videoImageElem.style.display = 'none';
    this.play()
  };
  this.onReady = function() {};
  this.onStateChange = function() {};
  this.play = function() {
    this.player.playVideo()
  };
  this.stop = function() {
    this.player.stopVideo()
  };
  this.onYouTubeIframeAPIReady = function() {
    var e;
    e = this;
    this.player = new YT.Player(this.id, {
      width: this.size.w,
      height: this.size.h,
      videoId: this.videoId,
      playerVars: {
        modestbranding: 0,
        rel: 0,
        feature: 'player_detailpage',
        wmode: 'transparent',
        iv_load_policy: 3,
        showinfo: 0,
        autohide: 1
      },
      events: {
        onStateChange: function(t) {
          e.onStateChange()
        },
        onReady: function() {
          e.onReady()
        }
      }
    });
    this.videoImageElem.addEventListener('click', this.onVideoImageClick.bind(e), !1);
    this.videoImageElem.addEventListener('click', this.onVideoImageClick.bind(e), !1)
  };
  this.tryLoadYoutubeApi = function() {
    var t, e;
    if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
      e = document.createElement('script');
      e.src = '//www.youtube.com/player_api';
      e.async = !0;
      t = document.getElementsByTagName('script')[0];
      t.parentNode.insertBefore(e, t)
    } else {
      this.onYouTubeIframeAPIReady()
    }
  }
};
e.youtubeVideoInstances = [];
onYouTubeIframeAPIReady = function() {
  console.info(e.youtubeVideoInstances);
  for (var t in e.youtubeVideoInstances) {
    if ((typeof e.youtubeVideoInstances[t]) === 'object') {
      e.youtubeVideoInstances[t].onYouTubeIframeAPIReady()
    }
  }
};

$(document).ready(function() {
  var t, n;
  if ($('#discounts-petcube-video').length > 0) {
    t = new e('discounts-petcube-video', 'pjbexIyZPTo');
    t.init(800, 450)
  };
  if ($('#travel-petcube-video-2').length > 0) {
    n = new e('travel-petcube-video-2', 'g1AdeQ99Ba0');
    n.init(800, 450)
  };
});
