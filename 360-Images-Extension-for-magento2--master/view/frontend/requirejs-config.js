
var config = {
    config: {
        mixins: {
            'mage/gallery/gallery': {
                'Codilar_Image360/js/gallery': true
            },
            'Magento_ProductVideo/js/fotorama-add-video-events': {
                'Codilar_Image360/js/fotorama-add-video-events': true
            },
            'Magento_Swatches/js/swatch-renderer': {
                'Codilar_Image360/js/swatch-renderer': true
            },
            'Magento_Swatches/js/SwatchRenderer': {
                'Codilar_Image360/js/swatch-renderer': true
            }
        }
    },
    map: {
        '*': {
            configurable:              'Codilar_Image360/js/configurable'
        }
    }
};
