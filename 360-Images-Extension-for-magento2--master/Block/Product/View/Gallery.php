<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/
namespace Codilar\Image360\Block\Product\View;

use Magento\Framework\Data\Collection;
use Codilar\Image360\Helper\Data;
use Magento\Framework\Data\CollectionFactory;
use Codilar\Image360\Model\GalleryFactory;
use Codilar\Image360\Model\ColumnsFactory;

class Gallery extends \Magento\Catalog\Block\Product\View\Gallery
{
    /**
     * Helper
     *
     * @var \Codilar\Image360\Helper\Data
     */
    public $imageToolboxHelper = null;

    /**
     * Image360 module core class
     *
     * @var \Codilar\Image360\Classes\Image360ModuleCoreClass
     */
    public $toolObj = null;

    /**
     * @var \Magento\Framework\Data\CollectionFactory
     */
    protected $collectionFactory;

    /**
     * Model factory
     *
     * @var \Codilar\Image360\Model\GalleryFactory
     */
    protected $modelGalleryFactory = null;

    /**
     * Model factory
     *
     * @var \Codilar\Image360\Model\ColumnsFactory
     */
    protected $modelColumnsFactory = null;

    /**
     * Image360 image helper
     *
     * @var \Codilar\Image360\Helper\Image
     */
    public $image360ImageHelper;

    /**
     * Display Image360 spin as a separate block or inside fotorama gallery
     *
     * @var bool
     */
    protected $standaloneMode = false;

    /**
     * Rendered gallery HTML
     *
     * @var array
     */
    protected $renderedGalleryHtml = [];

    /**
     * ID of the current product
     *
     * @var integer
     */
    protected $currentProductId = null;

    /**
     * @param \Magento\Catalog\Block\Product\Context $context
     * @param \Magento\Framework\Stdlib\ArrayUtils $arrayUtils
     * @param \Magento\Framework\Json\EncoderInterface $jsonEncoder
     * @param \Codilar\Image360\Helper\Data $imageToolboxHelper
     * @param \Magento\Framework\Data\CollectionFactory $collectionFactory
     * @param \Codilar\Image360\Model\GalleryFactory $modelGalleryFactory
     * @param \Codilar\Image360\Model\ColumnsFactory $modelColumnsFactory
     * @param \Codilar\Image360\Helper\Image $image360ImageHelper
     * @param array $data
     */
    public function __construct(
        \Magento\Catalog\Block\Product\Context $context,
        \Magento\Framework\Stdlib\ArrayUtils $arrayUtils,
        \Magento\Framework\Json\EncoderInterface $jsonEncoder,
        \Codilar\Image360\Helper\Data $imageToolboxHelper,
        \Magento\Framework\Data\CollectionFactory $collectionFactory,
        \Codilar\Image360\Model\GalleryFactory $modelGalleryFactory,
        \Codilar\Image360\Model\ColumnsFactory $modelColumnsFactory,
        \Codilar\Image360\Helper\Image $image360ImageHelper,
        array $data = []
    ) {
        $this->imageToolboxHelper = $imageToolboxHelper;
        $this->toolObj = $this->imageToolboxHelper->getToolObj();
        $this->collectionFactory = $collectionFactory;
        $this->modelGalleryFactory = $modelGalleryFactory;
        $this->modelColumnsFactory = $modelColumnsFactory;
        $this->image360ImageHelper = $image360ImageHelper;
        $this->standaloneMode = $this->toolObj->params->checkValue('display-spin', 'separately', 'product');
        parent::__construct($context, $arrayUtils, $jsonEncoder, $data);
    }

    /**
     * Get escaper
     *
     * @return \Magento\Framework\Escaper
     */
    public function getEscaper()
    {
        return $this->_escaper;
    }

