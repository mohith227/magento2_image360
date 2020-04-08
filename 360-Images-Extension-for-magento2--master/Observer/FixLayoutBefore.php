<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/
namespace Codilar\Image360\Observer;

/**
 * Image360 Observer
 *
 */
class FixLayoutBefore implements \Magento\Framework\Event\ObserverInterface
{
    /**
     * Helper
     *
     * @var \Codilar\Image360\Helper\Data
     */
    protected $imageToolboxHelper = null;

    /**
     * Constructor
     *
     * @param \Codilar\Image360\Helper\Data $imageToolboxHelper
     */
    public function __construct(
        \Codilar\Image360\Helper\Data $imageToolboxHelper
    ) {
        $this->imageToolboxHelper = $imageToolboxHelper;
    }

    /**
     * Execute method
     *
     * @param \Magento\Framework\Event\Observer $observer
     * @return $this
     *
     */
    public function execute(\Magento\Framework\Event\Observer $observer)
    {
        /** @var \Magento\Framework\View\Layout $layout */
        $layout = $observer->getLayout();
        /** @var \Magento\Framework\View\Layout\Element $layoutXMLElement */
        $layoutXMLElement = $layout->getNode(null);
        $pathes = [
            //NOTE: product page media block
            '/layout/body/referenceContainer[@name="product.info.media"]' => 'block[@name="product.info.media.image360"]',
            //NOTE: product page configurable options and swatches blocks
            '/layout/body/referenceBlock[@name="product.info.options.wrapper"]' => 'block[@class="Codilar\Image360\Block\Product\View\Type\Configurable"]',
            //NOTE: category page configurable (swatches) renderer block
            '/layout/body/referenceBlock[@name="category.product.type.details.renderers"]' => 'block[@name="configurable.image360"]',
            //NOTE: container for headers
            '/layout/body/referenceBlock[@name="head.additional"]' => 'container[@name="head.additional.imagetoolbox"]',
        ];

        $image360 = $this->imageToolboxHelper->getToolObj();
        $isDisabled = $image360->params->checkValue('enable-effect', 'No', 'product');

        foreach ($pathes as $searchPath => $checkPath) {
            $nodes = $layoutXMLElement->xpath($searchPath);
            if ($nodes) {
                while(list( , $node) = each($nodes)) {
                    if ($node->xpath($checkPath)) {
                        //NOTE: to remove product page options blocks if effect is disabled
                        if ($isDisabled && 'block[@class="Codilar\Image360\Block\Product\View\Type\Configurable"]' == $checkPath) {
                            $node->unsetSelf();
                            continue;
                        }
                        $body = $layoutXMLElement->addChild('body');
                        $body->appendChild($node);
                        $node->unsetSelf();
                    }
                }
            }
        }

        return $this;
    }
}
