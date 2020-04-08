<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/
namespace Codilar\Image360\Block\Product\View;

class ProductVideoGallery extends \Magento\ProductVideo\Block\Product\View\Gallery
{
    /**
     * @var bool
     */
    protected $isProductVideoModuleDisabled;

    /**
     * @var \Magento\Framework\Json\DecoderInterface
     */
    protected $jsonDecoder;

    /**
     * @param \Magento\Catalog\Block\Product\Context $context
     * @param \Magento\Framework\Stdlib\ArrayUtils $arrayUtils
     * @param \Magento\Framework\Json\EncoderInterface $jsonEncoder
     * @param \Magento\Framework\Json\DecoderInterface $jsonDecoder
     * @param \Magento\ProductVideo\Helper\Media $mediaHelper
     * @param \Magento\Framework\Module\Manager $moduleManager
     * @param array $data
     */
    public function __construct(
        \Magento\Catalog\Block\Product\Context $context,
        \Magento\Framework\Stdlib\ArrayUtils $arrayUtils,
        \Magento\Framework\Json\EncoderInterface $jsonEncoder,
        \Magento\Framework\Json\DecoderInterface $jsonDecoder,
        \Magento\ProductVideo\Helper\Media $mediaHelper,
        \Magento\Framework\Module\Manager $moduleManager,
        array $data = []
    ) {
        parent::__construct(
            $context,
            $arrayUtils,
            $jsonEncoder,
            $mediaHelper,
            $data
        );
        $this->isProductVideoModuleDisabled = !$moduleManager->isEnabled('Magento_ProductVideo');
        $this->jsonDecoder = $jsonDecoder;
    }

    /**
     * Retrieve media gallery data in JSON format
     *
     * @return string
     */
    public function getMediaGalleryDataJson()
    {
        $data = $this->_coreRegistry->registry('imagetoolbox');
        $standaloneMode = $data && isset($data['standalone-mode']) && $data['standalone-mode'];

        if (!$standaloneMode && $this->hasImage360Media()) {
            $mediaGalleryData = [];
            $mediaGalleryData[] = [
                'mediaType' => 'image360',
                'videoUrl' => null,
                'isBase' => true,
            ];
            foreach ($this->getProduct()->getMediaGalleryImages() as $mediaGalleryImage) {
                $mediaGalleryData[] = [
                    'mediaType' => $mediaGalleryImage->getMediaType(),
                    'videoUrl' => $mediaGalleryImage->getVideoUrl(),
                    'isBase' => false,
                ];
            }
            return $this->jsonEncoder->encode($mediaGalleryData);
        }

        return parent::getMediaGalleryDataJson();
    }

    /**
     * Retrieve video settings data in JSON format
     *
     * @return string
     */
    public function getVideoSettingsJson()
    {
        $videoSettingData = parent::getVideoSettingsJson();
        $videoSettingData = $this->jsonDecoder->decode($videoSettingData);
        $mtConfig = [
            'enabled' => false,
        ];

        $block = $this->getProductMediaBlock();
        if ($block) {
            $mtConfig = [
                'enabled' => $block->toolObj->params->checkValue('enable-effect', 'Yes', 'product'),
            ];
        }

        $videoSettingData[] = [
            'mtConfig' => $mtConfig
        ];

        return $this->jsonEncoder->encode($videoSettingData);
    }

    /**
     * Retrieve product media block
     *
     * @return mixed
     */
    public function getProductMediaBlock()
    {
        $data = $this->_coreRegistry->registry('imagetoolbox');
        if ($data && $data['blocks']['product.info.media.image360']) {
            return $data['blocks']['product.info.media.image360'];
        }
        return null;
    }

    /**
     * Checking for 360 media
     *
     * @return bool
     */
    public function hasImage360Media()
    {
        static $result = null;
        if ($result === null) {
            $result = false;
            $block = $this->getProductMediaBlock();
            if ($block) {
                $images = $block->getGalleryImagesCollection();
                if ($images->count()) {
                    $result = true;
                }
            }
        }
        return $result;
    }

    /**
     * Render block HTML
     *
     * @return string
     */
    protected function _toHtml()
    {
        if ($this->isProductVideoModuleDisabled) {
            return '';
        }
        return parent::_toHtml();
    }

    /**
     * Processing block html after rendering
     *
     * @param   string $html
     * @return  string
     */
    protected function _afterToHtml($html)
    {
        if ($this->isProductVideoModuleDisabled) {
            return '';
        }
        return parent::_afterToHtml($html);
    }
}
