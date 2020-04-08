<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/
namespace Codilar\Image360\Model\Product;

use Magento\Framework\App\Filesystem\DirectoryList;

/**
 * Image360 image model
 *
 */
class Image extends \Magento\Catalog\Model\Product\Image
{
    /**
     * Catalog product media config
     *
     * @var \Magento\Catalog\Model\Product\Media\Config
     */
    protected $originalMediaConfig;

    /**
     * Image360 media config
     *
     * @var \Codilar\Image360\Model\Product\Media\Config
     */
    protected $imageToolboxMediaConfig;

    /**
     * @var \Magento\Framework\Filesystem\Directory\WriteInterface
     */
    protected $rootDirectory;

    /**
     * @var \Codilar\Image360\Model\View\Asset\ImageFactory
     */
    protected $imageToolboxViewAssetImageFactory;

    /**
     * @var \Magento\Catalog\Model\View\Asset\PlaceholderFactory
     */
    protected $imageToolboxViewAssetPlaceholderFactory;

    /**
     * @var \Codilar\Image360\Model\View\Asset\Image
     */
    protected $imageToolboxImageAsset;

    /**
     * @var \Magento\Catalog\Model\Product\Image\ParamsBuilder
     */
    protected $imageToolboxParamsBuilder;

    /**
     * @var \Magento\Catalog\Model\Product\Image\SizeCache
     */
    protected $imageToolboxSizeCache;

    /**
     * @var \Magento\Framework\View\Asset\ContextInterface
     */
    protected $context;

    /**
     * Whether to check the memory or not
     *
     * @var bool
     */
    protected $doCheckMemory = false;

    /**
     * Model construct for object initialization
     *
     * @return void
     */
    protected function _construct()
    {
        parent::_construct();

        $objectManager = \Magento\Framework\App\ObjectManager::getInstance();

        $configFactory = $objectManager->get(\Codilar\Image360\Model\Product\Media\ConfigFactory::class);

        $filesystem = $objectManager->get(\Magento\Framework\FilesystemFactory::class)->create();

        if (property_exists('\Magento\Catalog\Model\Product\Image', 'viewAssetImageFactory')) {
            //NOTE: for versions 2.0.x (x >= 17), 2.1.6, 2.2.x (x >= 0)
            /** @var \Codilar\Image360\Model\Product\Media\Config */
            $this->imageToolboxMediaConfig = $configFactory->create();
            $this->imageToolboxViewAssetImageFactory = $objectManager->get(
                \Codilar\Image360\Model\View\Asset\ImageFactory::class
            );
            $this->imageToolboxViewAssetPlaceholderFactory = $objectManager->get(
                \Magento\Catalog\Model\View\Asset\PlaceholderFactory::class
            );
            if (class_exists('\Magento\Catalog\Model\Product\Image\ParamsBuilder')) {
                //NOTE: for version 2.1.6 (in version 2.2.0 these classes do not exist)
                $this->imageToolboxParamsBuilder = $objectManager->get(
                    \Magento\Catalog\Model\Product\Image\ParamsBuilder::class
                );
                $this->imageToolboxSizeCache = $objectManager->get(
                    \Magento\Catalog\Model\Product\Image\SizeCache::class
                );
            }
            $this->context = $objectManager->create(
                \Codilar\Image360\Model\View\Asset\Image\Context::class,
                [
                    'mediaConfig' => $this->imageToolboxMediaConfig,
                    'filesystem' => $filesystem
                ]
            );
        } else {
            //NOTE: for versions 2.0.x (x < 17), 2.1.x (x != 6)
            $this->originalMediaConfig = $this->_catalogProductMediaConfig;
            /** @var \Codilar\Image360\Model\Product\Media\Config */
            $this->imageToolboxMediaConfig = $this->_catalogProductMediaConfig = $configFactory->create();
            $this->_mediaDirectory = $filesystem->getDirectoryWrite(DirectoryList::MEDIA);
            $this->_mediaDirectory->create($this->imageToolboxMediaConfig->getBaseMediaPath());
        }
        //NOTE: we need this to copy 360 icon in any version
        $this->rootDirectory = $filesystem->getDirectoryWrite(DirectoryList::ROOT);

        $this->doCheckMemory = method_exists($this, '_checkMemory');
    }

