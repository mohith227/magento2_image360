<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/
namespace Codilar\Image360\Block\Adminhtml\Settings\Edit;

use Magento\Backend\Block\Widget\Form\Generic;

/**
 * Adminhtml settings edit form
 *
 */
class Form extends \Magento\Backend\Block\Widget\Form\Generic
{
    /**
     * Prepare form before rendering HTML
     *
     * @return $this
     */
    protected function _prepareForm()
    {
        /** @var \Magento\Framework\Data\Form $form */
        $form = $this->_formFactory->create(
            ['data' => ['id' => 'edit_form', 'action' => $this->getData('action'), 'method' => 'post', 'class' => 'imagetoolbox-config']]
        );
        $form->setUseContainer(true);
        $this->setForm($form);
        return parent::_prepareForm();
    }
}
