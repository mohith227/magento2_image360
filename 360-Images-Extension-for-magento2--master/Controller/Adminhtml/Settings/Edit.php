<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/
namespace Codilar\Image360\Controller\Adminhtml\Settings;

use Codilar\Image360\Controller\Adminhtml\Settings;

class Edit extends \Codilar\Image360\Controller\Adminhtml\Settings
{
    /**
     * Edit action
     *
     * @return \Magento\Backend\Model\View\Result\Page
     */
    public function execute()
    {
        /** @var \Magento\Backend\Model\View\Result\Page $resultPage */
        $resultPage = $this->resultPageFactory->create();
        $resultPage->setActiveMenu('Codilar_Codilar::imagetoolbox');
        $title = $resultPage->getConfig()->getTitle();
        $title->prepend('Image Toolbox');
        $title->prepend('Image 360');
        return $resultPage;
    }
}