    /**
     * Get relative watermark file path
     * or false if file not found
     *
     * @return string | bool
     */
    protected function _getWatermarkFilePath()
    {
        if (property_exists('\Magento\Catalog\Model\Product\Image', 'viewAssetImageFactory')) {
            //NOTE: for versions 2.0.x (x >= 17), 2.1.6, 2.2.x (x >= 0)
            return parent::_getWatermarkFilePath();
        }

        $filePath = false;

        if (!($file = $this->getWatermarkFile())) {
            return $filePath;
        }
        $baseDir = $this->originalMediaConfig->getBaseMediaPath();

        $candidates = [
            $baseDir . '/watermark/stores/' . $this->_storeManager->getStore()->getId() . $file,
            $baseDir . '/watermark/websites/' . $this->_storeManager->getWebsite()->getId() . $file,
            $baseDir . '/watermark/default/' . $file,
            $baseDir . '/watermark/' . $file,
        ];
        foreach ($candidates as $candidate) {
            if ($this->_mediaDirectory->isExist($candidate)) {
                $filePath = $this->_mediaDirectory->getAbsolutePath($candidate);
                break;
            }
        }
        if (!$filePath) {
            $filePath = $this->_viewFileSystem->getStaticFileName($file);
        }

        return $filePath;
    }

    /**
     * Get media directory
     *
     * @return \Magento\Framework\Filesystem\Directory\Write
     */
    public function getMediaDirectory()
    {
        return $this->_mediaDirectory ? $this->_mediaDirectory : null;
    }

    /**
     * Get root directory
     *
     * @return \Magento\Framework\Filesystem\Directory\Write
     */
    public function getRootDirectory()
    {
        return $this->rootDirectory ? $this->rootDirectory : null;
    }

    /**
     * Check if file exists
     *
     * @param string $filename
     * @return bool
     */
    public function fileExists($filename)
    {
        $baseDir = $this->imageToolboxMediaConfig->getBaseMediaPath();
        return $this->_fileExists($baseDir.$filename);
    }

    /**
     * Retrieve original image size
     * 0 - width, 1 - height
     *
     * @return int[]
     */
    public function getImageSizeArray()
    {
        if ($this->getBaseFile()) {
            $filename = $this->_mediaDirectory->getAbsolutePath($this->getBaseFile());
            list($imageWidth, $imageHeight) = getimagesize($filename);
        } else {
            return [null, null];
        }
        return [$imageWidth, $imageHeight];
    }

    /**
     * Set filenames for base file and new file
     *
     * @param string $file
     * @return $this
     * @throws \Exception
     */
    public function setBaseFile($file)
    {
        if (!property_exists('\Magento\Catalog\Model\Product\Image', 'viewAssetImageFactory')) {
            //NOTE: for versions 2.0.x (x < 17), 2.1.x (x != 6)
            return parent::setBaseFile($file);
        }

        //NOTE: for versions 2.0.x (x >= 17), 2.1.6, 2.2.x (x >= 0)
        $this->_isBaseFilePlaceholder = false;

        $this->imageToolboxImageAsset = $this->imageToolboxViewAssetImageFactory->create(
            [
                'mediaConfig' => $this->imageToolboxMediaConfig,
                'context' => $this->context,
                'miscParams' => $this->imageToolboxGetMiscParams(),
                'filePath' => $file,
            ]
        );

        if ($file == 'no_selection' || !$this->_fileExists($this->imageToolboxImageAsset->getSourceFile())
            || $this->doCheckMemory && !$this->_checkMemory($this->imageToolboxImageAsset->getSourceFile())
        ) {
            $this->_isBaseFilePlaceholder = true;
            $this->imageToolboxImageAsset = $this->imageToolboxViewAssetPlaceholderFactory->create(
                [
                    'type' => $this->getDestinationSubdir(),
                ]
            );
        }

        $this->_baseFile = $this->imageToolboxImageAsset->getSourceFile();

        return $this;
    }

