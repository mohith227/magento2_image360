<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/
namespace Codilar\Image360\Controller\Ajax;

/**
 * Ajax media controller
 *
 */
class Media extends \Magento\Swatches\Controller\Ajax\Media
{

    /**
     * Get product media
     *
     * @return string
     */
    public function execute()
    {
        $result = [];

        if ($productId = (int)$this->getRequest()->getParam('product_id')) {
            $currentProduct = $this->productModelFactory->create()->load($productId);
            $isConfigurable = ($currentProduct->getTypeId() == \Magento\ConfigurableProduct\Model\Product\Type\Configurable::TYPE_CODE);
            $attributes = (array)$this->getRequest()->getParam('attributes');

            if ($isConfigurable && method_exists($this, 'getProductVariationWithMedia')) {
                $product = null;
                if (!empty($attributes)) {
                    $product = $this->getProductVariationWithMedia360($currentProduct, $attributes);
                }

                if ($product && $product->getImage() && $product->getImage() != 'no_selection') {
                    $currentProduct = $product;
                    $product = null;
                }

                if ($product && $this->hasImage360Media($product->getId())) {
                    $currentProduct = $product;
                }
            }

            $result['variantProductId'] = $currentProduct->getId();
        }

        /** @var \Magento\Framework\Controller\Result\Json $resultJson */
        $resultJson = $this->resultFactory->create(\Magento\Framework\Controller\ResultFactory::TYPE_JSON);
        $resultJson->setData($result);
        return $resultJson;
    }




    protected function hasImage360Media($id)
    {
        static $media = [];
        if (!isset($media[$id])) {
            $modelGalleryFactory = $this->_objectManager->get(
                \Codilar\Image360\Model\GalleryFactory::class
            );
            $galleryModel = $modelGalleryFactory->create();
            $collection = $galleryModel->getCollection();
            $collection->addFieldToFilter('product_id', $id);
            $media[$id] = (bool)$collection->count();
        }
        return $media[$id];
    }
}
