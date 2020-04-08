
define([
    'jquery',
    'Codilar_Image360/js/swatch-renderer-mixin'
], function ($, mixin) {
    'use strict';

    return function (swatchRenderer) {

        if (typeof(swatchRenderer) == 'undefined') {
            swatchRenderer = $.custom.SwatchRenderer;
        }

        if (typeof(swatchRenderer.prototype.options.mtConfig) != 'undefined') {
            return swatchRenderer;
        }
        $.widget('mage.SwatchRenderer', swatchRenderer, mixin);
        return $.mage.SwatchRenderer;
    };
});
