
define([
    'jquery',
    'mage/utils/wrapper'
], function ($, wrapper) {
    'use strict';

    if (typeof($.fn.magnify) == 'function') {
        $.fn.magnifyOriginal = $.fn.magnify;
        $.fn.magnify = function (options) {
            if (typeof(options.enabledDefault) == 'undefined') {
                options.enabledDefault = options.enabled;
            }
            if ($(this).find('.Image360').length) {
                options.enabled = 'false';
            } else {
                options.enabled = options.enabledDefault;
            }
            return $.fn.magnifyOriginal.apply(this, arguments);
        };
    }

    var mixin = {

        initialize: function (config, element) {
            this._super(config, element);
            this.image360ShowendHandler({'type': 'imagetoolbox:showend'}, this.settings.api.fotorama, {});
            $('body').on('fotorama:showend', '.fotorama-item', this.image360ShowendHandler);
        },

        openFullScreen: function () {
            var fotorama = this.settings.fotoramaApi;
            if (fotorama.activeFrame.image360) {
                return;
            }
            this._super();
        },

        /**
         * Handler for end of the show transition
         */
        image360ShowendHandler: function (e, fotorama, extra) {
            if (typeof(Image360) == 'undefined') {
                return;
            }

            if (typeof(fotorama.image360) == 'undefined') {
                fotorama.image360 = {
                    id: null
                };
            }

            if (fotorama.image360.id && fotorama.image360.id != fotorama.activeFrame.image360) {
                Image360.stop(fotorama.image360.id);
                fotorama.image360.id = null;
            }

            //NOTE: for case when gallery is updated with the same spin
            var started = fotorama.activeFrame.$stageFrame.hasClass('image360-stage-frame');

            if (fotorama.activeFrame.image360 && (fotorama.activeFrame.image360 != fotorama.image360.id || !started)) {
                Image360.start(fotorama.activeFrame.image360);
                fotorama.activeFrame.$stageFrame.addClass('image360-stage-frame');
                fotorama.image360.id = fotorama.activeFrame.image360;
            }
        },

        /**
         * Creates gallery's API.
         */
        initApi: function () {
            this._super();

            var settings = this.settings,
                fotorama = this.settings.fotoramaApi,
                api = this.settings.$element.data('gallery');

            /**
             * Set correct indexes for image set.
             *
             * @param {Array} images
             * @private
             */
            api.fixIndexes = function (images) {
                var length = images.length,
                    i;

                for (i = 0; length > i; i++) {
                    images[i].i = i + 1;
                }

                return images;
            };

            /**
             * Updates gallery with specific set of items.
             * @param {Array.<Object>} data - Set of gallery items to update.
             */
            api.updateDataOriginal = api.updateData;
            api.updateData = function (data) {
                if (_.isArray(data)) {
                    data = this.fixIndexes(data);
                }
                settings.$element.trigger('gallery:updateData:before', [data]);
                this.updateDataOriginal(data);
                settings.$element.trigger('gallery:updateData:after', [data]);
            };

            /**
             * Updates gallery data partially by index
             * @param {Number} index - Index of image in data array to be updated.
             * @param {Object} item - Standart gallery image object.
             *
             */
            api.updateDataByIndex = function (index, item) {
                if (item.image360) {
                    item.i = index + 1;
                    fotorama.splice(index, 1, $.extend({}, item));
                    return;
                }
                settings.fotoramaApi.spliceByIndex(index, item);
            }
        }
    };

    return function (target) {
        return target.extend(mixin);
    };
});
