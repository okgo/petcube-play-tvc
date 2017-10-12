(function($, window, document) {
    var controller = null;

    function initScrollMagic() {
        // init controller
        controller = new ScrollMagic.Controller();

        // scene for Best in Show slider
        var builderConfig2 = {
            triggerElement: ".pinned",
            duration: 700,
            offset: -$('.header-menu').height(),
            triggerHook: 0
        };
        var $firstVideo = $('#all-in-one-video-1').show();
        var $secondVideo = $('#all-in-one-video-2').show();

        var scene21 = new ScrollMagic.Scene(builderConfig2)
            .addTo(controller)
            // .addIndicators()
            .setPin(".pinned")

        var scene22 = new ScrollMagic.Scene(Object.assign(builderConfig2, {duration: 400}))
            .addTo(controller)
            .setTween(TweenMax.to("#all-in-one .bg-1 .video-block", 1, {ease: Power2.easeIn, autoAlpha: 0}))
            .on("enter leave", function(e){
              if (e.type === "enter") {
                  if ($firstVideo.length) {
                      $firstVideo.get(0).play();
                  }
              }
              if (e.type === "leave") {
                  if ($firstVideo.length) {
                      $firstVideo.get(0).pause();
                  }
              }
            });

        var scene23 = new ScrollMagic.Scene(builderConfig2)
            .addTo(controller)
            .setTween(TweenMax.to("#all-in-one .bg-2 .video-block", 1, {ease: Power2.easeIn, autoAlpha: 1}));

        var scene24 = new ScrollMagic.Scene(builderConfig2)
            .addTo(controller)
            // .addIndicators({name: 'change sing 1'})
            .setTween(TweenMax.to("#all-in-one .sign-1, #all-in-one .sign-1 .quote-cloud-1, #all-in-one .sign-1 .quote-cloud-2", 1, {backgroundColor: 'rgba(255, 255, 255, 0)'}));

        var scene25 = new ScrollMagic.Scene(builderConfig2)
            .addTo(controller)
            // .addIndicators({name: 'change sing 2'})
            .setTween(TweenMax.to("#all-in-one .sign-2, #all-in-one .sign-2 .quote-cloud-1, #all-in-one .sign-2 .quote-cloud-2", 1, {backgroundColor: 'rgba(255, 255, 255, .7 )'}));

        var scene26 = new ScrollMagic.Scene(Object.assign(builderConfig2, {duration: 700, offset: 300}))
            .addTo(controller)
            // .addIndicators({name: 'video play'})
            .on("enter leave", function (e) {
                if (e.type === "enter") {
                    if ($secondVideo.length) {
                        $secondVideo.get(0).play();
                    }
                }
                if (e.type === "leave") {
                    if ($secondVideo.length) {
                        $secondVideo.get(0).pause();
                    }
                }
            });
        // scene for on the go care slide
        var scene27 = new ScrollMagic.Scene({
          triggerElement: ".on-the-go",
          offset: -$('.header-menu').height(),
          triggerHook: 0.1
        })
        .addTo(controller)
        .on("enter leave", function (e) {
            if (e.type === "enter") {
                $('.owl-item.active').find('video').get(0).play();
            }
            if (e.type === "leave") {
                $('.owl-item.active').find('video').get(0).pause();
            }
        });

        // scene for beauty inside out slide
        tween28 = new TimelineMax().fromTo(".beauty-inside-out .h1", .5, {
          x: '-25px',
          opacity: 0
        }, {
          x: '0',
          opacity: 1
        }).fromTo(".beauty-inside-out p", .5, {
          x: '-25px',
          opacity: 0
        }, {
          x: '0',
          opacity: 1
        });

        var scene28 = new ScrollMagic.Scene({
            triggerElement: ".beauty-inside-out",
            reverse: false
        })
        .addTo(controller)
        .setTween(tween28);

    }

    if( $(window).width() > 767) {
        initScrollMagic();
    } else {
        // playMobileVideos();
    }

    $(window).resize(function(){
        if( $(window).width() < 768 ) {
            if (controller) {
                controller = controller.destroy(true);
                // playMobileVideos();
            }
        } else if ( $(window).width() > 767 ) {
            if ( !controller ) {
                initScrollMagic();
                // stopMobileVideos();
            }
        }
    });

    var $videoOwl = $('.owl-carousel.video-owl');

    $videoOwl.on('initialized.owl.carousel', function(e){
      if( $(window).width() < 641 ) {
        $('.owl-item.active video').get(0).play();
      }
    })

    $videoOwl.owlCarousel({
        loop: true,
        items: $videoOwl.data('owl-items')?$videoOwl.data('owl-items'):1,
        animateIn: 'fadeIn',
        animateOut: 'fadeOut',
        navRewind: false,
        responsive: $videoOwl.data('owl-responsive')
    })
    .on('translated.owl.carousel', function(e){
        $('.owl-item video').each(function(){
          $(this).get(0).pause();
        });
        $('.owl-item.active video').get(0).play();
    })
    .siblings('.on-the-go-carousel-nav')
    .on('click', '.owl-dot', function (e) {
        e.preventDefault();
        $('.owl-dot').removeClass('is-active');
        $(this).addClass('is-active');
        var index = $(this).data('index');
        $videoOwl.trigger('to.owl.carousel', [index, 300]);
    });

})(jQuery, window, document);
