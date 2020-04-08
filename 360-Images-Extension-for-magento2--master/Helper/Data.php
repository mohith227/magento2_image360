<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/
namespace Codilar\Image360\Helper;

/**
 * Data helper
 * @SuppressWarnings(PHPMD.TooManyFields)
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class Data extends \Magento\Framework\App\Helper\AbstractHelper
{
    /**
     * Model factory
     * @var \Codilar\Image360\Model\ConfigFactory
     */
    protected $modelConfigFactory = null;

    /**
     * Image360 module core class
     *
     * @var \Codilar\Image360\Classes\Image360ModuleCoreClass
     *
     */
    protected $image360 = null;

    /**
     * @var \Magento\Catalog\Helper\Image
     */
    protected $imageHelper;

    /**
     * @var \Magento\Framework\Filesystem\Directory\WriteInterface
     */
    protected $mediaDirectory;

    /**
     * @var \Magento\Framework\Filesystem\Directory\WriteInterface
     */
    protected $staticDirectory;

    /**
     * Store manager
     *
     * @var \Magento\Store\Model\StoreManagerInterface
     */
    protected $storeManager;

    /**
     * Base url
     *
     * @var string
     */
    protected $baseUrl;

    /**
     * Base url for media
     *
     * @var string
     */
    protected $baseMediaUrl;

    /**
     * Base url for static
     *
     * @var string
     */
    protected $baseStaticUrl;

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
     * Image360 image helper
     * @var \Codilar\Image360\Helper\Image
     */
    protected $image360ImageHelper;

    /**
     * Core registry
     *
     * @var \Magento\Framework\Registry
     */
    protected $coreRegistry = null;

    /**
     * Product list block
     *
     * @var \Magento\Catalog\Block\Product\ListProduct
     */
    protected $listProductBlock = null;

    /**
     * Frontend flag
     *
     * @var bool
     */
    protected $isFrontend = true;

    /**
     * Constructor
     *
     * @param \Magento\Framework\App\Helper\Context $context
     * @param \Codilar\Image360\Model\ConfigFactory $modelConfigFactory
     * @param \Magento\Catalog\Helper\ImageFactory $imageHelperFactory
     * @param \Magento\Framework\Filesystem $filesystem
     * @param \Magento\Store\Model\StoreManagerInterface $storeManager
     * @param \Codilar\Image360\Model\GalleryFactory $modelGalleryFactory
     * @param \Codilar\Image360\Model\ColumnsFactory $modelColumnsFactory
     * @param \Codilar\Image360\Helper\ImageFactory $image360ImageHelperFactory
     * @param \Codilar\Image360\Classes\Image360ModuleCoreClass $image360
     * @param \Magento\Framework\Registry $registry
     * @param \Magento\Framework\App\State $appState
     */
    public function __construct(
        \Magento\Framework\App\Helper\Context $context,
        \Codilar\Image360\Model\ConfigFactory $modelConfigFactory,
        \Magento\Catalog\Helper\ImageFactory $imageHelperFactory,
        \Magento\Framework\Filesystem $filesystem,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Codilar\Image360\Model\GalleryFactory $modelGalleryFactory,
        \Codilar\Image360\Model\ColumnsFactory $modelColumnsFactory,
        \Codilar\Image360\Helper\ImageFactory $image360ImageHelperFactory,
        \Codilar\Image360\Classes\Image360ModuleCoreClass $image360,
        \Magento\Framework\Registry $registry,
        \Magento\Framework\App\State $appState
    ) {
        $this->modelConfigFactory = $modelConfigFactory;
        $this->image360 = $image360;
        $this->imageHelper = $imageHelperFactory->create();
        $this->mediaDirectory = $filesystem->getDirectoryWrite(\Magento\Framework\App\Filesystem\DirectoryList::MEDIA);
        $this->staticDirectory = $filesystem->getDirectoryWrite(\Magento\Framework\App\Filesystem\DirectoryList::STATIC_VIEW);
        $this->storeManager = $storeManager;
        $this->baseUrl = $this->storeManager->getStore()->getBaseUrl();
        $this->baseMediaUrl = $this->storeManager->getStore()->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA);
        $this->baseStaticUrl = $this->storeManager->getStore()->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_STATIC);
        $this->modelGalleryFactory = $modelGalleryFactory;
        $this->modelColumnsFactory = $modelColumnsFactory;
        $this->image360ImageHelper = $image360ImageHelperFactory->create();
        $this->coreRegistry = $registry;
        $this->isFrontend = ($appState->getAreaCode() != \Magento\Framework\App\Area::AREA_ADMINHTML);
        parent::__construct($context);
    }

    public function getToolObj()
    {
        static $doInit = true;
        if ($doInit) {
            $model = $this->modelConfigFactory->create();
            $collection = $model->getCollection();
            $collection->addFieldToFilter('platform', 0);
            $collection->addFieldToFilter('status', ['neq' => 0]);
            $data = $collection->getData();
            foreach ($data as $key => $param) {
                $this->image360->params->setValue($param['name'], $param['value'], $param['profile']);
            }
            //NOTE: apply tranlations
            if ($this->isFrontend) {
                $transParams = [
                    'loading-text',

                    'hint-text',
                    'mobile-hint-text',
                    'message',
                ];
                foreach ($this->image360->params->getProfiles() as $profile) {
                    foreach ($transParams as $name) {
                        $value = $this->image360->params->getValue($name, $profile);
                        $this->image360->params->setValue($name, ''.__($value), $profile);
                    }
                }
            }
            $doInit = false;
        }
        return $this->image360;
    }

    /**
     * Public method to get image sizes
     *
     * @return array
     */
    public function imageToolboxGetSizes($sizeType, $originalSizes = [])
    {
        $w = $this->image360->params->getValue($sizeType.'-max-width');
        $h = $this->image360->params->getValue($sizeType.'-max-height');
        if (empty($w)) {
            $w = 0;
        }
        if (empty($h)) {
            $h = 0;
        }
        if ($this->image360->params->checkValue('square-images', 'No')) {
            //NOTE: fix for bad images
            if (empty($originalSizes[0]) || empty($originalSizes[1])) {
                return [$w, $h];
            }
            list($w, $h) = $this->calculateSize($originalSizes[0], $originalSizes[1], $w, $h);
        } else {
            $h = $w = $h ? ($w ? min($w, $h) : $h) : $w;
        }
        return [$w, $h];
    }

    /**
     * Public method to calculate sizes
     *
     * @return array
     */
    private function calculateSize($originalW, $originalH, $maxW = 0, $maxH = 0)
    {
        if (!$maxW && !$maxH) {
            return [$originalW, $originalH];
        } elseif (!$maxW) {
            $maxW = ($maxH * $originalW) / $originalH;
        } elseif (!$maxH) {
            $maxH = ($maxW * $originalH) / $originalW;
        }

        //NOTE: to do not stretch small images
        if (($originalW < $maxW) && ($originalH < $maxH)) {
            return [$originalW, $originalH];
        }

        $sizeDepends = $originalW/$originalH;
        $placeHolderDepends = $maxW/$maxH;
        if ($sizeDepends > $placeHolderDepends) {
            $newW = $maxW;
            $newH = $originalH * ($maxW / $originalW);
        } else {
            $newW = $originalW * ($maxH / $originalH);
            $newH = $maxH;
        }
        return [round($newW), round($newH)];
    }

    /**
     * Get media directory
     *
     * @return \Magento\Framework\Filesystem\Directory\Write
     */
    public function getMediaDirectory()
    {
        return $this->mediaDirectory;
    }

    /**
     * Get static directory
     *
     * @return \Magento\Framework\Filesystem\Directory\Write
     */
    public function getStaticDirectory()
    {
        return $this->staticDirectory;
    }

    /**
     * Get base url
     *
     * @return string
     */
    public function getBaseUrl()
    {
        return $this->baseUrl;
    }

    /**
     * Get base url for media
     *
     * @return string
     */
    public function getBaseMediaUrl()
    {
        return $this->baseMediaUrl;
    }

    /**
     * Get base url for static
     *
     * @return string
     */
    public function getBaseStaticUrl()
    {
        return $this->baseStaticUrl;
    }

    /**
     * Get HTML data (product list page)
     *
     * @param \Magento\Catalog\Model\Product $product
     * @param bool $isAssociatedProduct
     * @param array $mediaAttributeCodes
     * @return string
     */
    public function getHtmlData($product, $isAssociatedProduct = false, $mediaAttributeCodes = ['small_image'])
    {
        static $_html = [];
        $id = $product->getId();
        $key = implode('_', $mediaAttributeCodes);
        if (!isset($_html[$key])) {
            $_html[$key] = [];
        }
        $html = & $_html[$key];
        if (!isset($html[$id])) {
            $this->image360->params->setProfile('category');

            /** @var $listProductBlock \Magento\Catalog\Block\Product\ListProduct */
            $listProductBlock = $this->getListProductBlock();

            if (!$listProductBlock) {
                $listProductBlock = \Magento\Framework\App\ObjectManager::getInstance()->create(
                    \Magento\Catalog\Block\Product\ListProduct::class
                );
            }

            $styleAttr = '';
            if ($listProductBlock) {
                $isGridMode = ($listProductBlock->getMode() == 'grid');
                $mediaId = $isGridMode ? 'category_page_grid' : 'category_page_list';
                $productImage = $listProductBlock->getImage($product, $mediaId);
                $productImageWidth = $productImage->getWidth();
                $styleAttr = ($isGridMode ? '' : 'style="width: '.$productImageWidth.'px;"');
            } else {
                //$isGridMode = true;
                $mediaId = 'category_page_grid';
                //list($productImageWidth, ) = $this->imageToolboxGetSizes('thumb');
            }


            $images = $this->getGalleryData($product, $mediaId);
            if (!count($images)) {
                $anotherRenderer = $this->getAnotherRenderer();
                if ($anotherRenderer) {
                    if (strpos($anotherRenderer->getModuleName(), 'Codilar_') === 0) {
                        $html[$id] = $anotherRenderer->getCodilarHelper()->getHtmlData($product, $isAssociatedProduct, $mediaAttributeCodes);
                    } else {
                        $image = 'no_selection';
                        foreach ($mediaAttributeCodes as $mediaAttributeCode) {
                            $image = $product->getData($mediaAttributeCode);
                            if ($image && $image != 'no_selection') {
                                break;
                            }
                        }
                        if (!$image || $image == 'no_selection') {
                            $html[$id] = $isAssociatedProduct ? '' : $this->getPlaceholderHtml($product, $mediaId);
                            return $html[$id];
                        }

                        $img = $this->imageHelper->init($product, $mediaId, ['width' => null, 'height' => null])
                                 ->setImageFile($image)
                                 ->getUrl();

                        $iPath = $this->mediaDirectory->getAbsolutePath($product->getMediaConfig()->getMediaPath($image));
                        if (!is_file($iPath)) {
                            if (strpos($img, $this->baseMediaUrl) === 0) {
                                $iPath = str_replace($this->baseMediaUrl, '', $img);
                                $iPath = $this->mediaDirectory->getAbsolutePath($iPath);
                            } else {
                                $iPath = str_replace($this->baseStaticUrl, '', $img);
                                $iPath = $this->staticDirectory->getAbsolutePath($iPath);
                            }
                        }
                        try {
                            $originalSizeArray = getimagesize($iPath);
                        } catch (\Exception $exception) {
                            $originalSizeArray = [0, 0];
                        }

                        list($w, $h) = $this->imageToolboxGetSizes('thumb', $originalSizeArray);
                        $medium = $this->imageHelper->init($product, $mediaId, ['width' => $w, 'height' => $h])
                                ->setImageFile($image)
                                ->getUrl();

                        $html[$id] =
                            '<a href="'.$product->getProductUrl().'" class="product photo" tabindex="-1">'.//product-item-photo
                                '<img src="'.$medium.'"/>'.
                            '</a>';
                        $html[$id] = '<div class="CodilarContainer" '.$styleAttr.'>'.$html[$id].'</div>';

                    }
                    return $html[$id];
                }
                $html[$id] = $isAssociatedProduct ? '' : $this->getPlaceholderHtml($product, $mediaId);
                return $html[$id];
            }

            $columns = $this->getColumns($id);
            if ($columns > count($images)) {
                $columns = count($images);
            }
            $this->image360->params->setValue('columns', $columns);

            $html[$id] = $this->image360->getMainTemplate($images, ['id' => "Image360-category-{$id}"]);
            $html[$id] = '<div class="CodilarContainer" '.$styleAttr.'>'.$html[$id].'</div>';
        }

        return $html[$id];
    }

    /**
     * Retrieve another renderer
     *
     * @return mixed
     */
    public function getAnotherRenderer()
    {
        $data = $this->coreRegistry->registry('imagetoolbox_category');
        if ($data) {
            $skip = true;
            foreach ($data['renderers'] as $name => $renderer) {
                if ($name == 'configurable.image360') {
                    $skip = false;
                    continue;
                }
                if ($skip) {
                    continue;
                }
                if ($renderer) {
                    return $renderer;
                }
            }
        }
        return null;
    }

    /**
     * Get placeholder HTML
     *
     * @param \Magento\Catalog\Model\Product $product
     * @param string $mediaId
     * @return string
     */
    public function getPlaceholderHtml($product, $mediaId)
    {
        static $html = null;
        if ($html === null) {
            $placeholderUrl = $this->imageHelper->init($product, $mediaId)->getUrl();
            list($width, $height) = $this->imageToolboxGetSizes('thumb');
            $html = '<div class="CodilarContainer placeholder" style="width: '.$width.'px;height: '.$height.'px">'.
                    '<span class="align-helper"></span>'.
                    '<img src="'.$placeholderUrl.'"/>'.
                    '</div>';
        }
        return $html;
    }

    /**
     * Set product list block
     *
     * @param \Magento\Catalog\Block\Product\ListProduct $block
     */
    public function setListProductBlock(\Magento\Catalog\Block\Product\ListProduct $block)
    {
        $this->listProductBlock = $block;
    }

    /**
     * Get product list block
     *
     * @return \Magento\Catalog\Block\Product\ListProduct
     */
    public function getListProductBlock()
    {
        return $this->listProductBlock;
    }

    /**
     * Retrieve collection of Image360 gallery images
     *
     * @param \Magento\Catalog\Model\Product $product
     * @param string $mediaId
     * @return array
     */
    public function getGalleryData($product, $mediaId)
    {
        static $images = [];
        $id = $product->getId();
        if (!isset($images[$id])) {
            $images[$id] = [];
            $galleryModel = $this->modelGalleryFactory->create();
            $collection = $galleryModel->getCollection();
            $collection->addFieldToFilter('product_id', $id);
            $collection->addFieldToSelect('position');
            $collection->addFieldToSelect('file');
            if ($collection->count()) {
                $_images = $collection->getData();
                $compare = create_function('$a,$b', 'if ($a["position"] == $b["position"]) return 0; return (int)$a["position"] > (int)$b["position"] ? 1 : -1;');
                usort($_images, $compare);
                foreach ($_images as &$image) {

                    if (!$this->image360ImageHelper->fileExists($image['file'])) {
                        continue;
                    }

                    $image['img'] = $this->image360ImageHelper
                        ->init($product, $mediaId, ['width' => null, 'height' => null])
                        ->setImageFile($image['file'])
                        ->getUrl();

                    $originalSizeArray = $this->image360ImageHelper->getImageSizeArray();

                    if ($this->image360->params->checkValue('square-images', 'Yes')) {
                        $bigImageSize = ($originalSizeArray[0] > $originalSizeArray[1]) ? $originalSizeArray[0] : $originalSizeArray[1];
                        $image['img'] = $this->image360ImageHelper
                            ->init($product, $mediaId)
                            ->setImageFile($image['file'])
                            ->resize($bigImageSize)
                            ->getUrl();
                    }

                    list($w, $h) = $this->imageToolboxGetSizes('thumb', $originalSizeArray);
                    $image['medium'] = $this->image360ImageHelper
                        ->init($product, $mediaId, ['width' => $w, 'height' => $h])
                        ->setImageFile($image['file'])
                        ->getUrl();

                    $images[$id][] = $image;
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
    public function getColumns($id)
    {
        static $columns = [];
        if (!isset($columns[$id])) {
            $columnsModel = $this->modelColumnsFactory->create();
            $columnsModel->load($id);
            $_columns = $columnsModel->getData('columns');
            $columns[$id] = $_columns ? $_columns : 0;
        }
        return $columns[$id];
    }

    /**
     * Check if product has 360 images
     *
     * @param  int $id Product id
     * @return bool
     */
    public function hasImage360Media($id)
    {
        static $data = [];
        if (!isset($data[$id])) {
            $galleryModel = $this->modelGalleryFactory->create();
            $collection = $galleryModel->getCollection();
            $collection->addFieldToFilter('product_id', $id);
            $data[$id] = (bool)$collection->count();
        }
        return $data[$id];
    }

    /**
     * Retrieve image helper
     *
     * @return \Magento\Catalog\Helper\Image
     */
    public function getImageHelper()
    {
        return $this->imageHelper;
    }

    /**
     * Public method for retrieve statuses
     *
     * @param string $profile
     * @param bool $force
     * @return array
     */
    public function getStatuses($profile = false, $force = false)
    {
        static $result = null;
        if (is_null($result) || $force) {
            $result = [];
            $model = $this->modelConfigFactory->create();
            $collection = $model->getCollection();
            $collection->addFieldToFilter('platform', 0);
            $data = $collection->getData();
            foreach ($data as $key => $param) {
                if (!isset($result[$param['profile']])) {
                    $result[$param['profile']] = [];
                }
                $result[$param['profile']][$param['name']] = $param['status'];
            }
        }
        return isset($result[$profile]) ? $result[$profile] : $result;
    }

    /**
     * Public method for retrieve config map
     *
     * @return array
     */
    public function getConfigMap()
    {
        return unserialize('a:3:{s:7:"default";a:4:{s:7:"General";a:1:{i:0;s:28:"include-headers-on-all-pages";}s:9:"Image 360";a:23:{i:0;s:7:"magnify";i:1;s:15:"magnifier-width";i:2;s:15:"magnifier-shape";i:3;s:10:"fullscreen";i:4;s:4:"spin";i:5;s:18:"autospin-direction";i:6;s:12:"sensitivityX";i:7;s:12:"sensitivityY";i:8;s:15:"mousewheel-step";i:9;s:14:"autospin-speed";i:10;s:9:"smoothing";i:11;s:8:"autospin";i:12;s:14:"autospin-start";i:13;s:13:"autospin-stop";i:14;s:13:"initialize-on";i:15;s:12:"start-column";i:16;s:9:"start-row";i:17;s:11:"loop-column";i:18;s:8:"loop-row";i:19;s:14:"reverse-column";i:20;s:11:"reverse-row";i:21;s:16:"column-increment";i:22;s:13:"row-increment";}s:24:"Positioning and Geometry";a:3:{i:0;s:15:"thumb-max-width";i:1;s:16:"thumb-max-height";i:2;s:13:"square-images";}s:13:"Miscellaneous";a:8:{i:0;s:4:"icon";i:1;s:12:"show-message";i:2;s:7:"message";i:3;s:12:"loading-text";i:4;s:23:"fullscreen-loading-text";i:5;s:4:"hint";i:6;s:9:"hint-text";i:7;s:16:"mobile-hint-text";}}s:7:"product";a:4:{s:7:"General";a:1:{i:0;s:13:"enable-effect";}s:9:"Image 360";a:23:{i:0;s:7:"magnify";i:1;s:15:"magnifier-width";i:2;s:15:"magnifier-shape";i:3;s:10:"fullscreen";i:4;s:4:"spin";i:5;s:18:"autospin-direction";i:6;s:12:"sensitivityX";i:7;s:12:"sensitivityY";i:8;s:15:"mousewheel-step";i:9;s:14:"autospin-speed";i:10;s:9:"smoothing";i:11;s:8:"autospin";i:12;s:14:"autospin-start";i:13;s:13:"autospin-stop";i:14;s:13:"initialize-on";i:15;s:12:"start-column";i:16;s:9:"start-row";i:17;s:11:"loop-column";i:18;s:8:"loop-row";i:19;s:14:"reverse-column";i:20;s:11:"reverse-row";i:21;s:16:"column-increment";i:22;s:13:"row-increment";}s:24:"Positioning and Geometry";a:4:{i:0;s:12:"display-spin";i:1;s:15:"thumb-max-width";i:2;s:16:"thumb-max-height";i:3;s:13:"square-images";}s:13:"Miscellaneous";a:4:{i:0;s:4:"icon";i:1;s:12:"show-message";i:2;s:7:"message";i:3;s:4:"hint";}}s:8:"category";a:4:{s:7:"General";a:1:{i:0;s:13:"enable-effect";}s:9:"Image 360";a:23:{i:0;s:7:"magnify";i:1;s:15:"magnifier-width";i:2;s:15:"magnifier-shape";i:3;s:10:"fullscreen";i:4;s:4:"spin";i:5;s:18:"autospin-direction";i:6;s:12:"sensitivityX";i:7;s:12:"sensitivityY";i:8;s:15:"mousewheel-step";i:9;s:14:"autospin-speed";i:10;s:9:"smoothing";i:11;s:8:"autospin";i:12;s:14:"autospin-start";i:13;s:13:"autospin-stop";i:14;s:13:"initialize-on";i:15;s:12:"start-column";i:16;s:9:"start-row";i:17;s:11:"loop-column";i:18;s:8:"loop-row";i:19;s:14:"reverse-column";i:20;s:11:"reverse-row";i:21;s:16:"column-increment";i:22;s:13:"row-increment";}s:24:"Positioning and Geometry";a:3:{i:0;s:15:"thumb-max-width";i:1;s:16:"thumb-max-height";i:2;s:13:"square-images";}s:13:"Miscellaneous";a:4:{i:0;s:4:"icon";i:1;s:12:"show-message";i:2;s:7:"message";i:3;s:4:"hint";}}}');
    }
}
