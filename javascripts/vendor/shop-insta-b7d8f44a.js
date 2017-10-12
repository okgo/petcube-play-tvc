(function($, window, document) {
    var $instaTimeline = $('.insta-timeline'),
        $popup = $('#insta-popup');

    $(document).on('click', '.insta-card', function (e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('click');

        var $this = $(this), productPhoto = new Image();

        $popup.find('.product-container .product-image').css('opacity', 0);

        productPhoto.src = $this.data('product-photo');
        productPhoto.onload = function () {
            $popup.find('.product-container .product-image').prop('src', $this.data('product-photo')).css('opacity', 1);
        };

        $popup.find(' .insta-image').prop('src', $this.data('photo'));
        $popup.find('.product-container .product-name').html($this.data('product-name'));
        $popup.find('.product-container .product-price').html($this.data('product-price'));
        $popup.find('.product-container a').prop('href', $this.data('store-page'));
        $popup.find('.insta-author a').prop('href', $this.data('url'));
        $popup.find('.insta-author .username').html($this.data('username'));
        $popup.find('.insta-message').html($this.data('text'));
        $popup.find('.buy-now').data('product', $this.data('product-name') + '(' + $this.data('color-name') + ')' );

        disableScroll();

        $popup.fadeIn('fast', function () {
            $popup.animate({scrollTop:0}, 300);
            $(window).trigger('modalShow');
        }).find('.close').on('click', function (e) {
            e.preventDefault();
            $popup.fadeOut(function () {
                $popup.find('.close').off('click');
                enableScroll();
            });
        });

        // ev( 'insta shop', 'popup opened', $this.data('url'));
    });


    $popup.find('.buy-now').on('click', function () {
        // ev( 'insta shop', 'buy now clicked', $(this).data('product'));
    })

})(jQuery, window, document);
