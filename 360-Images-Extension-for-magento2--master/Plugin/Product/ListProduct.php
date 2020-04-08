<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/
namespace Codilar\Image360\Plugin\Product;

/**
 * Plugin for \Magento\Catalog\Block\Product\ListProduct
 */
class ListProduct
{
    /**
     * Helper
     *
     * @var \Codilar\Image360\Helper\Data
     */
    protected $imageToolboxHelper = null;

    /**
     * Image360 module core class
     *
     * @var \Codilar\Image360\Classes\Image360ModuleCoreClass
     *
     */
    protected $toolObj = null;

    /**
     * Disable flag
     * @var bool
     */
    protected $isDisabled = true;

    /**
     * @param \Codilar\Image360\Helper\Data $imageToolboxHelper
     */
    public function __construct(
        \Codilar\Image360\Helper\Data $imageToolboxHelper
    ) {
        $this->imageToolboxHelper = $imageToolboxHelper;
        $this->toolObj = $this->imageToolboxHelper->getToolObj();
        $this->toolObj->params->setProfile('category');
        $this->isDisabled = !$this->toolObj->params->checkValue('enable-effect', 'Yes', 'category');
    }

    /**
     * Produce and return block's html output
     *
     * @param \Magento\Catalog\Block\Product\ListProduct $listProductBlock
     * @param string $html
     * @return string
     */
    public function afterToHtml(\Magento\Catalog\Block\Product\ListProduct $listProductBlock, $html)
    {
        if ($this->isDisabled) {
            return $html;
        }

        //NOTE: do not apply for product listing with not standard renderer (#148451)
        $isAnotherRendererAvailable = $this->imageToolboxHelper->getAnotherRenderer();
        if (!$isAnotherRendererAvailable) {
            return $html;
        }

        $this->imageToolboxHelper->setListProductBlock($listProductBlock);
        $productCollection = $listProductBlock->getLoadedProductCollection();
        $patternBegin = '<a(?=\s)[^>]+?(?<=\s)href="';
        $patternEnd = '"[^>]++>.*?</a>';

        foreach ($productCollection as $product) {

            $_html = $this->imageToolboxHelper->getHtmlData($product);

            if (empty($_html)) {
                continue;
            }

            $url = preg_quote($product->getProductUrl(), '#');
            $html = preg_replace("#{$patternBegin}{$url}{$patternEnd}#s", $_html, $html, 1);

        }

        return $html;
    }
}