    /**
     * Retrieve collection of Image360 gallery images
     *
     * @param \Magento\Catalog\Model\Product $product
     * @return Magento\Framework\Data\Collection
     */
    public function getGalleryImagesCollection($product = null)
    {
        static $images = [];
        if (is_null($product)) {
            $product = $this->getProduct();
        }
        $id = $product->getId();
        if (!isset($images[$id])) {
            $images[$id] = $this->collectionFactory->create();
            $galleryModel = $this->modelGalleryFactory->create();
            $collection = $galleryModel->getCollection();
            $collection->addFieldToFilter('product_id', $id);
            if ($collection->count()) {
                $_images = $collection->getData();
                $compare = create_function('$a,$b', 'if ($a["position"] == $b["position"]) return 0; return (int)$a["position"] > (int)$b["position"] ? 1 : -1;');
                usort($_images, $compare);
                foreach ($_images as &$image) {
                    if (!$this->image360ImageHelper->fileExists($image['file'])) {
                        continue;
                    }
                    unset($image['product_id']);
                    $image['large_image_url'] = $this->image360ImageHelper
                        ->init($product, 'product_page_image_large', ['width' => null, 'height' => null])
                        ->setImageFile($image['file'])
                        ->getUrl();

                    $originalSizeArray = $this->image360ImageHelper->getImageSizeArray();

                    if ($this->toolObj->params->checkValue('square-images', 'Yes')) {
                        $bigImageSize = ($originalSizeArray[0] > $originalSizeArray[1]) ? $originalSizeArray[0] : $originalSizeArray[1];
                        $image['large_image_url'] = $this->image360ImageHelper
                            ->init($product, 'product_page_image_large')
                            ->setImageFile($image['file'])
                            ->resize($bigImageSize)
                            ->getUrl();
                    }

                    list($w, $h) = $this->imageToolboxHelper->imageToolboxGetSizes('thumb', $originalSizeArray);
                    $image['medium_image_url'] = $this->image360ImageHelper
                        ->init($product, 'product_page_image_medium', ['width' => $w, 'height' => $h])
                        ->setImageFile($image['file'])
                        ->getUrl();

                    $images[$id]->addItem(new \Magento\Framework\DataObject($image));
                }
            }
        }
        return $images[$id];
    }

    /**
     * Retrieve columns param
     *
     * @param integer $id
     * @return integer
     */
    public function getColumns($id = null)
    {
        static $columns = [];
        if (is_null($id)) {
            $id = $this->getProduct()->getId();
        }
        if (!isset($columns[$id])) {
            $columnsModel = $this->modelColumnsFactory->create();
            $columnsModel->load($id);
            $_columns = $columnsModel->getData('columns');
            $columns[$id] = $_columns ? $_columns : 0;
        }
        return $columns[$id];
    }

    /**
     * Retrieve additional gallery block
     *
     * @return mixed
     */
    public function getAdditionalBlock()
    {
        $data = $this->_coreRegistry->registry('imagetoolbox');
        if ($data && !empty($data['additional-block-name'])) {
            return $data['blocks'][$data['additional-block-name']];
        }
        return null;
    }

    /**
     * Retrieve original gallery block
     *
     * @return mixed
     */
    public function getOriginalBlock()
    {
        $data = $this->_coreRegistry->registry('imagetoolbox');
        return is_null($data) ? null : $data['blocks']['product.info.media.image'];
    }

    /**
     * Retrieve another gallery block
     *
     * @return mixed
     */
    public function getAnotherBlock()
    {
        $data = $this->_coreRegistry->registry('imagetoolbox');
        if ($data) {
            if (!empty($data['additional-block-name'])) {
                return $data['blocks'][$data['additional-block-name']];
            }
            $skip = true;
            foreach ($data['blocks'] as $name => $block) {
                if ($name == 'product.info.media.image360') {
                    $skip = false;
                    continue;
                }
                if ($skip) {
                    continue;
                }
                if ($block) {
                    return $block;
                }
            }
        }
        return null;
    }

    /**
     * Check for installed modules, which can operate in cooperative mode
     *
     * @return bool
     */
    public function isCooperativeModeAllowed()
    {
        $data = $this->_coreRegistry->registry('imagetoolbox');
        return is_null($data) ? false : $data['cooperative-mode'];
    }

    /**
     * Get thumb switcher initialization attribute
     *
     * @param integer $id
     * @return string
     */
    public function getThumbSwitcherInitAttribute($id = null)
    {
        static $html = null;
        if ($html === null) {
            if (is_null($id)) {
                $id = $this->currentProductId;
            }
            $data = $this->_coreRegistry->registry('imagetoolbox');
            $block = $data['blocks'][$data['additional-block-name']];
            $html = $block->getThumbSwitcherInitAttribute($id);
        }
        return $html;
    }

    /**
     * Before rendering html, but after trying to load cache
     *
     * @return $this
     */
    protected function _beforeToHtml()
    {
        $this->renderGalleryHtml();
        return parent::_beforeToHtml();
    }

    /**
     * Get rendered HTML
     *
     * @param integer $id
     * @return string
     */
    public function getRenderedHtml($id = null)
    {
        if (is_null($id)) {
            $id = $this->getProduct()->getId();
        }
        return isset($this->renderedGalleryHtml[$id]) ? $this->renderedGalleryHtml[$id] : '';
    }

