<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/
namespace Codilar\Image360\Plugin\Product\View;

/**
 * Plugin for \Magento\Catalog\Block\Product\View\Gallery
 */
class Gallery
{
    /**
     * Disable flag
     * @var bool
     */
    protected $isDisabled = true;

    /**
     * @var \Magento\Catalog\Helper\Image
     */
    protected $imageHelper;

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
     * @param \Magento\Catalog\Helper\Image $imageHelper
     * @param \Magento\Framework\Json\EncoderInterface $jsonEncoder
     * @param \Magento\Framework\Json\DecoderInterface $jsonDecoder
     */
    public function __construct(
        \Codilar\Image360\Helper\Data $imageToolboxHelper,
        \Magento\Catalog\Helper\Image $imageHelper,
        \Magento\Framework\Json\EncoderInterface $jsonEncoder,
        \Magento\Framework\Json\DecoderInterface $jsonDecoder
    ) {
        $toolObj = $imageToolboxHelper->getToolObj();
        $this->isDisabled = !$toolObj->params->checkValue('enable-effect', 'Yes', 'product');
        $this->imageHelper = $imageToolboxHelper->getImageHelper();
        $this->jsonEncoder = $jsonEncoder;
        $this->jsonDecoder = $jsonDecoder;
    }

    /**
     * Retrieve product images in JSON format
     *
     * @param \Magento\Catalog\Block\Product\View\Gallery $subject
     * @param \Closure $proceed
     * @return string
     *
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function aroundGetGalleryImagesJson(\Magento\Catalog\Block\Product\View\Gallery $subject, \Closure $proceed)
    {
        if (get_parent_class($subject) != 'Magento\Catalog\Block\Product\View\Gallery') {
            return $proceed();
        }

        if ($this->isDisabled) {
            return $proceed();
        }

        $product = $subject->getProduct();
        $productMainImage = $product->getImage();
        $productName = $product->getName();

        $mediaItems = [];
        foreach ($subject->getGalleryImages() as $image) {
            $mediaItems[] = [
                'thumb' => $image->getData('small_image_url'),
                'img' => $image->getData('medium_image_url'),
                'full' => $image->getData('large_image_url'),
                'caption' => ($image->getLabel() ?: $productName),
                'position' => $image->getPosition(),
                'isMain' => ($image->getFile() == $productMainImage),
                'type' => str_replace('external-', '', $image->getMediaType()),
                'videoUrl' => $image->getVideoUrl(),
            ];
        }
        if (empty($mediaItems)) {
            $mediaItems[] = [
                'thumb' => $this->imageHelper->getDefaultPlaceholderUrl('thumbnail'),
                'img' => $this->imageHelper->getDefaultPlaceholderUrl('image'),
                'full' => $this->imageHelper->getDefaultPlaceholderUrl('image'),
                'caption' => '',
                'position' => '0',
                'isMain' => true,
                'type' => 'image',
                'videoUrl' => null,
            ];
        }
        return $this->jsonEncoder->encode($mediaItems);
    }
}
