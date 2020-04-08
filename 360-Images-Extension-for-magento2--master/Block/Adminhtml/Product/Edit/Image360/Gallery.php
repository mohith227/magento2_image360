<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/
namespace Codilar\Image360\Block\Adminhtml\Product\Edit\Image360;

/**
 * Image 360 gallery
 *
 */
class Gallery extends \Magento\Framework\View\Element\AbstractBlock
{
    /**
     * Gallery html id
     *
     * @var string
     */
    protected $htmlId = 'image360_gallery';

    /**
     * Gallery name
     *
     * @var string
     */
    protected $name = 'image360[gallery]';

    /**
     * Form name
     *
     * @var string
     */
    protected $formName = 'product_form';

    /**
     * @var \Magento\Framework\Registry
     */
    protected $registry;

    /**
     * Model factory
     *
     * @var \Codilar\Image360\Model\GalleryFactory
     */
    protected $modelGalleryFactory = null;

    /**
     * @param \Magento\Framework\View\Element\Context $context
     * @param \Magento\Framework\Registry $registry
     * @param \Codilar\Image360\Model\GalleryFactory $modelGalleryFactory
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\View\Element\Context $context,
        \Magento\Framework\Registry $registry,
        \Codilar\Image360\Model\GalleryFactory $modelGalleryFactory,
        $data = []
    ) {
        $this->registry = $registry;
        $this->modelGalleryFactory = $modelGalleryFactory;
        parent::__construct($context, $data);
    }

    /**
     * @return string
     */
    public function getElementHtml()
    {
        $html = $this->getContentHtml();
        return $html;
    }

    /**
     * Get product images
     *
     * @return array|null
     */
    public function getImages()
    {
        $productId = $this->registry->registry('current_product')->getId();
        $galleryModel = $this->modelGalleryFactory->create();
        $galleryCollection = $galleryModel->getCollection();
        $galleryCollection->addFieldToFilter('product_id', $productId);
        $galleryCollection->setOrder('position', \Magento\Framework\Data\Collection::SORT_ORDER_ASC);
        return $galleryCollection->getData() ?: null;
    }

    /**
     * Prepares content block
     *
     * @return string
     */
    public function getContentHtml()
    {
        /* @var $content \Codilar\Image360\Block\Adminhtml\Product\Edit\Image360\Gallery\Content */
        $content = $this->getChildBlock('image360_gallery_content');
        $content->setId($this->getHtmlId() . '_content');
        $content->setElement($this);
        $content->setFormName($this->formName);
        $galleryJs = $content->getJsObjectName();
        $content->getUploader()->getConfig()->setMegiaGallery($galleryJs);
        return $content->toHtml();
    }

    /**
     * @return string
     */
    protected function getHtmlId()
    {
        return $this->htmlId;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @return string
     */
    public function toHtml()
    {
        return $this->getElementHtml();
    }
}
