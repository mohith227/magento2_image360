/*jshint browser:true jquery:true*/

define([
    'jquery',
    'mage/template',
    'Magento_ConfigurableProduct/js/configurable'
], function ($, mageTemplate) {
    'use strict';

    $.widget('imagetoolbox.configurable', $.mage.configurable, {

        options: {
            mtConfig: {
                enabled: false,
                useOriginalGallery: true,
                currentProductId: null,
                galleryData: [],
                tools: {},
                thumbSwitcherOptions: {},
                mtContainerSelector: 'div.CodilarContainer'
            }
        },

        /**
         * Initialize tax configuration, initial settings, and options values.
         * @private
         */
        _initializeOptions: function () {

            this._super();

            if (typeof(this.options.spConfig.imagetoolbox) == 'undefined' || typeof(this.options.spConfig.productId) == 'undefined') {
                return;
            }

            this.options.mtConfig.enabled = true;
            this.options.mtConfig.currentProductId = this.options.spConfig.productId;
            this.options.mtConfig.useOriginalGallery = this.options.spConfig.imagetoolbox.useOriginalGallery;
            this.options.mtConfig.galleryData = this.options.spConfig.imagetoolbox.galleryData;
            this.options.mtConfig.tools = {
                'Image360': {
                    'idTemplate': '{tool}-product-{id}',
                    'objName': 'Image360',
                    'undefined': true
                },
                'ImageSlideshow': {
                    'idTemplate': '{tool}-product-{id}',
                    'objName': 'ImageSlideshow',
                    'undefined': true
                },
                'ImageScroll': {
                    'idTemplate': '{tool}-product-{id}',
                    'objName': 'ImageScroll',
                    'undefined': true
                },
                'ImageZoomPlus': {
                    'idTemplate': '{tool}Image-product-{id}',
                    'objName': 'ImageZoom',
                    'undefined': true
                },
                'ImageZoom': {
                    'idTemplate': '{tool}Image-product-{id}',
                    'objName': 'ImageZoom',
                    'undefined': true
                },
                'ImageThumb': {
                    'idTemplate': '{tool}Image-product-{id}',
                    'objName': 'ImageThumb',
                    'undefined': true
                }
            };
            for (var tool in this.options.mtConfig.tools) {
                this.options.mtConfig.tools[tool].undefined = (typeof(window[tool]) == 'undefined');
            }
            if (!this.options.mtConfig.tools['ImageZoom'].undefined) {
                var suffix = ImageZoom.version.indexOf('Plus') > -1 ? 'Plus' : '';
                this.options.mtConfig.tools['ImageZoom'].undefined = true;
                this.options.mtConfig.tools['ImageZoomPlus'].undefined = true;
                this.options.mtConfig.tools['ImageZoom' + suffix].undefined = false;
            }

            //NOTE: get thumb switcher options
            var container = $(this.options.mtConfig.mtContainerSelector);
            if (container.length && container.imageToolboxThumbSwitcher) {
                this.options.mtConfig.thumbSwitcherOptions = container.imageToolboxThumbSwitcher('getOptions');
            }
        },

        /**
         * Change displayed product image according to chosen options of configurable product
         * @private
         */
        _changeProductImage: function () {
            if (!this.options.mtConfig.enabled || this.options.mtConfig.useOriginalGallery) {
                this._super();
                return;
            }

            var spConfig = this.options.spConfig,
                productId = spConfig.productId,
                galleryData = [],
                tools = {};

            if (typeof(this.simpleProduct) != 'undefined') {
                productId = this.simpleProduct;
            }

            galleryData = this.options.mtConfig.galleryData;

            //NOTE: associated product has no images
            if (!galleryData[productId].length) {
                productId = spConfig.productId;
            }

            //NOTE: there is no need to change gallery
            if (this.options.mtConfig.currentProductId == productId) {
                return;
            }

            tools = this.options.mtConfig.tools;

            //NOTE: stop tools
            for (var tool in tools) {
                if (tools[tool].undefined) {
                    continue;
                }
                var id = tools[tool].idTemplate.replace('{tool}', tool).replace('{id}', this.options.mtConfig.currentProductId);
                if (document.getElementById(id)) {
                    window[tools[tool].objName].stop(id);
                }
            }

            //NOTE: stop MagiScroll on selectors
            var id = 'CodilarSelectors'+this.options.mtConfig.currentProductId,
                selectorsEl = document.getElementById(id);
            if (!tools['ImageScroll'].undefined && selectorsEl && selectorsEl.className.match(/(?:\s|^)ImageScroll(?:\s|$)/)) {
                ImageScroll.stop(id);
            }

            //NOTE: replace gallery
            if (this.options.gallerySwitchStrategy === 'prepend' && productId != spConfig.productId) {
                var tool = null,
                    galleryDataNode = document.createElement('div'),
                    toolMainNode = null,
                    toolLinkAttrName = null,
                    mpGalleryDataNode = document.createElement('div'),
                    mpSelectors = null,
                    mpSpinSelector = null,
                    mpSlides = null;

                //NOTE: selected product gallery
                galleryDataNode = $(galleryDataNode).html(galleryData[productId]);

                //NOTE: main product gallery
                mpGalleryDataNode = $(mpGalleryDataNode).html(galleryData[spConfig.productId]);

                //NOTE: determine main tool
                if (galleryData[productId].indexOf('ImageZoomPlus') > -1 || galleryData[spConfig.productId].indexOf('ImageZoomPlus') > -1) {
                    tool = 'ImageZoomPlus';
                    toolMainNode = galleryDataNode.find('a.ImageZoom');
                    toolLinkAttrName = 'data-zoom-id';
                } else if (galleryData[productId].indexOf('ImageZoom') > -1 || galleryData[spConfig.productId].indexOf('ImageZoom') > -1) {
                    tool = 'ImageZoom';
                    toolMainNode = galleryDataNode.find('a.ImageZoom');
                    toolLinkAttrName = 'data-zoom-id';
                } else if (galleryData[productId].indexOf('ImageThumb') > -1 || galleryData[spConfig.productId].indexOf('ImageThumb') > -1) {
                    tool = 'ImageThumb';
                    toolMainNode = galleryDataNode.find('a.ImageThumb');
                    toolLinkAttrName = 'data-thumb-id';
                } else if (galleryData[productId].indexOf('ImageSlideshow') > -1 || galleryData[spConfig.productId].indexOf('ImageSlideshow') > -1) {
                    tool = 'ImageSlideshow';
                    //NOTE: main product slides
                    mpSlides = mpGalleryDataNode.find('.ImageSlideshow').children();
                } else if (galleryData[productId].indexOf('ImageScroll') > -1 || galleryData[spConfig.productId].indexOf('ImageScroll') > -1) {
                    tool = 'ImageScroll';
                    //NOTE: main product slides
                    mpSlides = mpGalleryDataNode.find('.ImageScroll').children();
                }

                mpSelectors = mpGalleryDataNode.find('#CodilarSelectors' + spConfig.productId + ' a');

                if (mpSelectors.length) {
                    var newId = tools[tool].idTemplate.replace('{tool}', tool).replace('{id}', productId);

                    //NOTE: when there are no images in the gallery (only video or spin)
                    if (!toolMainNode.length) {
                        galleryDataNode.find('#mtImageContainer').html(mpGalleryDataNode.find('#mtImageContainer').html());
                        toolMainNode = galleryDataNode.find('a.' + tools[tool].objName);
                        toolMainNode.attr('id', newId);
                    }

                    mpSelectors.filter('[' + toolLinkAttrName + ']').attr(toolLinkAttrName, newId);

                    mpSelectors.removeClass('active-selector');

                    var mpSpinSelector = mpSelectors.filter('.m360-selector'),
                        spinSelector = null;
                    //NOTE: if we have main product spin
                    if (mpSpinSelector.length) {
                        //NOTE: don't add it with others
                        mpSelectors = mpSelectors.filter(':not(.m360-selector)');

                        spinSelector = galleryDataNode.find('#CodilarSelectors' + productId + ' a.m360-selector');
                        //NOTE: if we don't have selected product spin
                        if (!spinSelector.length) {
                            //NOTE: append spin selector
                            galleryDataNode.find('#CodilarSelectors' + productId).prepend(mpSpinSelector);
                            //NOTE: append spin
                            var spinContainer = mpGalleryDataNode.find('#mt360Container').css('display', 'none'),
                                spin = spinContainer.find('.Image360'),
                                spinId = spin.attr('id');

                            spinId = spinId.replace(/\-\d+$/, '-'+productId);
                            //NOTE: fix spin id
                            spin.attr('id', spinId);

                            //NOTE: add spin
                            galleryDataNode.find('#mt360Container').replaceWith(spinContainer);
                        }
                    }

                    galleryDataNode.find('.CodilarSelectorsContainer').removeClass('hidden-container');
                    galleryDataNode.find('#CodilarSelectors' + productId).append(mpSelectors);
                }

                if (mpSlides && mpSlides.length) {
                    galleryDataNode.find('.' + tool).append(mpSlides);
                }

                $(this.options.mtConfig.mtContainerSelector).replaceWith(galleryDataNode.html());
            } else {
                $(this.options.mtConfig.mtContainerSelector).replaceWith(galleryData[productId]);
            }

            //NOTE: start MagiScroll on selectors
            id = 'CodilarSelectors'+productId;
            selectorsEl = document.getElementById(id);
            if (!tools['ImageScroll'].undefined && selectorsEl && selectorsEl.className.match(/(?:\s|^)ImageScroll(?:\s|$)/)) {
                ImageScroll.start(id);
            }

            //NOTE: initialize thumb switcher widget
            var container = $(this.options.mtConfig.mtContainerSelector);
            if (container.length) {
                this.options.mtConfig.thumbSwitcherOptions.productId = productId;
                if (container.imageToolboxThumbSwitcher) {
                    container.imageToolboxThumbSwitcher(this.options.mtConfig.thumbSwitcherOptions);
                } else {
                    //NOTE: require thumb switcher widget
                    /*
                    require(["imageToolboxThumbSwitcher"], function ($) {
                        container.imageToolboxThumbSwitcher(this.options.mtConfig.thumbSwitcherOptions);
                    });
                    */
                }
            }

            //NOTE: update current product id
            this.options.mtConfig.currentProductId = productId;

            //NOTE: start tools
            for (var tool in tools) {
                if (tools[tool].undefined) {
                    continue;
                }
                var id = tools[tool].idTemplate.replace('{tool}', tool).replace('{id}', this.options.mtConfig.currentProductId);
                if (document.getElementById(id)) {
                    window[tools[tool].objName].start(id);
                }
            }
        }
    });

    return $.imagetoolbox.configurable;
});
