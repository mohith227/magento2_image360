<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/
namespace Codilar\Image360\Helper;

use Magento\Catalog\Model\Product;

/**
 * Class ConfigurableData
 * Helper class for getting options
 *
 */
class ConfigurableData extends \Magento\ConfigurableProduct\Helper\Data
{
    /**
     * Helper
     *
     * @var \Codilar\Image360\Helper\Data
     */
    public $imageToolboxHelper = null;

    /**
     * Core registry
     *
     * @var \Magento\Framework\Registry
     */
    protected $coreRegistry = null;

    /**
     * Enable effect
     *
     * @var bool
     */
    protected $isEffectEnable = false;

    /**
     * Use original gallery
     *
     * @var bool
     */
    protected $useOriginalGallery = true;

    /**
     * Gallery data
     *
     * @var array
     */
    protected $galleryData = [];

    /**
     * Image 360 icon url
     *
     * @var string
     */
    protected $spinIconUrl = '';

    /**
     * Original gallery data
     *
     * @var array
     */
    protected $originalGalleryData;

    /**
     * @param \Magento\Catalog\Helper\Image $imageHelper
     * @param \Codilar\Image360\Helper\Data $imageToolboxHelper
     * @param \Magento\Framework\Registry $registry
     */
    public function __construct(
        \Magento\Catalog\Helper\Image $imageHelper,
        \Codilar\Image360\Helper\Data $imageToolboxHelper,
        \Magento\Framework\Registry $registry
    ) {
        parent::__construct($imageHelper);
        $this->imageToolboxHelper = $imageToolboxHelper;
        $this->coreRegistry = $registry;
        $this->spinIconUrl = $this->imageHelper->getDefaultPlaceholderUrl('thumbnail');
    }

    /**
     * Retrieve collection of gallery images
     *
     * @param \Magento\Catalog\Api\Data\ProductInterface $product
     * @return \Magento\Framework\Data\Collection|null
     */
    public function getGalleryImages(\Magento\Catalog\Api\Data\ProductInterface $product)
    {
        return ($this->isEffectEnable && !$this->useOriginalGallery) ? null : parent::getGalleryImages($product);
    }

    /**
     * Get Options for Configurable Product Options
     *
     * @param \Magento\Catalog\Model\Product $currentProduct
     * @param array $allowedProducts
     * @return array
     */
    public function getOptions($currentProduct, $allowedProducts)
    {
        $isEnabled = false;
        /**
         * Display Image360 spin as a separate block
         *
         * @var $standaloneMode bool
         */
        $standaloneMode = false;

        $data = $this->coreRegistry->registry('imagetoolbox');
        if ($data && $data['current'] != 'product.info.media.image') {

            foreach ($data['blocks'] as $key => $block) {
                if (!in_array($key, ['product.info.media.image', 'product.info.media.image360']) && $block) {
                    $this->useOriginalGallery = false;
                    break;
                }
            }

            $galleryBlock = $data['blocks'][$data['current']];
            $toolObj = $galleryBlock->imageToolboxHelper->getToolObj();
            $isEnabled = !$toolObj->params->checkValue('enable-effect', 'No', 'product');
            if ($isEnabled) {
                $standaloneMode = isset($data['standalone-mode']) && $data['standalone-mode'];
                if ($this->useOriginalGallery) {
                    if ($standaloneMode) {
                        $productId = $currentProduct->getId();
                        $this->galleryData[$productId] = $galleryBlock->getSpinHtml($currentProduct);
                    }
                } else {
                    $productId = $currentProduct->getId();
                    $this->galleryData[$productId] = $galleryBlock->renderGalleryHtml($currentProduct)->getRenderedHtml($productId);
                }
                $allProducts = $currentProduct->getTypeInstance()->getUsedProducts($currentProduct, null);
                foreach ($allProducts as $product) {
                    $productId = $product->getId();
                    $this->galleryData[$productId] = $galleryBlock->renderGalleryHtml($product, true)->getRenderedHtml($productId);
                }
                $this->isEffectEnable = true;
            }
        }

        $data = $this->coreRegistry->registry('imagetoolbox_category');
        if ($data && $data['current-renderer'] == 'configurable.image360') {
            $this->useOriginalGallery = false;
            $productId = $currentProduct->getId();

            /** @var \Codilar\ImageZoomPlus\Block\Product\Renderer\Listing\Configurable $renderer */
            $renderer = $data['renderers'][$data['current-renderer']];
            /** @var \Magento\Framework\View\Layout $layout */
            $layout = $renderer->getLayout();
            /** @var \Magento\Catalog\Block\Product\ListProduct $listProductBlock */
            $listProductBlock = $layout->getBlock('category.products.list');
            if (!$listProductBlock) {
                /** @var \Magento\CatalogSearch\Block\SearchResult\ListProduct $listProductBlock */
                $listProductBlock = $layout->getBlock('search_result_list');
            }
            //NOTE: set product list block with toolbar
            $this->imageToolboxHelper->setListProductBlock($listProductBlock);

            $this->galleryData[$productId] = $this->imageToolboxHelper->getHtmlData($currentProduct, false, ['small_image']);

            $allProducts = $currentProduct->getTypeInstance()->getUsedProducts($currentProduct, null);
            foreach ($allProducts as $product) {
                $productId = $product->getId();
                $this->galleryData[$productId] = $this->imageToolboxHelper->getHtmlData($product, true, ['image', 'small_image', 'thumbnail']);
            }
            $this->isEffectEnable = true;
        }

        $options = parent::getOptions($currentProduct, $allowedProducts);

        if ($isEnabled && $this->useOriginalGallery) {

            if ($standaloneMode) {
                $options['images'] = $this->getProductImagesData($allowedProducts);
                return $options;
            }

            $spinIconPath = $galleryBlock->getImage360IconPath();
            if ($spinIconPath) {
                $this->spinIconUrl = $galleryBlock->image360ImageHelper
                    ->init(null, 'product_page_image_small', ['width' => null, 'height' => null])
                    ->setImageFile($spinIconPath)
                    ->getUrl();
            }

            $productImages = $this->getProductImagesData($allowedProducts);

            $options['images'] = $this->updateImagesData($productImages);
        }

        return $options;
    }

