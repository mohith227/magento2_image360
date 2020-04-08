<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/
namespace Codilar\Image360\Model\View\Asset\Image;

/**
 * A basic path context for assets that includes a directory path
 */
class Context implements \Magento\Framework\View\Asset\ContextInterface
{
    /**
     * @var \Magento\Framework\Filesystem\Directory\WriteInterface
     */
    private $mediaDirectory;

    /**
     * @var \Magento\Catalog\Model\Product\Media\ConfigInterface
     */
    private $mediaConfig;

    /**
     * @var \Magento\Framework\Filesystem
     */
    private $filesystem;

    /**
     * Context constructor
     *
     * @param \Magento\Catalog\Model\Product\Media\ConfigInterface $mediaConfig
     * @param \Magento\Framework\Filesystem $filesystem
     */
    public function __construct(
        \Magento\Catalog\Model\Product\Media\ConfigInterface $mediaConfig,
        \Magento\Framework\Filesystem $filesystem
    ) {
        $this->mediaConfig = $mediaConfig;
        $this->filesystem = $filesystem;
        $this->mediaDirectory = $this->filesystem->getDirectoryWrite(\Magento\Framework\App\Filesystem\DirectoryList::MEDIA);
        $this->mediaDirectory->create($this->mediaConfig->getBaseMediaPath());
    }

    /**
     * Get context path of an asset
     *
     * @return string
     */
    public function getPath()
    {
        return $this->mediaDirectory->getAbsolutePath($this->mediaConfig->getBaseMediaPath());
    }

    /**
     * Get base URL
     *
     * @return string
     */
    public function getBaseUrl()
    {
        return $this->mediaConfig->getBaseMediaUrl();
    }
}
