<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/

namespace Codilar\Image360\Block\Adminhtml\Product\Edit\Image360\Gallery;

use Magento\Backend\Block\Media\Uploader;
use Magento\Framework\App\Filesystem\DirectoryList;
use Magento\Framework\Exception\FileSystemException;

/**
 * Image 360 gallery content
 *
 */
class Content extends \Magento\Backend\Block\Widget
{
    /**
     * @var string
     */
    protected $_template = 'Codilar_Image360::product/edit/image360/gallery.phtml';

    /**
     * @var \Codilar\Image360\Model\Product\Media\Config
     */
    protected $_mediaConfig;

    /**
     * @var \Magento\Framework\Json\EncoderInterface
     */
    protected $_jsonEncoder;

    /**
     * @param \Magento\Backend\Block\Template\Context $context
     * @param \Magento\Framework\Json\EncoderInterface $jsonEncoder
     * @param \Codilar\Image360\Model\Product\Media\Config $mediaConfig
     * @param array $data
     */
    public function __construct(
        \Magento\Backend\Block\Template\Context $context,
        \Magento\Framework\Json\EncoderInterface $jsonEncoder,
        \Codilar\Image360\Model\Product\Media\Config $mediaConfig,
        array $data = []
    ) {
        $this->_jsonEncoder = $jsonEncoder;
        $this->_mediaConfig = $mediaConfig;
        parent::__construct($context, $data);
    }

    /**
     * @return \Magento\Framework\View\Element\AbstractBlock
     */
    protected function _prepareLayout()
    {
        $this->addChild('uploader', 'Magento\Backend\Block\Media\Uploader', ['template' => 'Codilar_Image360::media/uploader.phtml']);

        $this->getUploader()->getConfig()->setUrl(
            $this->_urlBuilder->addSessionParam()->getUrl('image360/gallery/upload')
        )->setFileField(
            'image'
        )->setFilters(
            [
                'images' => [
                    'label' => __('Images (.gif, .jpg, .png)'),
                    'files' => ['*.gif', '*.jpg', '*.jpeg', '*.png'],
                ],
            ]
        );
        return parent::_prepareLayout();
    }

    /**
     * Retrieve uploader block
     *
     * @return Uploader
     */
    public function getUploader()
    {
        return $this->getChildBlock('uploader');
    }

    /**
     * Retrieve uploader block html
     *
     * @return string
     */
    public function getUploaderHtml()
    {
        return $this->getChildHtml('uploader');
    }

    /**
     * @return string
     */
    public function getJsObjectName()
    {
        return $this->getHtmlId() . 'JsObject';
    }

    /**
     * @return string
     */
    public function getImagesJson()
    {
        $imagesValue = $this->getElement()->getImages();
        if (is_array($imagesValue) && count($imagesValue)) {
            $directory = $this->_filesystem->getDirectoryRead(DirectoryList::MEDIA);
            foreach ($imagesValue as &$image) {
                $image['url'] = $this->_mediaConfig->getMediaUrl($image['file']);
                try {
                    $fileHandler = $directory->stat($this->_mediaConfig->getMediaPath($image['file']));
                    $image['size'] = $fileHandler['size'];
                } catch (FileSystemException $e) {
                    $image['url'] = $this->getImageHelper()->getDefaultPlaceholderUrl('small_image');
                    $image['size'] = 0;
                    $this->_logger->warning($e);
                }
            }
            return $this->_jsonEncoder->encode($imagesValue);
        }
        return '[]';
    }

    /**
     * @return \Magento\Catalog\Helper\Image
     * @deprecated
     */
    private function getImageHelper()
    {
        static $imageHelper = null;
        if ($imageHelper === null) {
            $imageHelper = \Magento\Framework\App\ObjectManager::getInstance()
                ->get('Magento\Catalog\Helper\Image');
        }
        return $imageHelper;
    }
}
