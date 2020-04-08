<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/
namespace Codilar\Image360\Block\Adminhtml\Product\Edit\Tab;

use Magento\Backend\Block\Widget\Tab\TabInterface;

/**
 * Image 360 Images tab
 *
 */
class Image360Images extends \Magento\Backend\Block\Widget\Form\Generic implements TabInterface
{
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
     * @param \Magento\Backend\Block\Template\Context $context
     * @param \Magento\Framework\Registry $registry
     * @param \Magento\Framework\Data\FormFactory $formFactory
     * @param \Codilar\Image360\Model\GalleryFactory $modelGalleryFactory
     * @param \Codilar\Image360\Model\ColumnsFactory $modelColumnsFactory
     * @param array $data
     */
    public function __construct(
        \Magento\Backend\Block\Template\Context $context,
        \Magento\Framework\Registry $registry,
        \Magento\Framework\Data\FormFactory $formFactory,
        \Codilar\Image360\Model\GalleryFactory $modelGalleryFactory,
        \Codilar\Image360\Model\ColumnsFactory $modelColumnsFactory,
        array $data = []
    ) {
        $this->modelGalleryFactory = $modelGalleryFactory;
        $this->modelColumnsFactory = $modelColumnsFactory;
        parent::__construct($context, $registry, $formFactory, $data);
    }

    /**
     * Return Tab label
     *
     * @return string
     */
    public function getTabLabel()
    {
        return $this->getLabel();
    }

    /**
     * Return Tab title
     *
     * @return string
     */
    public function getTabTitle()
    {
        return $this->getTitle();
    }

    /**
     * Can show tab in tabs
     *
     * @return boolean
     */
    public function canShowTab()
    {
        if (!$this->_request->getParam('id') || !$this->_authorization->isAllowed('Codilar_Image360::image360_settings_edit')) {
            $this->setCanShow(false);
        }
        return $this->hasCanShow() ? (bool)$this->getCanShow() : true;
    }

    /**
     * Tab is hidden
     *
     * @return boolean
     */
    public function isHidden()
    {
        return $this->hasIsHidden() ? (bool)$this->getIsHidden() : false;
    }

    /**
     * Prepare form before rendering HTML
     *
     * @return $this
     */
    protected function _prepareForm()
    {

        $multiRowsValue = false;
        $columnsValue = 0;
        $rowsValue = 1;

        $productId = $this->_coreRegistry->registry('product')->getId();

        $galleryModel = $this->modelGalleryFactory->create();
        $galleryCollection = $galleryModel->getCollection();
        $galleryCollection->addFieldToFilter('product_id', $productId);
        $galleryCollection->setOrder('position', \Magento\Framework\Data\Collection::SORT_ORDER_ASC);
        $imagesCount = $galleryCollection->count();

        $columnsModel = $this->modelColumnsFactory->create();
        $columnsModel->load($productId);
        $columnsValue = (int)$columnsModel->getData('columns');//null
        $columnsValue = $columnsValue ? $columnsValue : 0;

        if ($columnsValue && $imagesCount != $columnsValue) {
            $multiRowsValue = true;
            $rowsValue = floor($imagesCount/$columnsValue);
        }

        /** @var \Magento\Framework\Data\Form $form */
        $form = $this->_formFactory->create();


        $fieldset = $form->addFieldset('image360_images_fieldset', ['legend' => __('360 Images')]);

        $fieldset->addType('image360_gallery', 'Codilar\Image360\Block\Adminhtml\Product\Helper\Form\Gallery');

        $gallery = $fieldset->addField(
            'image360_gallery',
            'image360_gallery',
            [
                'name' => 'image360[gallery]',
                'label' => __('Image360 Gallery'),
                'title' => __('Image360 Gallery'),
                'value'     => $galleryCollection->getData(),
            ]
        );

        $this->setForm($form);
        return parent::_prepareForm();
    }
}
