(function($, window, document){
    window.Header = {
        height: 0,
        shrinkHeight: 56,
        shrinkPosition: 600
    };

    window.Petcube = {
        newsletter: {
            $newsletter: $("#newsletter"),
            show: function(){
                if (!store.get('video.playing', false)){
                    var _this = this;

                    disableScroll();

                    this.$newsletter.find('.slideInUpPopUp').addClass('animated');
                    this.$newsletter.css({overflow: 'hidden'}).fadeIn('fast', function(){
                            $(window).trigger('modalShow');
                    })
                        .delay(300).promise().done(function(el){
                            el.css({overflow: 'auto'});
                        });

                    this.$newsletter.find('.close').one('click', function(event){
                        event.preventDefault();
                        _this.close();
                    });

                    ga('send', 'event', 'home', 'view', 'newsletter-popup');
                }
            },

            close: function(){
                $("#newsletter").fadeOut('fast', function(){
                    enableScroll();
                }).removeClass('animate');

                var d = new Date();
                d.setHours(d.getHours() + 1); // 1 hour ago

                if (store.enabled && !store.get('newsletter.submitted', false)) {
                    store.set('newsletter.date', d.getTime());
                }
            },

            init: function() {
                if (this.$newsletter.is(':visible')){
                    Petcube.newsletter.show()
                } else {
                    if (!store.get('newsletter.submitted', false) && new Date().getTime() >= store.get('newsletter.date', 0)) {
                        setTimeout(function() { Petcube.newsletter.show() }, 10000);
                    }
                }

                this.$newsletter.find('.email form').on('submit', function(e){
                    e.preventDefault();
                    var $form = $(this),
                        $emailForm = Petcube.newsletter.$newsletter.find('.email'),
                        $petChoose = Petcube.newsletter.$newsletter.find('.pet-choose');

                    $petChoose.find('[name=email]').val($emailForm.find('[name=email]').val());

                    Petcube.newsletter.send($form).done(function(e) {
                        $emailForm.hide();
                        $petChoose.removeClass('hidden');
                        $petChoose.find('[type=checkbox]').on('change', function() {
                            $petChoose.find('[type=submit]').text('Confirm');
                        });

                        Petcube.newsletter.$newsletter.css({overflow: 'hidden'})
                            .delay(300).promise().done(function(el){
                                el.css({overflow: 'auto'});
                            });
                    });
                });

                this.$newsletter.find('.pet-choose form').on('submit', function(e){
                    e.preventDefault();
                    var $form = $(this);

                    Petcube.newsletter.send($form).done(function(e) {
                        if ($form.find('input[name="petType[]"]:checked').length) {
                            ga('send', 'event', 'home', 'submit_form', 'newsletter_pets');
                        }

                        Petcube.newsletter.close();
                    });
                });

                // preload background
                new Image().src = this.$newsletter.find('.modal-box.email').css('background-image').replace(/url\(['"]?(.*?)['"]?\)/i, "$1");
                new Image().src = this.$newsletter.find('.modal-box.pet-choose').css('background-image').replace(/url\(['"]?(.*?)['"]?\)/i, "$1");
                //new Image().src = this.$newsletter.find('.modal-box.thanks').css('background-image').replace(/url\(['"]?(.*?)['"]?\)/i, "$1");
            },

            send: function($form) {
                var $button = $form.find('[type=submit]').prop('disabled', true);

                return $.ajax({
                    type: "POST",
                    url: $form.attr("action"),
                    data: $form.serialize(),
                    cache: false,
                    success: function(t) {
                        ga('send', 'event', 'home', 'submit_form', 'newsletter');

                        $form.trigger("reset");
                        $button.prop('disabled', false);

                        if (store.enabled) {
                            store.set('newsletter.submitted', true);
                            store.remove('newsletter.date');
                        }

                    }, error: function(response, e, n) {
                        if ("timeout" == e) {
                            showModalWindow(Translations.js_notifications.titles.error, Translations.js_errors.network, 'error');
                        } else {
                            showModalWindow(Translations.js_notifications.titles.error, response.responseText.replace(/"/g, ""), 'error');
                        }
                        $button.prop('disabled', false);
                    }, dataType: "json", timeout: 2e4})
            }
        },

        getCurrentScroll: function() {
            return window.pageYOffset || document.documentElement.scrollTop;
        },

        getFreshChatVisitorId: function(){
            return null;
        }
    };

    window.setCookie = function(cname, cvalue, exdays) {
        var d = new Date(), expires = '';

        if (exdays){
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            expires = " expires="+d.toUTCString();
        }

        document.cookie = cname + "=" + cvalue + ";" + expires;
    };

    window.allowZoom = function() {
        $("meta[name=viewport]").attr('content','width=640');
    };

    window.disableZoom = function() {
        $("meta[name=viewport]").attr('content','width=640, user-scalable=0');
    };

    window.enableScroll = function(){
        if (!$('.modal-container:visible').length){
            $('body').removeClass('noscroll');
        }
    };

    window.disableScroll = function(){
        $('body').addClass('noscroll');
    };

    window.showModalWindow = function(title, text, type, onButtonClick, asHtml) {
        var $alert = $('#alert');

        if (type == undefined) { type = 'success' }
        $alert.find('.title').prop('class', 'title ' + type).text(title);

        if (asHtml) {
            $alert.find('.text').html(text);
        } else {
            $alert.find('.text').text(text);
        }

        disableScroll();

        $alert.fadeIn(function() {
            $alert.find('button').focus();
            $(window).trigger('modalShow');

        }).find('button').on('click', function() {
            var $this = $(this);

            $alert.fadeOut(function() {
                $this.off('click');
                enableScroll();
            });

            if (typeof(onButtonClick) == 'function') {
                onButtonClick();
            }
        });
    };

    window.isRetina = function () {
        var mediaQuery = '(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)';

        if (window.devicePixelRatio > 1) {
            return true;
        }

        if (window.matchMedia && window.matchMedia(mediaQuery).matches) {
            return true;
        }

        return false;
    };

    window.isGaLoaded = function() {
        return typeof (window.ga) !== "undefined";
    };

    $('.ga').one('click', function (event) {
        var $this = $(this);

        if (window.isGaLoaded()) {
            event.preventDefault();
            console.log('event ga');
            ga('send', 'event', {
                'eventCategory': $this.data('ga-category'),
                'eventAction': $this.data('ga-action'),
                'eventLabel': $this.data('ga-label'),
                'hitCallback': function () {
                    event.target.click();
                }
            });
        }
    });

    if (false == device.mobile()) {
        retinajs();
    }

    $.fn.scrollTo = function( options ) {
        if (this.length) {
            var $this = $(this), offset = $this.offset().top,
                settings = $.extend({
                    speed: 750,
                    easing: 'swing',
                    area: 'html, body',
                    bottom: false,
                    callback: function (el) {
                    }
                }, options);

            if (settings.offset == undefined) {
                if (device.mobile()) {
                    settings.offset = Header.height
                } else {
                    if (offset >= Header.shrinkPosition) {
                        settings.offset = Header.shrinkHeight;
                    } else {
                        settings.offset = Header.height;
                    }
                }
            }

            offset -= settings.offset;

            if (settings.bottom){
                offset = $this.offset().top + $this.outerHeight() - $(window).height();
            }

            $(settings.area).animate({scrollTop: offset}, settings.speed, settings.easing, function(){
                settings.callback($this)
            });
        }

        return this;
    };

    $.fn.shuffle = function() {
        var allElems = this.get(),
            getRandom = function(max) {
                return Math.floor(Math.random() * max);
            },
            shuffled = $.map(allElems, function(){
                var random = getRandom(allElems.length),
                    randEl = $(allElems[random]).clone(true)[0];
                allElems.splice(random, 1);
                return randEl;
            });

        this.each(function(i){
            $(this).replaceWith($(shuffled[i]));
        });

        return $(shuffled);
    };

    $(document).on('click closeModal', '.modal-container', function() {
        $(this)
            .fadeOut('fast', function(){ enableScroll(); })
            .find('.close').click()
        ;
    }).on('click', '.modal-box', function(e) {
        e.stopPropagation();
    });

    $(document).bind('keydown', function(e) {
        if (e.which == 27) {
            $('.modal-container:visible').fadeOut('fast', function() {
                $(this).trigger('closeModal');
            });

            $('.region-selector.active .icon-close').click();
        }
    });

    $(window).on('resize modalShow', function() {
        var $modalBox = $('.modal-box:visible');

        if ($modalBox.outerHeight() > $(window).height()) {
            $modalBox.addClass('top');
        } else {
            $modalBox.removeClass('top');
        }

    }).trigger('resize');

    $(document).on('change', 'select', function(event) { if (this.value) {$(this).removeClass('not-selected') }});

})(jQuery, window, document);
