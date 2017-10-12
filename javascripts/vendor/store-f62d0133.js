(function($, window, document) {
    var $productOwl = $('.product-photos .owl-carousel'),
        $questionsOwl = $('.questions .owl-carousel');

    $productOwl.owlCarousel({
        items: 1,
        animateOut: false,
        animateIn: 'fadeIn',
        mouseDrag: false,
        touchDrag: true
    }).on('changed.owl.carousel', function(event) {
        $('.product-photos nav a').removeClass('active').eq(event.item.index).addClass('active');
    });

    $('.product-photos nav').on('click', 'a', function(e) {
        e.preventDefault();

        $productOwl.trigger('to.owl.carousel', [$(this).index()]);
    });

    $('.product .switch.colors li:not(.disabled) a').on('click', function(e){
        e.preventDefault();

        var $color = $(this),
            $input = $color.find('input[name=color]'),
            $section = $color.closest('.product'),
            estimate = $color.data('estimate')
        ;

        $input.prop('checked', true);

        $section.find('.photo').each(function(e) {
            var $this = $(this),
                $photo = $(this).find('img.' + $input.val());

            $this.find('img:visible').removeClass('active');
            $this.prepend($photo.addClass('active'));
            $photo.addClass('active');
        });

        $section.find('.colors .sets a').removeClass('active');
        $section.find('.colors .title .name').text(this.title);

        $color.addClass('active');

        if (estimate) {
            $section.find('.estimate-delivery').text(estimate)
        }
    });

    $('.switch.colors a.' + (URI().query(true).color || 'active')).click();

    $questionsOwl.owlCarousel({
        items: 1,
        navRewind: false,
        animateOut: false,
        animateIn: 'fadeIn',
        mouseDrag: false,
        touchDrag: false,
        autoHeight: true
    }).trigger('refresh.owl.carousel');

    $('.questions .nav a').click(function(e) {
        e.preventDefault();

        var $this = $(this);

        $this.closest('nav').find('a').removeClass('active');
        $this.addClass('active');

        $questionsOwl.trigger('to.owl.carousel', [$this.data('position')]);
    });

    $('.questions select.nav').change(function(e) {
        var $this = $(this),
            width = $this.find('option:selected').data('width');

        $this.outerWidth(width);
        $questionsOwl.trigger('to.owl.carousel', [this.value]);
    });

    $('footer .newsletter-form').on('submit', function(e){
        e.preventDefault();

        Petcube.newsletter.send($(this)).done(function(e) {
            showModalWindow(Translations.js_notifications.titles.success, Translations.js_notifications.subscription.success, 'success');
        });
    });

    $('.meta-specs .specs li a').on('click', function(e) {
        e.preventDefault();

        var $this = $(this);

        $this.toggleClass('active');
        $($this.attr('href')).slideToggle();
    });

    function dropAHint(e) {
        e.preventDefault();
        e.stopPropagation();

        disableScroll();

        var $this = $(this),
            product = $this.data('product'),
            $popup = $('#drop-a-hint');

        $popup.fadeIn('fast', function(){
            $(window).trigger('modalShow');
        }).find('.close').on('click', function(e) {
            e.preventDefault();

            $popup.fadeOut(function(){
                $popup.find('.close').off('click');
                $popup.find('form').off('submit');

                enableScroll();
            });
        });

        $popup.find('form').on('submit', function (e) {
            e.preventDefault();

            var $form = $(this),
                $submit = $form.find('[type=submit]');

            Forms.loadingButton($submit);

            $form.find('[name=product]').val(product);

            _ajaxRequest('POST', $form.attr('action'), $form.serialize())
                .done(function (e) {
                    $popup.find('.close').trigger('click');
                })
                .fail(function (t, e, n) {
                    showModalWindow(Translations.js_notifications.titles.error, t.responseJSON.error.message, 'error');
                })
                .always(function (e) {
                    Forms.enableButton($submit);
                });
        });
    }

    $(document).on('click', '#drop-a-hint-open', dropAHint);
    $(document).on('drop-a-hint', dropAHint);

})(jQuery, window, document);
