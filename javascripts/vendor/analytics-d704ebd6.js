(function($, window, document) {
    window.isGaLoaded = function () {
        return typeof (window.ga) !== "undefined";
    };

    window.isSegmentLoaded = function () {
        return typeof (window.analytics) !== "undefined";
    };

    window.ev = function (category, action, label, value, callback) {
        console.info('DEBUG ANALYTICS EVENT:', category, '|' , action, '|', label, '|', value);
        console.info('isGaLoaded', isGaLoaded());
        console.info('isSegmentLoaded', isSegmentLoaded());

        var gaSent = true, segmentSent = true;

        if (isGaLoaded()) { // Google Analytics
            gaSent = false;

            ga('send', 'event', {
                eventCategory: category,
                eventAction: action,
                eventLabel: label,
                eventValue: value,
                hitCallback: function () {
                    gaSent = true;
                }
            });
        }

        if (isSegmentLoaded()) { // Segment
            segmentSent = false;

            analytics.track(action, {
                    category: category,
                    label: label,
                    value: value
                }, {},
                function () {
                    segmentSent = true;
                }
            );
        }

        if (typeof (callback) === 'function') {
            var loop = setInterval(function() {
                if (gaSent && segmentSent) {
                    clearInterval(loop);
                    callback();
                }
            }, 100);
        }
    };

    window.segment = (function() {
        function _identify() {
            if (isSegmentLoaded() && window.app && app.user) {
                analytics.identify(app.user.id, {
                    name: app.user.name,
                    username: app.user.username,
                    email: app.user.email
                });

                console.info('DEBUG User identify', app.user.id, app.user.name, app.user.username, app.user.email);
            }
        }

        function _track(event, properties, options, callback) {
            if (isSegmentLoaded()) {
                analytics.track(event, properties, options, callback);
            }
        }

        return {
            identify: _identify,
            track: _track
        }
    })();

    window.segment.identify();

    $('[data-ev-category][data-ev-action]').one('click', function (e) {
        e.preventDefault();

        var $el = $(this),
            c = $el.data('ev-category'),
            a = $el.data('ev-action'),
            l = $el.data('ev-label'),
            v = $el.data('ev-value')
        ;

        ev(c, a, l, v, function() {
            if ($el.attr('type') === 'submit') {
                $el.parents('form').submit()
            }

            e.target.click();
        });
    });

})(jQuery, window, document);