    /**
     * Render gallery block HTML
     *
     * @param \Magento\Catalog\Model\Product $product
     * @param bool $isAssociatedProduct
     * @param array $data
     * @return $this
     */
    public function renderGalleryHtml($product = null, $isAssociatedProduct = false, $data = [])
    {
        if (is_null($product)) {
            $product = $this->getProduct();
        }
        $this->currentProductId = $id = $product->getId();
        if (!isset($this->renderedGalleryHtml[$id])) {
            $this->toolObj->params->setProfile('product');
            $image360Data = [];

            $images = $this->getGalleryImagesCollection($product);
            $columns = $this->getColumns($id);
            if ($columns > $images->count()) {
                $columns = $images->count();
            }
            $this->toolObj->params->setValue('columns', $columns);

            $originalBlock = $this->getAnotherBlock();

            if (!$images->count()) {
                if ($originalBlock) {
                    if (strpos($originalBlock->getModuleName(), 'Codilar_') === 0) {
                        $this->renderedGalleryHtml[$id] = $originalBlock->renderGalleryHtml($product, $isAssociatedProduct)->getRenderedHtml($id);
                    } else {
                        //NOTE: Magento_Catalog
                        $this->renderedGalleryHtml[$id] = $isAssociatedProduct ? '' : $originalBlock->toHtml();
                    }
                }
                return $this;
            }

            foreach ($images as $image) {

                $image360Data[] = [
                    'medium' => $image->getData('medium_image_url'),
                    'img' => $image->getData('large_image_url'),
                ];
            }

            $this->renderedGalleryHtml[$id] = $this->toolObj->getMainTemplate($image360Data, ['id' => "Image360-product-{$id}"]);

            if ($this->isCooperativeModeAllowed()) {
                $additionalBlock = $this->getAdditionalBlock();
                $_images = $additionalBlock->getGalleryImagesCollection($product);
                if ($_images->count()) {
                    $image360Icon = $this->getImage360IconPath();
                    if ($image360Icon) {
                        $image360IconUrl = $this->image360ImageHelper
                            ->init(null, 'product_page_image_small', ['width' => null, 'height' => null])
                            ->setImageFile($image360Icon)
                            ->getUrl();
                        $originalSizeArray = $this->image360ImageHelper->getImageSizeArray();

                        list($w, $h) = $additionalBlock->imageToolboxHelper->imageToolboxGetSizes('selector', $originalSizeArray);
                        $image360Icon = $this->image360ImageHelper
                            ->init(null, 'product_page_image_small', ['width' => $w, 'height' => $h])
                            ->setImageFile($image360Icon)
                            ->getUrl();
                    } else {
                        $image360Icon = $this->_imageHelper->getDefaultPlaceholderUrl('thumbnail');
                    }

                    $this->renderedGalleryHtml[$id] = $additionalBlock->renderGalleryHtml(
                        $product,
                        $isAssociatedProduct,
                        ['image360-icon' => $image360Icon, 'image360-html' => $this->renderedGalleryHtml[$id]]
                    )->getRenderedHtml($id);
                } else {
                    $this->renderedGalleryHtml[$id] = '<div class="CodilarContainer"'.$this->getThumbSwitcherInitAttribute().'>'.$this->renderedGalleryHtml[$id].'</div>';
                }
                return $this;
            }

            $this->renderedGalleryHtml[$id] = '<div class="CodilarContainer">'.$this->renderedGalleryHtml[$id].'</div>';

            //NOTE: check for the case where some module removes the original block, replacing it with its own
            if ($originalBlock) {
                //NOTE: use original gallery (content that was generated before will be used there)
                if (!$isAssociatedProduct && strpos($originalBlock->getModuleName(), 'Codilar_') === false) {
                    $this->renderedGalleryHtml[$id] = $this->getDefaultGalleryHtml();
                }
            }
        }
        return $this;
    }

    /**
     * Get default gallery HTML
     *
     * @param integer $id
     * @return string
     */
    public function getDefaultGalleryHtml()
    {
        static $html = null;
        if (is_null($html)) {
            $moduleName = $this->getModuleName();
            $template = $this->getTemplate();

            $this->setData('module_name', 'Magento_Catalog');
            $this->setTemplate('Magento_Catalog::product/view/gallery.phtml');

            $html = $this->toHtml();

            $this->setData('module_name', $moduleName);
            $this->setTemplate($template);
        }
        return $html;
    }

