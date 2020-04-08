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
class Image
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
     * Context
     *
     * @var \Magento\Framework\View\Asset\ContextInterface
     */
    private $context;

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
     * Image constructor
     *
     * @param \Magento\Catalog\Model\Product\Media\ConfigInterface $mediaConfig
     * @param \Magento\Framework\View\Asset\ContextInterface $context
     * @param \Magento\Framework\Encryption\EncryptorInterface $encryptor
     * @param string $filePath
     * @param \Magento\Framework\View\Asset\Repository $assetRepo
     * @param array $miscParams
     */
    public function __construct(
        \Magento\Catalog\Model\Product\Media\ConfigInterface $mediaConfig,
        \Magento\Framework\View\Asset\ContextInterface $context,
        \Magento\Framework\Encryption\EncryptorInterface $encryptor,
        $filePath,
        \Magento\Framework\View\Asset\Repository $assetRepo,
        array $miscParams = []
    ) {
        $this->mediaConfig = $mediaConfig;
        $this->context = $context;
        $this->filePath = $filePath;
        $this->miscParams = $miscParams;
        $this->encryptor = $encryptor;
        $this->assetRepo = $assetRepo;
    }

    /**
     * Get URL
     *
     * @return string
     */
    public function getUrl()
    {
        if ($this->getFilePath()) {
            return $this->context->getBaseUrl() . $this->getRelativePath(DIRECTORY_SEPARATOR);
        }
        return $this->getDefaultPlaceHolderUrl();
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
            return $this->getRelativePath($this->context->getPath());
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
    private function join($path, $item)
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
     * Get context of the asset
     *
     * @return \Magento\Framework\View\Asset\ContextInterface
     */
    public function getContext()
    {
        return $this->context;
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
        $result = $this->join($result, $this->getModule());
        $result = $this->join($result, $this->getMiscPath());
        $result = $this->join($result, $this->getFilePath());
        return DIRECTORY_SEPARATOR . $result;
    }
}
