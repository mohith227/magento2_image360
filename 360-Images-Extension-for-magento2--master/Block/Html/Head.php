<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/
namespace Codilar\Image360\Block\Html;

use Magento\Framework\View\Element\Template\Context;
use Codilar\Image360\Helper\Data;

/**
 * Head block
 */
class Head extends \Magento\Framework\View\Element\Template
{
    /**
     * Helper
     *
     * @var \Codilar\Image360\Helper\Data
     */
    public $imageToolboxHelper = null;

    /**
     * Current page
     *
     * @var string
     */
    protected $currentPage = 'unknown';

    /**
     * Block visibility
     *
     * @var bool
     */
    protected $visibility = false;

    /**
     * @param Context $context
     * @param \Codilar\Image360\Helper\Data $imageToolboxHelper
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Codilar\Image360\Helper\Data $imageToolboxHelper,
        array $data = []
    ) {
        $this->imageToolboxHelper = $imageToolboxHelper;
        $this->currentPage = isset($data['page']) ? $data['page'] : 'unknown';
        parent::__construct($context, $data);
    }

    /**
     * Preparing layout
     *
     * @return $this
     */
    protected function _prepareLayout()
    {
        $tool = $this->imageToolboxHelper->getToolObj();
        if ($tool->params->profileExists($this->currentPage)) {
            $this->visibility = !$tool->params->checkValue('enable-effect', 'No', $this->currentPage);
        }
        $this->visibility = $this->visibility || $tool->params->checkValue('include-headers-on-all-pages', 'Yes', 'default');

        return parent::_prepareLayout();
    }

    /**
     * Get page type
     *
     * @return string
     */
    public function getPageType()
    {
        return $this->currentPage;
    }

    /**
     * Check block visibility
     *
     * @return bool
     */
    public function isVisibile()
    {
        return $this->visibility;
    }
}
