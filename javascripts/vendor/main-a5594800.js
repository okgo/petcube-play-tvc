(function($, window, document){
    $(window).load(function() {
        $('.preload').addClass('loaded');
    });

    // $('.feedbacks .feedback').shuffle();

    var $owl = $('#slider').find('.owl-carousel');
    $owl.owlCarousel({
        loop: true,
        items: 1,
        navRewind: false,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplaySpeed: 500
    }).on('click', '.owl-item .owl-dot', function (e) {
        e.preventDefault();

        $owl.trigger('to.owl.carousel', [$(this).index(), 500]);
    });

    var $mobileAppOwl = $('#mobile-app-slider').find('.owl-carousel');
    $mobileAppOwl.owlCarousel({
        loop: true,
        items: 1,
        navRewind: false,
        autoplay: true,
        autoplayTimeout: 5000,
        animateIn: 'fadeIn',
        animateOut: 'fadeOut',
        mouseDrag: false,
        touchDrag: false
    });

    var $simpleOwl = $('.owl-carousel.simple-owl');
    $simpleOwl.owlCarousel({
        loop: true,
        items: $simpleOwl.data('owl-items')?$simpleOwl.data('owl-items'):1,
        animateIn: 'fadeIn',
        animateOut: 'fadeOut',
        navRewind: false,
        autoplay: $simpleOwl.is('.simple-owl-autoplay'),
        autoplayTimeout: 12000,
        autoplaySpeed: 300,
        mouseDrag: $simpleOwl.is('.simple-owl-mouseDrag'),
        touchDrag: $simpleOwl.is('.simple-owl-touchDrag'),
        responsive: $simpleOwl.data('owl-responsive')
    }).closest('.mode-switcher').on('click', '.simple-owl-dot', function (e) {
        e.preventDefault();

        $simpleOwl.trigger('to.owl.carousel', [$(this).index(), 300]);
    });

    $('.download-radio2, .download-radio2label').click(function(){
        $('.download-radio2').addClass('download-form-checked-radio');
        $('.download-radio2').removeClass('download-form-unchecked-radio');
        $('.download-form-radio2').prop('checked', true);

        $('.download-radio1').addClass('download-form-unchecked-radio');
        $('.download-radio1').removeClass('download-form-checked-radio');
        $('.download-form-radio1').removeProp('checked');
    });

    $('.download-radio1, .download-radio1label').click(function(){
        $('.download-radio1').addClass('download-form-checked-radio');
        $('.download-radio1').removeClass('download-form-unchecked-radio');
        $('.download-form-radio1').prop('checked', true);

        $('.download-radio2').addClass('download-form-unchecked-radio');
        $('.download-radio2').removeClass('download-form-checked-radio');
        $('.download-form-radio2').removeProp('checked');
    });

    $('.footer-mailing-text form').on('submit', function(e) {
        e.preventDefault();

        Petcube.newsletter.send($(this)).done(function(e) {
            showModalWindow(Translations.js_notifications.titles.success, Translations.js_notifications.subscription.success, 'success');
        });
    });

    $('#viewcontacts').click(function(e) {
        e.preventDefault();
        $('.contacts-container').slideToggle("slow" );
        $('.partners-container').hide();
    });

    $('#download_user_guide').click(function(event) {
        event.preventDefault();
        var redirect = this.href;

        if (window.isGaLoaded()) {
            ga('send', 'event', {
                'eventCategory': 'home',
                'eventAction': 'download_user_guide',
                'eventLabel': 'user_guide',
                'hitCallback': function () {
                    document.location = redirect;
                }
            });
        } else {
            document.location = redirect;
        }
    });

    $('.desktop .feedbacks a').on('click', function(event) {
        event.preventDefault();

        var $popup = $('#feedback-popup'),
            $this = $(this),
            parentClass = $(this).parent().attr('class');

        if (!$this.data('embed')) {
            window.location.href = this.href;
        }

        disableScroll();

        $popup.addClass(parentClass).fadeIn(function() {
            $popup.find('.embed').html($($this.data('embed')));
            $(window).trigger('modalShow');

        }).find('.close').on('click', function(e) {

            e.preventDefault();

            $popup.fadeOut(function(){
                $popup.find('.embed').html('');
                $popup.find('.close').off('click');
                $popup.removeClass(parentClass);

                enableScroll();
            });
        })
    });

    $('html[lang=ru] .order-button, html[lang=uk] .order-button').removeAttr('onclick').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();

        disableScroll();

        var $popup = $('#ru-order-popup');

        $popup.fadeIn('fast', function(){
            $(window).trigger('modalShow');
        }).find('.close').on('click', function(e) {
            e.preventDefault();

            $popup.fadeOut(function(){
                $popup.find('.close').off('click');

                enableScroll();
            });
        });
    });

    $('.referral-form').on('submit', function(e) {
        e.preventDefault();

        var $form = $(this);

        window.amdassador_refer_friend = 1;

        setTimeout(function() { window.amdassador_refer_friend = 0; }, 500);

        ga('send', 'event', 'Referral', 'Create account button clicked', $form.data('place'));
    });

    $('.post-ks-sign a').on('click', function(e) {
        e.preventDefault();

        disableScroll();

        var $popup = $('#post-ks-popup');

        $popup.fadeIn('fast', function(){
            $(window).trigger('modalShow');
        }).find('.close').on('click', function(e) {
            e.preventDefault();

            $popup.fadeOut(function(){
                $popup.find('.close').off('click');
                $popup.find('.modal-box.sign').show();
                $popup.find('.modal-box.thanks').hide();

                enableScroll();
            });
        });

    });

    $('#postksform').on('submit', function(e){
        e.preventDefault();

        var $form = $(this);
        var $button = $form.find('[type=submit]').prop('disabled', true);
        var $popup = $form.closest('#post-ks-popup');

        // send to Mailchimp
        $.ajax({
            type: "POST",
            url: $form.attr("action"),
            data: $form.serialize(),
            cache: false,
            success: function(t) {
                $popup.find('.modal-box.sign').fadeOut('fast', function () {
                    $form.trigger("reset");
                    $button.prop('disabled', false);
                    $popup.find('.modal-box.thanks').fadeIn('fast');
                });

                ga('send', 'event', 'home', 'submit_form', 'play-bites-preorder');
            }, error: function(response, e, n) {
                if ("timeout" == e) {
                    showModalWindow(Translations.js_notifications.titles.error, Translations.js_errors.network, 'error');
                } else {
                    showModalWindow(Translations.js_notifications.titles.error, response.responseText.replace(/"/g, ""), 'error');
                }
                $button.prop('disabled', false);
        }, dataType: "json", timeout: 2e4})
    });

    $('.notice-close').on('click', function (e) {
        e.preventDefault();

        var $this = $(this),
            $notice = $this.parent();

        $notice.fadeOut('fast', function () {
            if ($this.is('.remembered')) {
                setCookie($notice.attr('id'), 'closed');
            }
        });
    });

    $('.color-choose .switch.colors a').on('click', function(e){
        e.preventDefault();

        var $color = $(this),
            $section = $color.closest('.color-choose'),
            $photo = $section.find('.photo .' + $color.data('value')),
            $colorField = $section.find('input[name=color]');

        $section.find('.colors .sets a').removeClass('active');
        $color.addClass('active');

        $colorField.val($color.data('value'));

        $section.find('.photo img:visible').removeClass('active');
        $section.find('.photo').prepend($photo);
        $photo.addClass('active');

        $section.find('form .button').attr('href', $color.data('href'));
    });
})(jQuery, window, document);
