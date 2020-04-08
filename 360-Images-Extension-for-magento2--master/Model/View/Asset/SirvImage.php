<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/
namespace Codilar\Image360\Model\View\Asset;

/**
 * Image file asset
 *
 */
class SirvImage extends \Codilar\Image360\Model\View\Asset\Image
{
    /**
     * Placeholder path
     *
     * @var string
     */
    private $placeholder = 'Magento_Catalog::images/product/placeholder/%s.jpg';

    /**
     * File path
     *
     * @var string
     */
    private $filePath;

    /**
     * Content type
     *
     * @var string
     */
    private $contentType = 'image';

    /**
     * Misc params
     *
     * @var array
     */
    private $miscParams;

    /**
     * Media config
     *
     * @var \Magento\Catalog\Model\Product\Media\ConfigInterface
     */
    private $mediaConfig;

    /**
     * Encryptor
     *
     * @var \Magento\Framework\Encryption\EncryptorInterface
     */
    private $encryptor;

    /**
     * Asset repo
     *
     * @var \Magento\Framework\View\Asset\Repository
     */
    private $assetRepo;

    /**
     * @var \Magento\Framework\Filesystem\Directory\WriteInterface
     */
    private $mediaDirectory;

    /**
     * Image constructor
     *
     * @param \Magento\Catalog\Model\Product\Media\ConfigInterface $mediaConfig
     * @param \Magento\Framework\Encryption\EncryptorInterface $encryptor
     * @param string $filePath
     * @param \Magento\Framework\View\Asset\Repository $assetRepo
     * @param \Magento\Framework\Filesystem $filesystem
     * @param array $miscParams
     */
    public function __construct(
        \Magento\Catalog\Model\Product\Media\ConfigInterface $mediaConfig,
        \Magento\Framework\Encryption\EncryptorInterface $encryptor,
        $filePath,
        \Magento\Framework\View\Asset\Repository $assetRepo,
        \Magento\Framework\Filesystem $filesystem,
        array $miscParams = []
    ) {
        $this->mediaConfig = $mediaConfig;
        $this->filePath = $filePath;
        $this->miscParams = $miscParams;
        $this->encryptor = $encryptor;
        $this->assetRepo = $assetRepo;
        $this->mediaDirectory = $filesystem->getDirectoryWrite(\Magento\Framework\App\Filesystem\DirectoryList::MEDIA);
        $this->mediaDirectory->create($this->mediaConfig->getBaseMediaPath());
    }

    /**
     * Get URL
     *
     * @return string
     */
    public function getUrl()
    {
        if ($this->getFilePath()) {
            return $this->mediaConfig->getBaseMediaUrl() . $this->getRelativePath(DIRECTORY_SEPARATOR);
        }
        return $this->getDefaultPlaceHolderUrl();
    }

    /**
     * Get relative URL
     *
     * @return string
     */
    public function getRelativeUrl()
    {
        if ($this->getFilePath()) {
            return $this->mediaConfig->getBaseMediaUrlAddition('catalog/product') . $this->getRelativePath(DIRECTORY_SEPARATOR);
        }
        return $this->getPlaceHolder();
    }

    /**
     * Get content type
     *
     * @return string
     */
    public function getContentType()
    {
        return $this->contentType;
    }

    /**
     * Get a relative path to the asset file
     *
     * @return string
     */
    public function getPath()
    {
        if ($this->getFilePath()) {
            return $this->getRelativePath($this->mediaDirectory->getAbsolutePath($this->mediaConfig->getBaseMediaPath()));
        }
        $asset = $this->assetRepo->createAsset($this->getPlaceHolder());
        return $asset->getSourceFile();
    }

    /**
     * Subroutine for building path
     *
     * @param string $path
     * @param string $item
     * @return string
     */
    private function joinPaths($path, $item)
    {
        return trim($path . ($item ? DIRECTORY_SEPARATOR . ltrim($item, DIRECTORY_SEPARATOR) : ''), DIRECTORY_SEPARATOR);
    }

    /**
     * Get original source file path
     *
     * @return string
     */
    public function getSourceFile()
    {
        return $this->mediaConfig->getBaseMediaPath() . DIRECTORY_SEPARATOR . ltrim($this->filePath, DIRECTORY_SEPARATOR);
    }

    /**
     * Get source content type
     *
     * @return string
     */
    public function getSourceContentType()
    {
        return $this->contentType;
    }

    /**
     * Get content of a local asset
     *
     * @return string
     */
    public function getContent()
    {
        return null;
    }

    /**
     * Get relative path to file
     *
     * @return string
     */
    public function getFilePath()
    {
        return $this->filePath;
    }

    /**
     * Get the module context of file path
     *
     * @return string
     */
    public function getModule()
    {
        return 'cache';
    }

    /**
     * Retrieve part of path based on misc params
     *
     * @return string
     */
    private function getMiscPath()
    {
        return $this->encryptor->hash(implode('_', $this->miscParams), \Magento\Framework\Encryption\Encryptor::HASH_VERSION_MD5);
    }

    /**
     * Get placeholder for asset creation
     *
     * @return string
     */
    private function getPlaceHolder()
    {
        return sprintf($this->placeholder, $this->miscParams['image_type']);
    }

    /**
     * Return default placeholder URL
     *
     * @return string
     */
    private function getDefaultPlaceHolderUrl()
    {
        return $this->assetRepo->getUrl($this->getPlaceHolder());
    }

    /**
     * Generate relative path
     *
     * @param string $result
     * @return string
     */
    private function getRelativePath($result)
    {
        $result = $this->joinPaths($result, $this->getModule());
        $result = $this->joinPaths($result, $this->getMiscPath());
        $result = $this->joinPaths($result, $this->getFilePath());
        return DIRECTORY_SEPARATOR . $result;
    }
}