    /**
     * Get images data for configurable product options
     *
     * @param array $allowedProducts
     * @return array
     */
    public function getProductImagesData($allowedProducts)
    {
        $images = [];
        foreach ($allowedProducts as $product) {
            $productId = $product->getId();
            $productImages = $this->getGalleryImages($product) ?: [];
            $productMainImage = $product->getImage();
            $productName = $product->getName();
            foreach ($productImages as $image) {
                $images[$productId][] = [
                    'thumb' => $image->getData('small_image_url'),
                    'img' => $image->getData('medium_image_url'),
                    'full' => $image->getData('large_image_url'),
                    'caption' => ($image->getLabel() ?: $productName),
                    'position' => $image->getPosition(),
                    'isMain' => $image->getFile() == $productMainImage,
                    'type' => str_replace('external-', '', $image->getMediaType()),
                    'videoUrl' => $image->getVideoUrl(),
                ];
            }
        }
        return $images;
    }

    /**
     * Update images data with spin data
     *
     * @param array $data
     * @return array
     */
    public function updateImagesData($data = [])
    {
        if (!isset($this->originalGalleryData)) {
            foreach ($data as $productId => &$images) {
                //NOTE: if we have 360 data for this product
                if (!empty($this->galleryData[$productId])) {
                    //NOTE: reposition images data
                    foreach ($images as &$image) {
                        $image['position'] = (int)$image['position'] + 1;
                        $image['isMain'] = false;
                    }
                    //NOTE: add 360 data
                    array_unshift($images, [
                        'image360' => 'Image360-product-'.$productId,
                        'thumb' => $this->spinIconUrl,
                        'html' => '<div class="fotorama__select">'.$this->galleryData[$productId].'</div>',
                        'caption' => '',
                        'position' => 0,
                        'isMain' => true,
                        'fit' => 'none',
                        'type' => 'image360',
                        'videoUrl' => null
                    ]);
                }
                //NOTE: clear unnecessary 360 data (to leave only 360 data for products that does not have images)
                if (isset($this->galleryData[$productId])) {
                    unset($this->galleryData[$productId]);
                }
            }

            //NOTE: product that has no images but has 360 images
            foreach ($this->galleryData as $productId => $html) {
                if (!empty($html)) {
                    $data[$productId] = [];
                    $data[$productId][] = [
                        'image360' => 'Image360-product-'.$productId,
                        'thumb' => $this->spinIconUrl,
                        'html' => '<div class="fotorama__select">'.$this->galleryData[$productId].'</div>',
                        'caption' => '',
                        'position' => 0,
                        'isMain' => true,
                        'fit' => 'none',
                        'type' => 'image360',
                        'videoUrl' => null
                    ];
                }
            }
            //NOTE: clear 360 data (they are no longer needed)
            $this->galleryData = [];

            $this->originalGalleryData = $data;
        }
        return $this->originalGalleryData;
    }

    /**
     * Get original gallery data
     *
     * @return array
     */
    public function getOriginalGalleryData()
    {
        return $this->originalGalleryData;
    }

    /**
     * Get gallery data
     *
     * @return array
     */
    public function getGalleryData()
    {
        return $this->galleryData;
    }

    /**
     * Use original gallery flag
     *
     * @return bool
     */
    public function useOriginalGallery()
    {
        return $this->useOriginalGallery;
    }

    /**
     * Get registry
     *
     * @return \Magento\Framework\Registry
     */
    public function getRegistry()
    {
        return $this->coreRegistry;
    }
}
