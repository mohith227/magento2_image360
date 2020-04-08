<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/
namespace Codilar\Image360\Model;

/**
 * Image handler
 *
 */
class Image extends \Magento\Framework\Image
{
    /**
     * Retrieve original image width
     *
     * @return int|null
     */
    public function getOriginalWidth()
    {
        if (isset($this->_fileName)) {
            return $this->_adapter->getOriginalWidth();
        }
        return null;
    }

    /**
     * Retrieve original image height
     *
     * @return int|null
     */
    public function getOriginalHeight()
    {
        if (isset($this->_fileName)) {
            return $this->_adapter->getOriginalHeight();
        }
        return null;
    }
}
