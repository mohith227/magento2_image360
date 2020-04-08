<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/
namespace Codilar\Image360\Block\Adminhtml\Product\Edit\Image360;

/**
 * Image 360 Spin Options
 *
 */
class SpinOptions extends \Magento\Framework\View\Element\Template
{

    /**
     * Path to template file
     *
     * @var string
     */
//    protected $_template = 'Codilar_Image360::product/edit/image360/spin_options.phtml';

    /**
     * Core registry
     *
     * @var \Magento\Framework\Registry
     */
    protected $_coreRegistry = null;

    /**
     * Model factory
     * @var \Codilar\Image360\Model\GalleryFactory
     */
    protected $modelGalleryFactory = null;

    /**
     * Model factory
     * @var \Codilar\Image360\Model\ColumnsFactory
     */
    protected $modelColumnsFactory = null;

    /**
     * Form name
     *
     * @var string
     */
    protected $formName = 'product_form';

    /**
     * Constructor
     *
     * @param \Magento\Framework\View\Element\Template\Context $context
     * @param \Magento\Framework\Registry $registry
     * @param \Codilar\Image360\Model\GalleryFactory $modelGalleryFactory
     * @param \Codilar\Image360\Model\ColumnsFactory $modelColumnsFactory
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Magento\Framework\Registry $registry,
        \Codilar\Image360\Model\GalleryFactory $modelGalleryFactory,
        \Codilar\Image360\Model\ColumnsFactory $modelColumnsFactory,
        array $data = []
    ) {
        $this->_coreRegistry = $registry;
        $this->modelGalleryFactory = $modelGalleryFactory;
        $this->modelColumnsFactory = $modelColumnsFactory;
        parent::__construct($context, $data);
        $this->setFormName($this->formName);
    }


}
