<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/
namespace Codilar\Image360\Model\Product;

/**
 * Sirv link model
 *
 */
class SirvImage extends \Codilar\Image360\Model\Product\Image
{
    /**
     * @var \Codilar\Sirv\Model\View\Asset\ImageFactory
     */
    protected $mtViewAssetImageFactory = null;

    /**
     * @var \Magento\Catalog\Model\View\Asset\PlaceholderFactory
     */
    protected $mtViewAssetPlaceholderFactory = null;

    /**
     * @var \Codilar\Sirv\Model\View\Asset\Image
     */
    protected $mtImageAsset = null;

    /**
     * @var \Magento\Catalog\Model\Product\Image\ParamsBuilder
     */
    protected $mtParamsBuilder = null;

    /**
     * @var \Magento\Catalog\Model\Product\Image\SizeCache
     */
    protected $mtSizeCache = null;

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
     * Sirv adapter
     *
     * @var \Codilar\Sirv\Model\Adapter\S3
     */
    protected $sirvAdapter = null;

    /**
     * Media directory absolute path
     *
     * @var string
     */
    protected $mediaDirectoryAbsolutePath = '';

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

        $helper = $objectManager->get(\Codilar\Sirv\Helper\Data::class);
        $this->isSirvEnabled = $helper->isSirvEnabled();
        $this->useSirvImageProcessing = $helper->useSirvImageProcessing();

        $this->sirvAdapter = $objectManager->get(\Codilar\Sirv\Model\Adapter\S3::class);

        //NOTE: for versions 2.0.x (x >= 17), 2.1.6, 2.2.x (x >= 0)
        if (property_exists('\Magento\Catalog\Model\Product\Image', 'viewAssetImageFactory')) {
            $this->mtViewAssetImageFactory = $objectManager->get(\Codilar\Sirv\Model\View\Asset\ImageFactory::class);
            $this->mtViewAssetPlaceholderFactory = $objectManager->get(\Magento\Catalog\Model\View\Asset\PlaceholderFactory::class);
        }

        $filesystem = $objectManager->get(\Magento\Framework\Filesystem::class);
        $mediaDirectory = $filesystem->getDirectoryWrite(\Magento\Framework\App\Filesystem\DirectoryList::MEDIA);
        $this->mediaDirectoryAbsolutePath = $mediaDirectory->getAbsolutePath();

