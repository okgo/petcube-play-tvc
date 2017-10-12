window.YouTube = (function($, window, document) {
    store.remove('video.playing');

    $("#shelter-video #video, #shelter-video #videoplay").on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        showVideo('BvuxBFlaRMU', function() {

        });
    });

    var $ytVideo = $(".yt-video").on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        showVideo($(this).data('id'), function() {

        });
    });

    if (URI().query(true).video == 'true') {
        $ytVideo.first().click()
    }

    // attach our YT listener once the API is loaded
    function _initVideo(id, videoId, callback) {
        window.onYouTubeIframeAPIReady = function() {
            window.player = new YT.Player(id, {
                height: '315',
                width: '560',
                videoId: videoId,
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
                    onStateChange: function(e){
                        if (e["data"] == YT.PlayerState.PLAYING && YT.gtmLastAction == "play") {
                            callback();

                            YT.gtmLastAction = "";
                        }

                        if (e["data"] == YT.PlayerState.PLAYING){
                            if (store.enabled) {
                                store.set('video.playing', YT.PlayerState.PLAYING);
                            }
                        }

                        if (e["data"] == YT.PlayerState.PAUSED || e["data"] == YT.PlayerState.ENDED) {
                            if (store.enabled) {
                                store.remove('video.playing');
                            }

                            // Petcube.newsletter.init();
                        }
                    },
                    onReady: function() {
                        if (device.desktop()) {
                            window.player.playVideo();
                        }
                    }
                }
            });

            $(window).trigger('scroll');
            YT.gtmLastAction = "play";
        };

        _loadYoutubeIfNotLoadedYet();
    }

    function _loadYoutubeIfNotLoadedYet() {
        if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
            // load the Youtube JS api and get going
            var tag = document.createElement('script');
            tag.src = "//www.youtube.com/player_api";
            tag.async = true;
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
            window.onYouTubeIframeAPIReady();
        }
    }

    function _showVideoPopup() {
        var $popup = $('#video-popup'),
            preview = document.getElementById('preview');

        disableScroll();
        if (preview) { preview.pause() }

        $popup.fadeIn('fast', function(){
            $(window).trigger('modalShow');
        }).find('.close').on('click', function(e){
            e.preventDefault();

            store.remove('video.playing');

            $popup.fadeOut(function(){
                window.player.destroy();
                enableScroll();

                $popup.find('.close').off('click');
                if (preview) { preview.play() }
            });
        })
    }

    function showVideo(id, callback) {
        _showVideoPopup();
        _initVideo('popup-player', id, function(){
            if (typeof callback == 'function') {
                callback();
            }
        });
    }

    return {
        showVideo: showVideo
    }
})(jQuery, window, document);
