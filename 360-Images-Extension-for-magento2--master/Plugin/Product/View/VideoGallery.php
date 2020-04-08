<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/
namespace Codilar\Image360\Plugin\Product\View;

/**
 * Plugin for \Magento\ProductVideo\Block\Product\View\Gallery
 */
class VideoGallery
{
    /**
     * Helper
     *
     * @var \Codilar\Image360\Helper\Data
     */
    protected $imageToolboxHelper = null;

    /**
     * Disable flag
     * @var bool
     */
    protected $isDisabled = true;

    /**
     * Display Image360 spin as a separate block or inside fotorama gallery
     *
     * @var bool
     */
    protected $standaloneMode = false;

    /**
     * @var \Magento\Framework\Json\EncoderInterface
     */
    protected $jsonEncoder;

    /**
     * @var \Magento\Framework\Json\DecoderInterface
     */
    protected $jsonDecoder;

    /**
     * @param \Codilar\Image360\Helper\Data $imageToolboxHelper
     * @param \Magento\Framework\Json\EncoderInterface $jsonEncoder
     * @param \Magento\Framework\Json\DecoderInterface $jsonDecoder
     */
    public function __construct(
        \Codilar\Image360\Helper\Data $imageToolboxHelper,
        \Magento\Framework\Json\EncoderInterface $jsonEncoder,
        \Magento\Framework\Json\DecoderInterface $jsonDecoder
    ) {
        $this->imageToolboxHelper = $imageToolboxHelper;
        $toolObj = $imageToolboxHelper->getToolObj();
        $this->isDisabled = !$toolObj->params->checkValue('enable-effect', 'Yes', 'product');
        $this->standaloneMode = $toolObj->params->checkValue('display-spin', 'separately', 'product');
        $this->jsonEncoder = $jsonEncoder;
        $this->jsonDecoder = $jsonDecoder;
    }

    /**
     * Retrieve media gallery data for product options in JSON format
     *
     * @param \Magento\Catalog\Block\Product\View\Gallery $subject
     * @param string $result
     * @return string
     * @since 100.1.0
     */
    public function afterGetOptionsMediaGalleryDataJson(\Magento\Catalog\Block\Product\View\Gallery $subject, $result)
    {
        if ($this->isDisabled || $this->standaloneMode) {
            return $result;
        }

        $result = $this->jsonDecoder->decode($result);
        foreach ($result as $productId => &$mediaData) {
            if ($this->imageToolboxHelper->hasImage360Media($productId)) {
                foreach ($mediaData as &$mediaItemData) {
                    $mediaItemData['isBase'] = false;
                }
                array_unshift($mediaData, [
                    'mediaType' => 'image360',
                    'videoUrl' => null,
                    'isBase' => true,
                ]);
            }
        }

        return $this->jsonEncoder->encode($result);
    }
}
