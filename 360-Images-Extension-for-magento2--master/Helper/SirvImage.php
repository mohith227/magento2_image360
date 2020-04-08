<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/
namespace Codilar\Image360\Helper;

/**
 * Sirv image helper
 */
class SirvImage extends \Codilar\Image360\Helper\Image
{
    /**
     * Sirv config helper
     *
     * @var \Codilar\Sirv\Helper\Data
     */
    protected $sirvConfigHelper = null;

    /**
     * Is Sirv enabled flag
     *
     * @var bool
     */
    protected $isSirvEnabled = false;

    /**
     * Use Sirv image processing flag
     *
     * @var bool
     */
    protected $useSirvImageProcessing = false;

    /**
     * @param \Magento\Framework\App\Helper\Context $context
     * @param \Magento\Catalog\Model\Product\ImageFactory $productImageFactory
     * @param \Magento\Framework\View\Asset\Repository $assetRepo
     * @param \Magento\Framework\View\ConfigInterface $viewConfig
     */
    public function __construct(
        \Magento\Framework\App\Helper\Context $context,
        \Magento\Catalog\Model\Product\ImageFactory $productImageFactory,
        \Magento\Framework\View\Asset\Repository $assetRepo,
        \Magento\Framework\View\ConfigInterface $viewConfig
    ) {
        parent::__construct($context, $productImageFactory, $assetRepo, $viewConfig);
        $sirvConfigHelper = $this->getSirvConfigHelper();
        $this->isSirvEnabled = $sirvConfigHelper->isSirvEnabled();
        $this->useSirvImageProcessing = $sirvConfigHelper->useSirvImageProcessing();
    }

    /**
     * Get Sirv config helper
     *
     * @return \Codilar\Sirv\Helper\Data
     */
    protected function getSirvConfigHelper()
    {
        if ($this->sirvConfigHelper == null) {
            $this->sirvConfigHelper = \Magento\Framework\App\ObjectManager::getInstance()->get(
                \Codilar\Sirv\Helper\Data::class
            );
        }
        return $this->sirvConfigHelper;
    }

    /**
     * Check if scheduled actions is allowed
     *
     * @return bool
     */
    protected function isScheduledActionsAllowed()
    {
        if (parent::isScheduledActionsAllowed()) {
            return true;
        } elseif ($this->isSirvEnabled && $this->useSirvImageProcessing) {
            $model = $this->_getModel();
            if (property_exists('\Magento\Catalog\Model\Product\Image', 'viewAssetImageFactory')) {
                if ($model->isBaseFilePlaceholder()) {
                    return false;
                }
            } else {
                if ($model->isBaseFilePlaceholder() && $model->getNewFile() === true) {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    }

    /**
     * Get current image model
     *
     * @return \Codilar\Image360\Model\Product\SirvImage
     */
    protected function _getModel()
    {
        if (!$this->_model) {
            $factory = \Magento\Framework\App\ObjectManager::getInstance()->get(
                \Codilar\Image360\Model\Product\SirvImageFactory::class
            );
            $this->_model = $factory->create();
        }
        return $this->_model;
    }
}