   /**
     * Get spin HTML
     *
     * @param \Magento\Catalog\Model\Product $product
     * @return string
     */
    public function getSpinHtml($product = null)
    {
        static $html = [];

        if (is_null($product)) {
            $product = $this->getProduct();
        }
        $id = $product->getId();

        if (!isset($html[$id])) {
            $html[$id] = '';

            $this->toolObj->params->setProfile('product');
            $images = $this->getGalleryImagesCollection($product);

            if (!$images->count()) {
                return '';
            }

            $columns = $this->getColumns($id);
            if ($columns > $images->count()) {
                $columns = $images->count();
            }
            $this->toolObj->params->setValue('columns', $columns);

            $image360Data = [];
            foreach ($images as $image) {
                $image360Data[] = [
                    'medium' => $image->getData('medium_image_url'),
                    'img' => $image->getData('large_image_url'),
                ];
            }

            $html[$id] = $this->toolObj->getMainTemplate($image360Data, ['id' => "Image360-product-{$id}"]);
            $html[$id] = '<div class="CodilarContainer">'.$html[$id].'</div>';
        }

        return $html[$id];
    }

    /**
     * Is the effect enabled
     *
     * @return boolean
     */
    public function isEffectEnabled()
    {
        return $this->toolObj->params->checkValue('enable-effect', 'Yes', 'product');
    }

    /**
     * Is Image360 spin displayed as a separate block
     *
     * @return boolean
     */
    public function isStandaloneMode()
    {
        return $this->standaloneMode;
    }

    /**
     * Retrieve product images in JSON format
     *
     * @return string
     */
    public function getGalleryImagesJson()
    {
        $imagesItems = [];
        $product = $this->getProduct();
        $shift = 0;

        if (!$this->standaloneMode) {
            $images = $this->getGalleryImagesCollection($product);
            if ($images->count()) {
                $image360Icon = $this->getImage360IconPath();
                if ($image360Icon) {
                    $image360Icon = $this->image360ImageHelper
                        ->init(null, 'product_page_image_small', ['width' => null, 'height' => null])
                        ->setImageFile($image360Icon)
                        ->getUrl();
                } else {
                    $image360Icon = $this->_imageHelper->getDefaultPlaceholderUrl('thumbnail');
                }
                $id = $product->getId();
                $imagesItems[] = [
                    'image360' => 'Image360-product-'.$id,
                    'thumb' => $image360Icon,
                    'html' => '<div class="fotorama__select">'.$this->renderedGalleryHtml[$id].'</div>',
                    'caption' => '',
                    'position' => 0,
                    'isMain' => true,
                    'type' => 'image360',
                    'videoUrl' => null,
                    'fit' => 'none',
                ];
                $shift = 1;
            }
        }

        $productImages = $this->getGalleryImages() ?: [];
        $productMainImage = $product->getImage();
        $productName = $product->getName();
        foreach ($productImages as $image) {
            $imagesItems[] = [
                'thumb' => $image->getData('small_image_url'),
                'img' => $image->getData('medium_image_url'),
                'full' => $image->getData('large_image_url'),
                'caption' => ($image->getLabel() ?: $productName),
                'position' => ((int)$image->getPosition() + $shift),
                'isMain' => ($shift ? false : $image->getFile() == $productMainImage),
                'type' => str_replace('external-', '', $image->getMediaType()),
                'videoUrl' => $image->getVideoUrl(),
            ];
        }

        return json_encode($imagesItems);
    }

    /**
     * Get Image360 icon path
     *
     * @return string
     */
    public function getImage360IconPath()
    {
        static $path = null;
        if (is_null($path)) {
            $this->toolObj->params->setProfile('product');
            $icon = $this->toolObj->params->getValue('icon');
            $hash = md5($icon);
            $model = $this->image360ImageHelper->getModel();
            $mediaDirectory = $model->getMediaDirectory();
            if ($mediaDirectory->isFile('image360/icon/'.$hash.'/360icon.jpg')) {
                $path = 'icon/'.$hash.'/360icon.jpg';
            } else {
                $rootDirectory = $model->getRootDirectory();
                if ($rootDirectory->isFile($icon)) {
                    $rootDirectory->copyFile($icon, 'image360/icon/'.$hash.'/360icon.jpg', $mediaDirectory);
                    $path = 'icon/'.$hash.'/360icon.jpg';
                } else {
                    $path = '';
                }
            }
        }
        return $path;
    }
}
