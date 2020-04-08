<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/
namespace Codilar\Image360\Block\Adminhtml\Product\Edit;

/**
 * Image 360 Fieldset
 *
 */
class Image360 extends \Magento\Framework\View\Element\Template
{

    /**
     * Path to template file
     *
     * @var string
     */
    protected $_template = 'Codilar_Image360::product/edit/image360.phtml';

    /**
     * Core registry
     *
     * @var \Magento\Framework\Registry
     */
    protected $_coreRegistry = null;

    /**
     * Constructor
     *
     * @param \Magento\Framework\View\Element\Template\Context $context
     * @param \Magento\Framework\Registry $registry
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Magento\Framework\Registry $registry,
        array $data = []
    ) {
        $this->_coreRegistry = $registry;
        parent::__construct($context, $data);
    }

    public function getProduct()
    {
        return $this->_coreRegistry->registry('current_product');
    }

    /**
     * Can show block
     *
     * @return boolean
     */
    public function canShowBlock()
    {
        if (!$this->_request->getParam('id')) {
            return false;
        }
        return true;
    }

    /**
     * Render block HTML
     *
     * @return string
     */
    protected function _toHtml()
    {
        if (!$this->canShowBlock()) {
            return 'To upload images for Image 360, save the new product first, please.';
        }
        return parent::_toHtml();
    }
}