    /**
     * Save image file
     *
     * @return $this
     */
    public function saveFile()
    {
        if (!property_exists('\Magento\Catalog\Model\Product\Image', 'viewAssetImageFactory')) {
            //NOTE: for versions 2.0.x (x < 17), 2.1.x (x != 6)
            return parent::saveFile();
        }

        //NOTE: for versions 2.0.x (x >= 17), 2.1.6, 2.2.x (x >= 0)
        if ($this->_isBaseFilePlaceholder) {
            return $this;
        }
        $filename = $this->getBaseFile() ? $this->imageToolboxImageAsset->getPath() : null;
        $this->getImageProcessor()->save($filename);
        $this->_coreFileStorageDatabase->saveFile($filename);
        if (isset($this->imageToolboxSizeCache)) {
            //NOTE: for version 2.1.6
            $this->imageToolboxSizeCache->save(
                $this->getWidth(),
                $this->getHeight(),
                $this->imageToolboxImageAsset->getPath()
            );
        }

        return $this;
    }

    /**
     * @return string
     */
    public function getUrl()
    {
        if (!property_exists('\Magento\Catalog\Model\Product\Image', 'viewAssetImageFactory')) {
            //NOTE: for versions 2.0.x (x < 17), 2.1.x (x != 6)
            return parent::getUrl();
        }
        return $this->imageToolboxImageAsset->getUrl();
    }

    /**
     * @return bool|void
     */
    public function isCached()
    {
        if (!property_exists('\Magento\Catalog\Model\Product\Image', 'viewAssetImageFactory')) {
            //NOTE: for versions 2.0.x (x < 17), 2.1.x (x != 6)
            return parent::isCached();
        }
        return file_exists($this->imageToolboxImageAsset->getPath());
    }

    /**
     * Return resized product image information
     *
     * @return array
     */
    public function getResizedImageInfo()
    {
        if (!property_exists('\Magento\Catalog\Model\Product\Image', 'viewAssetImageFactory')) {
            //NOTE: for versions 2.0.x (x < 17), 2.1.x (x != 6)
            return parent::getResizedImageInfo();
        }
        if ($this->isBaseFilePlaceholder() == true) {
            $image = $this->imageToolboxImageAsset->getSourceFile();
        } else {
            $image = $this->imageToolboxImageAsset->getPath();
        }

        return getimagesize($image);
    }

    /**
     * Retrieve misc params based on all image attributes
     *
     * @return array
     * @SuppressWarnings(PHPMD.NPathComplexity)
     */
    private function imageToolboxGetMiscParams()
    {
        if (isset($this->imageToolboxParamsBuilder)) {
            //NOTE: for version 2.1.6
            return $this->imageToolboxParamsBuilder->build(
                [
                    'type' => $this->getDestinationSubdir(),
                    'width' => $this->getWidth(),
                    'height' => $this->getHeight(),
                    'frame' => $this->_keepFrame,
                    'constrain' => $this->_constrainOnly,
                    'aspect_ratio' => $this->_keepAspectRatio,
                    'transparency' => $this->_keepTransparency,
                    'background' => $this->_backgroundColor,
                    'angle' => $this->_angle,
                    'quality' => $this->_quality
                ]
            );
        } else {
            //NOTE: for version 2.2.0
            $miscParams = [
                'image_type' => $this->getDestinationSubdir(),
                'image_height' => $this->getHeight(),
                'image_width' => $this->getWidth(),
                'keep_aspect_ratio' => ($this->_keepAspectRatio ? '' : 'non') . 'proportional',
                'keep_frame' => ($this->_keepFrame ? '' : 'no') . 'frame',
                'keep_transparency' => ($this->_keepTransparency ? '' : 'no') . 'transparency',
                'constrain_only' => ($this->_constrainOnly ? 'do' : 'not') . 'constrainonly',
                'background' => $this->_rgbToString($this->_backgroundColor),
                'angle' => $this->_angle,
                'quality' => $this->_quality,
            ];
            if ($this->getWatermarkFile()) {
                $miscParams['watermark_file'] = $this->getWatermarkFile();
                $miscParams['watermark_image_opacity'] = $this->getWatermarkImageOpacity();
                $miscParams['watermark_position'] = $this->getWatermarkPosition();
                $miscParams['watermark_width'] = $this->getWatermarkWidth();
                $miscParams['watermark_height'] = $this->getWatermarkHeight();
            }
            return $miscParams;
        }
    }
}
