(function($, window, document) {
    window.Petcube = {
        newsletter: {
            showDelay: 7000,
            $newsletter: $("#newsletter"),
            show: function() {
                if (!store.get('video.playing', false)) {
                    var _this = this;

                    disableScroll();

                    this.$newsletter.find('.slideInUpPopUp').addClass('animated');
                    this.$newsletter.css({overflow: 'hidden'}).fadeIn('fast');

                    $(window).trigger('modal.newsletterShow');
                    $(window).trigger('modalShow');

                    this.$newsletter.delay(300).promise().done(function(el){
                        el.css({overflow: 'auto'});
                    });

                    this.$newsletter.find('.close').one('click', function(event){
                        event.preventDefault();
                        _this.close();
                    });

                    this.$newsletter.find('.close-text').one('click', function(event){
                        event.preventDefault();
                        _this.close();
                    });
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

                $(window).trigger('modal.newsletterClose');
            },

            init: function(templateUrl) {
                if (!store.get('newsletter.submitted', false) && new Date().getTime() >= store.get('newsletter.date', 0)) {
                    $(window).trigger('modal.newsletterInit');
                    var _this = this;
                    $(window).load(function () {
                        _this.$newsletter = $("#newsletter");
                        new Image().src = _this.$newsletter.find('.modal-box.email').css('background-image').replace(/url\(['"]?(.*?)['"]?\)/i, "$1");
                        new Image().src = _this.$newsletter.find('.modal-box.pet-choose').css('background-image').replace(/url\(['"]?(.*?)['"]?\)/i, "$1");

                        setTimeout(function () {
                            Petcube.newsletter.initEvents();
                            Petcube.newsletter.show();
                        }, _this.showDelay); // after 7 seconds
                    });
                }
            },

            initEvents: function() {
                this.$newsletter.find('.email form').on('submit', function(e){
                    e.preventDefault();
                    var $form = $(this),
                        $emailForm = Petcube.newsletter.$newsletter.find('.email'),
                        $petChoose = Petcube.newsletter.$newsletter.find('.pet-choose'),
                        noPetsText = $petChoose.find('[type=submit]').data('nopets'),
                        submitText = $petChoose.find('[type=submit]').data('submit');

                    $petChoose.find('[name=email]').val($emailForm.find('[name=email]').val());

                    Petcube.newsletter.send($form).done(function(e) {
                        $emailForm.hide();
                        $petChoose.removeClass('hidden');
                        $(window).trigger('modal.newsletterEmailSend');
                        $(window).trigger('modalShow');
                        $form.trigger("reset");
                        $petChoose.find('[type=checkbox]').on('change', function() {
                            if ($petChoose.find('[type=checkbox]:checked').length == 0) {
                                $petChoose.find('[type=submit]').text(noPetsText);
                            } else {
                                $petChoose.find('[type=submit]').text(submitText);
                            }
                        });

                        Petcube.newsletter.$newsletter.css({overflow: 'hidden'})
                            .delay(300).promise().done(function(el){
                            el.css({overflow: 'auto'});
                        });
                    });
                });

                this.$newsletter.find('.pet-choose form').on('submit', function(e) {
                    e.preventDefault();
                    var $form = $(this);

                    Petcube.newsletter.send($form).done(function(e) {
                        if ($form.find('input[name="petType[]"]:checked').length) {
                            $(window).trigger('modal.newsletterPetsSend');
                        }
                        $form.trigger("reset");
                        Petcube.newsletter.close();
                    });
                });
            },

            send: function($form) {
                var $button = $form.find('[type=submit]').prop('disabled', true);

                return $.ajax({
                    type: "POST",
                    url: $form.attr("action"),
                    data: $form.serialize(),
                    cache: false,
                    success: function(t) {
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
                    }, dataType: "json", timeout: 2e4});
            }
        }
    };
})(jQuery, window, document);