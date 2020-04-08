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
class FixLayoutAfter implements \Magento\Framework\Event\ObserverInterface
{
    /**
     * Helper
     *
     * @var \Codilar\Image360\Helper\Data
     */
    protected $imageToolboxHelper = null;

    /**
     * Core registry
     *
     * @var \Magento\Framework\Registry
     */
    protected $coreRegistry = null;

    /**
     * Constructor
     *
     * @param \Codilar\Image360\Helper\Data $imageToolboxHelper
     * @param \Magento\Framework\Registry $registry
     */
    public function __construct(
        \Codilar\Image360\Helper\Data $imageToolboxHelper,
        \Magento\Framework\Registry $registry
    ) {
        $this->imageToolboxHelper = $imageToolboxHelper;
        $this->coreRegistry = $registry;
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

        $block = $layout->getBlock('product.info.media.image360');
        if ($block) {
            $data = $this->coreRegistry->registry('imagetoolbox');
            if (is_null($data)) {
                $data = [
                    'current' => '',
                    'blocks' => [
                        'product.info.media.image360' => null,
                        'product.info.media.imageslideshow' => null,
                        'product.info.media.imagescroll' => null,
                        'product.info.media.imagezoomplus' => null,
                        'product.info.media.imagezoom' => null,
                        'product.info.media.imagethumb' => null,
                        'product.info.media.image' => null,
                    ],
                    'cooperative-mode' => false,
                    'standalone-mode' => false,
                    'additional-block-name' => '',
                    'imagescroll' => '',
                ];
            }

            if (empty($data['current'])) {
                $original = $layout->getBlock('product.info.media.image');
                if ($original) {
                    $data['current'] = 'product.info.media.image';
                    $data['blocks']['product.info.media.image'] = $original;
                }
            }

            $image360 = $this->imageToolboxHelper->getToolObj();
            $isEnabled = !$image360->params->checkValue('enable-effect', 'No', 'product');

            if ($isEnabled) {
                $layout->unsetElement($data['current']);
                $data['current'] = 'product.info.media.image360';
                $data['blocks']['product.info.media.image360'] = $block;
                foreach ($data['blocks'] as $name => $block) {
                    if ($block && preg_match('#^product.info.media.image(?:thumb|zoom(?:plus)?)$#', $name)) {
                        $data['cooperative-mode'] = true;
                        $data['additional-block-name'] = $name;
                        break;
                    }
                }
                if ($data['cooperative-mode']) {
                    $image360->params->setValue('display-spin', 'inside fotorama gallery', 'product');
                } else {
                    $data['standalone-mode'] = $image360->params->checkValue('display-spin', 'separately', 'product');
                }
            } else {
                $layout->unsetElement('product.info.media.image360');
            }
            $this->coreRegistry->unregister('imagetoolbox');
            $this->coreRegistry->register('imagetoolbox', $data);
        }

        $block = $layout->getBlock('configurable.image360');
        if ($block) {

            $data = $this->coreRegistry->registry('imagetoolbox_category');
            if (is_null($data)) {
                $data = [
                    'current-renderer' => '',
                    'renderers' => [
                        'configurable.image360' => null,
                        'configurable.imageslideshow' => null,
                        'configurable.imagescroll' => null,
                        'configurable.imagezoomplus' => null,
                        'configurable.imagezoom' => null,
                        'configurable.imagethumb' => null,
                        //'configurable' => null,
                    ],
                ];
            }

            /** @var $rendererList \Magento\Framework\View\Element\RendererList */
            $rendererList = $layout->getBlock('category.product.type.details.renderers');

            if (empty($data['current-renderer'])) {
                if ($rendererList) {
                    /** @var $renderer \Magento\Swatches\Block\Product\Renderer\Listing\Configurable */
                    $renderer = $rendererList->getChildBlock('configurable');
                    if ($renderer) {
                        $name = $renderer->getNameInLayout();
                        $data['current-renderer'] = $name;
                        $data['renderers'][$name] = $renderer;
                    }
                }
            }

            $image360 = $this->imageToolboxHelper->getToolObj();
            $isEnabled = $image360->params->checkValue('enable-effect', 'Yes', 'category');
            if ($isEnabled) {
                if ($rendererList) {
                    $rendererList->setChild('configurable', $block);
                }
                $data['current-renderer'] = 'configurable.image360';
                $data['renderers']['configurable.image360'] = $block;
            } else {
                $layout->unsetElement('configurable.image360');
            }
            $this->coreRegistry->unregister('imagetoolbox_category');
            $this->coreRegistry->register('imagetoolbox_category', $data);
        }

        return $this;
    }
}
