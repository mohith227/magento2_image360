
define([
    'jquery'
], function ($) {
    'use strict';

    var mixin = {

        options: {
            mtConfig: {
                enabled: false
            }
        },

        /**
         * Creates widget
         *
         * @private
         */
        _create: function () {
            var videoSettings = [];
            if (typeof(this.options.VideoSettings) == 'object') {
                //NOTE: before Magento v2.1.0
                videoSettings = this.options.VideoSettings;
            } else if (typeof(this.options.videoSettings) == 'object') {
                //NOTE: since Magento v2.1.0
                videoSettings = this.options.videoSettings;
            }

            for (var i = 0; videoSettings.length > i; i++) {
                if (typeof(videoSettings[i]['mtConfig']) != 'undefined') {
                    $.extend(true, this.options.mtConfig, videoSettings[i]['mtConfig']);
                    break;
                }
            }

            this._super();
        },

        /**
         * Init widget
         *
         * @private
         */
        _init: function () {
            if (this.options.mtConfig.enabled && typeof(this.options.videoData) == 'undefined') {
                this.fotoramaItem = this.element;
                this.options.videoData = this.options.VideoData;
                this.options.VideoData = undefined;
                this._updateVideoData();
                this.options.VideoData = this.options.videoData;
                this.options.videoData = undefined;
                for (var i = 0; i < this.options.VideoData.length; i++) {
                    this.options.VideoData[i].isBase = false;
                }
            }

            this._super();
        },

        /**
         * Clear events to prevent duplicated calls.
         *
         * @private
         */
        _clearFotoramaEvents: function () {
            this.fotoramaItem.off(
                'fotorama:show fotorama:showend fotorama:fullscreenenter fotorama:fullscreenexit'
            );
        },

        /**
         * Set video data for configurable product.
         *
         * @param {Object} options
         * @private
         */
        _loadVideoData: function (options) {
            if (!this.options.mtConfig.enabled || typeof(options) == 'undefined') {
                this._super(options);
                return;
            }

            if (options.selectedOption) {
                if (options.dataMergeStrategy === 'prepend') {
                    this.options.videoData = [].concat(
                        this.options.optionsVideoData[options.selectedOption],
                        this.defaultVideoData
                    );
                } else {
                    this.options.videoData = this.options.optionsVideoData[options.selectedOption];
                }
            } else {
                this.options.videoData = this.defaultVideoData;
            }
        },

        /**
         * Update video data if need it.
         *
         * @private
         */
        _updateVideoData: function () {
            var fotorama = this.fotoramaItem.data('fotorama'),
                data = fotorama.data,
                videoData = this.options.videoData,
                isChanged = false,
                newVideoData = [];

            if (videoData.length != data.length) {
                isChanged = true;
            } else {
                for (var i = 0; i < data.length; i++) {
                    if (videoData[i]['mediaType'] != data[i]['type']) {
                        isChanged = true;
                        break;
                    }
                    if (videoData[i]['mediaType'] == 'video') {
                        if (videoData[i]['videoUrl'] != data[i]['videoUrl']) {
                            isChanged = true;
                            break;
                        }
                    }
                }
            }

            if (isChanged) {
                for (var i = 0; i < data.length; i++) {
                    newVideoData.push({
                        'isBase': data[i]['isMain'],
                        'mediaType': data[i]['type'],
                        'videoUrl': data[i]['videoUrl']
                    });
                }
                this.options.videoData = newVideoData;

                this._checkForVideoExist();
            }
        },

        /**
         * Check for video
         *
         * @param {Event} e
         * @param {jQuery} fotorama
         * @param {Number} number
         * @private
         */
        _checkForVideo: function (e, fotorama, number) {
            if (!this.options.mtConfig.enabled || typeof(this.options.videoData) == 'undefined') {
                this._super(e, fotorama, number);
                return;
            }

            var $image = fotorama.data[number - 1];

            if ($image) {
                !$image.type && this._setItemType($image, number - 1);

                if ($image.type === 'image360') {
                    $image.$navThumbFrame && $image.$navThumbFrame.removeClass(this.TI);
                    this._hideCloseVideo();
                    return;
                }
            }

            this._super(e, fotorama, number);
        },

        /**
         * Attach fotorama events
         *
         * @private
         */
        _attachFotoramaEvents: function () {
            this._super();

            //NOTE: if Magento v2.1.10 or newer
            if (typeof(this.defaultVideoData) != 'undefined') {
                return;
            }

            var el = $(this.element);

            //NOTE: clear old handlers
            el.off('gallery:updateData:before');
            el.off('gallery:updateData:after');

            //NOTE: attach new handlers
            el.on('gallery:updateData:before',  $.proxy(function (e, data) {
                this._clearFotoramaEvents();
            }, this));
            el.on('gallery:updateData:after',  $.proxy(function (e, data) {
                this._updateVideoData();
                this._initialize();
            }, this));
        }
    };

    return function (target) {
        var isWrapper = (typeof(target.prototype.options) == 'undefined'),
            $widget;

        $widget = (isWrapper ? $.mage.AddFotoramaVideoEvents : target);

        /* NOTE: to skip multiple mixins */
        if (typeof($widget.prototype.options.mtConfig) != 'undefined') {
            return target;
        }

        $.widget('mage.AddFotoramaVideoEvents', $widget, mixin);

        return (isWrapper ? target : $.mage.AddFotoramaVideoEvents);
    };
});
