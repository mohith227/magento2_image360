<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/
namespace Codilar\Image360\Model;

/**
 * Image handler library
 *
 */
class SirvImage extends \Codilar\Image360\Model\Image
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

    /**
     * Get get imaging options query
     *
     * @return string
     */
    public function getImagingOptionsQuery()
    {
        //NOTE: only for Sirv adapter
        return $this->_adapter->getImagingOptionsQuery();
    }

    /**
     * Set media directory absolute path
     *
     * @return void
     */
    public function setMediaDirectoryAbsolutePath($path)
    {
        $this->_adapter->setMediaDirectoryAbsolutePath($path);
    }
}
