<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/
namespace Codilar\Image360\Block\Product\Renderer\Listing;

/**
 * Swatch renderer block in Category page
 *
 * @codeCoverageIgnore
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class Configurable extends \Magento\Swatches\Block\Product\Renderer\Listing\Configurable
{
    /**
     * Action name for ajax request
     */
    const MAGICTOOLBOX_MEDIA_CALLBACK_ACTION = 'image360/ajax/media';

    /**
     * @var \Codilar\Image360\Helper\ConfigurableData
     */
    protected $helper;

    /**
     * @var \Magento\Framework\Module\Manager
     */
    protected $moduleManager = null;

    /**
     * @param \Magento\Catalog\Block\Product\Context $context
     * @param \Magento\Framework\Stdlib\ArrayUtils $arrayUtils
     * @param \Magento\Framework\Json\EncoderInterface $jsonEncoders
     * @param \Codilar\Image360\Helper\ConfigurableData $helper
     * @param \Magento\Catalog\Helper\Product $catalogProduct
     * @param \Magento\Customer\Helper\Session\CurrentCustomer $currentCustomer
     * @param \Magento\Framework\Pricing\PriceCurrencyInterface $priceCurrency
     * @param \Magento\ConfigurableProduct\Model\ConfigurableAttributeData $configurableAttributeData
     * @param \Magento\Swatches\Helper\Data $swatchHelper
     * @param \Magento\Swatches\Helper\Media $swatchMediaHelper
     * @param \Magento\Framework\Module\Manager $moduleManager
     * @param array $data
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     */
    public function __construct(
        \Magento\Catalog\Block\Product\Context $context,
        \Magento\Framework\Stdlib\ArrayUtils $arrayUtils,
        \Magento\Framework\Json\EncoderInterface $jsonEncoder,
        \Codilar\Image360\Helper\ConfigurableData $helper,
        \Magento\Catalog\Helper\Product $catalogProduct,
        \Magento\Customer\Helper\Session\CurrentCustomer $currentCustomer,
        \Magento\Framework\Pricing\PriceCurrencyInterface $priceCurrency,
        \Magento\ConfigurableProduct\Model\ConfigurableAttributeData $configurableAttributeData,
        \Magento\Swatches\Helper\Data $swatchHelper,
        \Magento\Swatches\Helper\Media $swatchMediaHelper,
        \Magento\Framework\Module\Manager $moduleManager,
        array $data = []
    ) {
        parent::__construct(
            $context,
            $arrayUtils,
            $jsonEncoder,
            $helper,
            $catalogProduct,
            $currentCustomer,
            $priceCurrency,
            $configurableAttributeData,
            $swatchHelper,
            $swatchMediaHelper,
            $data
        );
        $this->moduleManager = $moduleManager;
    }

    /**
     * Helper getter
     *
     * @return string
     */
    public function getCodilarHelper()
    {
        return $this->helper->imageToolboxHelper;
    }

    /**
     * Returns additional values for js config
     *
     * @return array
     */
    protected function _getAdditionalConfig()
    {
        $config = parent::_getAdditionalConfig();
        $data = $this->helper->getRegistry()->registry('imagetoolbox_category');
        if ($data && $data['current-renderer'] == 'configurable.image360') {
            $config['imagetoolbox'] = [
                'useOriginalGallery' => $this->helper->useOriginalGallery(),
                'galleryData' => $this->helper->getGalleryData(),
                'standaloneMode' => false
            ];
        }
        return $config;
    }

    /**
     * @return string
     */
    public function getMediaCallback()
    {
        $data = $this->helper->getRegistry()->registry('imagetoolbox_category');
        $route = self::MEDIA_CALLBACK_ACTION;
        if ($data && $data['current-renderer'] == 'configurable.image360') {
            $route = self::MAGICTOOLBOX_MEDIA_CALLBACK_ACTION;
        }
        return $this->getUrl($route, ['_secure' => $this->getRequest()->isSecure()]);
    }

    /**
     * Render block HTML
     *
     * @return string
     */
    protected function _toHtml()
    {
        if (!$this->moduleManager->isEnabled('Magento_Swatches')) {
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
        if (!$this->moduleManager->isEnabled('Magento_Swatches')) {
            return '';
        }
        return parent::_afterToHtml($html);
    }
}