        //NOTE: memory check is not performed since version 2.2.4
        $this->doCheckMemory = method_exists($this, '_checkMemory');
    }

    /**
     * @return MagentoImage
     */
    public function getImageProcessor()
    {
        if (!$this->_processor) {
            parent::getImageProcessor();
            if ($this->isSirvEnabled && $this->useSirvImageProcessing) {
                $this->_processor->setMediaDirectoryAbsolutePath($this->mediaDirectoryAbsolutePath);
            }
        }
        return $this->_processor;
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
        if (!$this->isSirvEnabled) {
            return parent::setBaseFile($file);
        }

        if (!property_exists('\Magento\Catalog\Model\Product\Image', 'viewAssetImageFactory')) {
            //NOTE: for versions 2.0.x (x < 17), 2.1.x (x != 6)
            return parent::setBaseFile($file);
        }

        $this->_isBaseFilePlaceholder = false;

        $this->mtImageAsset = $this->mtViewAssetImageFactory->create(
            [
                'miscParams' => $this->mtGetMiscParams(),
                'filePath' => $file,
                'mediaConfig' => $this->imageToolboxMediaConfig,
            ]
        );

        if ($file == 'no_selection' || !$this->_fileExists($this->mtImageAsset->getSourceFile())
            || $this->doCheckMemory && !$this->_checkMemory($this->mtImageAsset->getSourceFile())
        ) {
            $this->_isBaseFilePlaceholder = true;
            $this->mtImageAsset = $this->mtViewAssetPlaceholderFactory->create(
                [
                    'type' => $this->getDestinationSubdir(),
                ]
            );
        }

        $this->_baseFile = $this->mtImageAsset->getSourceFile();

        //NOTE: fix path to placeholder
        if ($this->_isBaseFilePlaceholder) {
            $path = $this->mtImageAsset->getContext()->getPath();
            $relPath = $this->_catalogProductMediaConfig->getBaseMediaPath();
            $this->_baseFile = preg_replace('#^'.preg_quote($path, '#').'#', $relPath, $this->_baseFile);
        }

        return $this;
    }

    /**
     * Save image file
     *
     * @return $this
     */
    public function saveFile()
    {
        if (!$this->isSirvEnabled) {
            return parent::saveFile();
        }

        if (property_exists('\Magento\Catalog\Model\Product\Image', 'viewAssetImageFactory')) {
            if ($this->_isBaseFilePlaceholder) {
                return $this;
            }
            $filename = $this->getBaseFile() ? $this->mtImageAsset->getPath() : null;
            if ($this->useSirvImageProcessing) {
                $_fileName = $this->_baseFile;
            } else {
                $mediaPath = $this->_mediaDirectory->getAbsolutePath();
                $_fileName = preg_replace('#^'.preg_quote($mediaPath, '#').'#', '', $filename);
            }

            try {
                $this->getImageProcessor()->save($_fileName);
            } catch (\Exception $e) {
                throw new \Exception('Could not save image file. '.$e->getMessage());
            }

            //NOTE: can't save file because it doesn't exist on filesystem
            //$this->_coreFileStorageDatabase->saveFile($filename);

            if (class_exists('\Magento\Catalog\Model\Product\Image\SizeCache')) {
                //NOTE: for version 2.1.6 (in version 2.2.0 these classes do not exist)
                $this->mtGetSizeCache()->save(
                    $this->getWidth(),
                    $this->getHeight(),
                    $this->mtImageAsset->getPath()
                );
            }
        } else {
            //NOTE: for versions 2.0.x (x < 17), 2.1.x (x != 6)

            if ($this->_isBaseFilePlaceholder && $this->_newFile === true) {
                return $this;
            }
            $filename = $this->_mediaDirectory->getAbsolutePath($this->getNewFile());
            if ($this->useSirvImageProcessing) {
                $_fileName = $this->_baseFile;
            } else {
                $_fileName = $this->_newFile;
            }

            $this->getImageProcessor()->save($_fileName);

            //NOTE: can't save file because it doesn't exist on filesystem
            //$this->_coreFileStorageDatabase->saveFile($filename);

            return $this;
        }
        return $this;
    }

    /**
     * @return \Magento\Catalog\Model\Product\Image\SizeCache
     */
    protected function mtGetSizeCache()
    {
        if ($this->mtSizeCache == null) {
            $this->mtSizeCache = \Magento\Framework\App\ObjectManager::getInstance()->get(
                \Magento\Catalog\Model\Product\Image\SizeCache::class
            );
        }
        return $this->mtSizeCache;
    }

    /**
     * @return string
     */
    public function getUrl()
    {
        if (!$this->isSirvEnabled) {
            return parent::getUrl();
        }
        if (property_exists('\Magento\Catalog\Model\Product\Image', 'viewAssetImageFactory')) {
            if ($this->_isBaseFilePlaceholder) {
                return $this->mtImageAsset->getUrl();
            }
            if ($this->useSirvImageProcessing) {
                $url = $this->sirvAdapter->getUrl($this->_baseFile);
                $url .= $this->getImageProcessor()->getImagingOptionsQuery();
            } else {
                $url = $this->mtImageAsset->getUrl();
                $mediaUrl = $this->_storeManager->getStore()->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA);
                $url = preg_replace('#^'.preg_quote($mediaUrl, '#').'#', '', $url);
                $url = $this->sirvAdapter->getUrl($url);
            }
        } else {
            //NOTE: for versions 2.0.x (x < 17), 2.1.x (x != 6)

            if ($this->_newFile === true) {
                $url = $this->_assetRepo->getUrl(
                    "Magento_Catalog::images/product/placeholder/{$this->getDestinationSubdir()}.jpg"
                );
                return $url;
            }
            if ($this->useSirvImageProcessing) {
                $url = $this->sirvAdapter->getUrl($this->_baseFile);
                $url .= $this->getImageProcessor()->getImagingOptionsQuery();
            } else {
                $url = $this->sirvAdapter->getUrl($this->_newFile);
            }
        }
        return $url;
    }

    /**
     * @return bool|void
     */
    public function isCached()
    {
        if ($this->isSirvEnabled) {
            if ($this->useSirvImageProcessing) {
                return $this->sirvAdapter->fileExists($this->_baseFile);
            } else {
                if (property_exists('\Magento\Catalog\Model\Product\Image', 'viewAssetImageFactory')) {
                    $filename = $this->mtImageAsset->getPath();
                    $mediaPath = $this->_mediaDirectory->getAbsolutePath();
                    $filename = preg_replace('#^'.preg_quote($mediaPath, '#').'#', '', $filename);
                    return $this->sirvAdapter->fileExists($filename);
                } else {
                    //NOTE: for versions 2.0.x (x < 17), 2.1.x (x != 6)
                    return $this->sirvAdapter->fileExists($this->_newFile);
                }
            }
        }
        return parent::isCached();
    }

    /**
     * @return void
     */
    public function clearCache()
    {
        parent::clearCache();
        if ($this->isSirvEnabled) {
            $this->sirvAdapter->clearCache();
        }
    }

    /**
     * Return resized product image information
     *
     * @return array
     */
    public function getResizedImageInfo()
    {
        if ($this->isSirvEnabled) {
            //NOTICE: we can't get image info without downloading it
            if (property_exists('\Magento\Catalog\Model\Product\Image', 'viewAssetImageFactory')) {
                if ($this->isBaseFilePlaceholder() == true) {
                    $image = $this->mtImageAsset->getSourceFile();
                    return getimagesize($image);
                } else {
                    if ($this->useSirvImageProcessing) {
                        $filename = $this->mtImageAsset->getSourceFile();
                    } else {
                        $filename = $this->mtImageAsset->getPath();
                        $mediaPath = $this->_mediaDirectory->getAbsolutePath();
                        $filename = preg_replace('#^'.preg_quote($mediaPath, '#').'#', '', $filename);
                    }
                    return $this->sirvAdapter->getImageInfo($filename);
                }
            } else {
                //NOTE: for versions 2.0.x (x < 17), 2.1.x (x != 6)
                if ($this->_newFile !== true) {
                    if ($this->useSirvImageProcessing) {
                        $filename = $this->_baseFile;
                    } else {
                        $mediaPath = $this->_mediaDirectory->getAbsolutePath();
                        $filename = preg_replace('#^'.preg_quote($mediaPath, '#').'#', '', $this->_newFile);
                    }
                    return $this->sirvAdapter->getImageInfo($filename);
                }
            }
        }
        return parent::getResizedImageInfo();
    }

    /**
     * @return \Magento\Catalog\Model\Product\Image\ParamsBuilder
     */
    protected function mtGetParamsBuilder()
    {
        if ($this->mtParamsBuilder == null) {
            $this->mtParamsBuilder = \Magento\Framework\App\ObjectManager::getInstance()->get(
                \Magento\Catalog\Model\Product\Image\ParamsBuilder::class
            );
        }
        return $this->mtParamsBuilder;
    }

    /**
     * Retrieve misc params based on all image attributes
     *
     * @return array
     * @SuppressWarnings(PHPMD.NPathComplexity)
     */
    protected function mtGetMiscParams()
    {
        if (class_exists('\Magento\Catalog\Model\Product\Image\ParamsBuilder')) {
            //NOTE: for version 2.1.6 (in version 2.2.0 these classes do not exist)
            return $this->mtGetParamsBuilder()->build(
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
