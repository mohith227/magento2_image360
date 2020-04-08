<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/


namespace Codilar\Image360\Model\Product\Media;

/**
 * Image 360 media config
 *
 */
class Config extends \Magento\Catalog\Model\Product\Media\Config
{
    /**
     * Filesystem directory path of 360 images relatively to media folder
     *
     * @return string
     */
    public function getBaseMediaPathAddition()
    {
        return 'image360';
    }

    /**
     * Web-based directory path of 360 images relatively to media folder
     *
     * @return string
     */
    public function getBaseMediaUrlAddition()
    {
        return 'image360';
    }

    /**
     * @return string
     */
    public function getBaseMediaPath()
    {
        return 'image360';
    }

    /**
     * @return string
     */
    public function getBaseMediaUrl()
    {
        return $this->storeManager->getStore()->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA) . 'image360';
    }
}
