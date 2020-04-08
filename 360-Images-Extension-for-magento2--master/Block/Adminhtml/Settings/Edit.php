<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/
namespace Codilar\Image360\Block\Adminhtml\Settings;

use Magento\Backend\Block\Widget\Form\Container;

class Edit extends \Magento\Backend\Block\Widget\Form\Container
{
    /**
     * Class constructor
     *
     * @return void
     */
    protected function _construct()
    {
        $this->_objectId = 'object_id';
        $this->_controller = 'adminhtml_settings';
        $this->_blockGroup = 'Codilar_Image360';
        $this->_headerText = 'Image 360 Config';

        parent::_construct();

        $this->_formScripts[] = '
            var mtErrMessage = \'Error: It seems that your Static Files Cache is outdated. Please, update it so that module\\\'s scripts can be loaded.\';
            var mtRequireConfigMap = null;
            try {
                mtRequireConfigMap = requirejs.s.contexts._.config.map[\'*\'];
            } catch (e) {
                mtRequireConfigMap = null;
            }
            if (mtRequireConfigMap && typeof(mtRequireConfigMap[\'image360\']) == \'undefined\') {
                throw mtErrMessage;
            }
            require([\'image360\'], function(image360){
                if (typeof(image360) == "undefined") {
                    throw mtErrMessage;
                }
                image360.initSettings();
            });
        ';

        $this->removeButton('back');
        $this->removeButton('reset');
        $this->updateButton('save', 'label', __('Save Settings'));
    }
}
