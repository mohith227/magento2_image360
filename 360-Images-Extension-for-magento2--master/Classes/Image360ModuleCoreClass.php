<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/
namespace Codilar\Image360\Classes;

/**
 * Image360ModuleCoreClass
 *
 */
class Image360ModuleCoreClass
{

    /**
     * CodilarParamsClass class
     *
     * @var \Codilar\Image360\Classes\CodilarParamsClass
     *
     */
    public $params;

    /**
     * Tool type
     *
     * @var   string
     *
     */
    public $type = 'circle';

    /**
     * Constructor
     *
     * @return void
     */
    public function __construct()
    {
        $this->params = new CodilarParamsClass();
        $this->params->setScope('image360');
        $this->params->setMapping([
            'smoothing' => ['Yes' => 'true', 'No' => 'false'],
            'magnify' => ['Yes' => 'true', 'No' => 'false'],
            'loop-column' => ['Yes' => 'true', 'No' => 'false'],
            'loop-row' => ['Yes' => 'true', 'No' => 'false'],
            'reverse-column' => ['Yes' => 'true', 'No' => 'false'],
            'reverse-row' => ['Yes' => 'true', 'No' => 'false'],
            'hint' => ['Yes' => 'true', 'No' => 'false'],
        ]);
        $this->loadDefaults();
    }

    /**
     * Method to get headers string
     *
     * @param string $jsPath  Path to JS file
     * @param string $cssPath Path to CSS file
     *
     * @return string
     */
    public function getHeadersTemplate($jsPath = '', $cssPath = null)
    {
        if ($cssPath == null) {
            $cssPath = $jsPath;
        }
        $headers = [];

        $headers[] = '<script type="text/javascript">window["mgctlbx$Pltm"] = "Magento 2";</script>';
        // add tool style link
        $headers[] = '<link type="text/css" href="'.$cssPath.'/image360.css" rel="stylesheet" media="screen" />';
        // add module style link
        $headers[] = '<link type="text/css" href="'.$cssPath.'/image360.module.css" rel="stylesheet" media="screen" />';
        // add script link
        $headers[] = '<script type="text/javascript" src="'.$jsPath.'/image360.js"></script>';
        // add options
        $headers[] = $this->getOptionsTemplate();
        return "\r\n".implode("\r\n", $headers)."\r\n";
    }

    /**
     * Method to get options string
     *
     * @return string
     */
    public function getOptionsTemplate()
    {
        $addition = '';
        if ($this->params->paramExists('rows')) {
            $addition .= "\n\t\t'rows':".$this->params->getValue('rows').',';
        } else {
            $addition .= "\n\t\t'rows':1,";
        }
        return "<script type=\"text/javascript\">\n\tImage360Options = {{$addition}\n\t\t".$this->params->serialize(true, ",\n\t\t")."\n\t}\n</script>\n".
               "<script type=\"text/javascript\">\n\tImage360Lang = {".
               "\n\t\t'loading-text':'".str_replace('\'', '\\\'', $this->params->getValue('loading-text'))."',".
               "\n\t\t'hint-text':'".str_replace('\'', '\\\'', $this->params->getValue('hint-text'))."',".
               "\n\t\t'mobile-hint-text':'".str_replace('\'', '\\\'', $this->params->getValue('mobile-hint-text'))."'".
               "\n\t}\n</script>";
    }

    /**
     * Check if effect is enable
     *
     * @param mixed $data Images Data
     * @param mixed $id Product ID
     *
     * @return boolean
     */
    public function isEnabled($data, $id)
    {
        if ((int)$this->params->getValue('columns') == 0) {
            return false;
        }
        if (is_array($data)) {
            $data = count($data);
        }
        if ($data < (int)$this->params->getValue('columns')) {
            return false;
        }
        $ids = trim($this->params->getValue('product-ids'));
        if ($ids != 'all' && !in_array($id, explode(',', $ids))) {
            return false;
        }
        return true;
    }

    /**
     * Method to get Image360 HTML
     *
     * @param array $data Image360 Data
     * @param array $params Additional params
     *
     * @return string
     */
    public function getMainTemplate($data, $params = [])
    {
        $id = '';
        $width = '';
        $height = '';

        $html = [];

        extract($params);

        // check for width/height
        if (empty($width)) {
            $width = '';
        } else {
            $width = " width=\"{$width}\"";
        }
        if (empty($height)) {
            $height = '';
        } else {
            $height = " height=\"{$height}\"";
        }

        // check ID
        if (empty($id)) {
            $id = '';
        } else {
            $id = ' id="'.addslashes($id).'"';
        }

        $images = [];// set of small images
        $largeImages = [];// set of large images

        // add items
        foreach ($data as $item) {
            //NOTE: if there are spaces in the filename
            $images[] = str_replace(' ', '%20', $item['medium']);
            $largeImages[] = str_replace(' ', '%20', $item['img']);
        }

        $defaultImageIndex = (int)$this->params->getValue('start-column') - 1;
        if (!isset($images[$defaultImageIndex])) {
            $defaultImageIndex = 0;
        }
        $src = ' src="'.$images[$defaultImageIndex].'"';

        $rel = $this->params->serialize();
        $rel .= 'rows:'.floor(count($data) / $this->params->getValue('columns')).';';
        $rel .= 'images:'.implode(' ', $images).';';
        if ($this->params->checkValue('magnify', 'Yes') || $this->params->checkValue('fullscreen', 'Yes')) {
            $rel .= 'large-images:'.implode(' ', $largeImages).';';
        }
        $rel = ' data-image360-options="'.$rel.'"';

        $html[] = '<a'.$id.' class="Image360" href="#"'.$rel.'>';
        $html[] = '<img itemprop="image"'.$src.$width.$height.' />';
        $html[] = '</a>';

        // check message
        if ($this->params->checkValue('show-message', 'Yes')) {
            // add message
            $html[] = '<div class="CodilarMessage">'.$this->params->getValue('message').'</div>';
        }

        // return HTML string
        return implode('', $html);
    }

    /**
     * Method to load defaults options
     *
     * @return void
     */
    public function loadDefaults()
    {
        $params = [
            "enable-effect"=>["id"=>"enable-effect","group"=>"General","order"=>"10","default"=>"Yes","label"=>"Enable Image 360","type"=>"array","subType"=>"select","values"=>["Yes","No"],"scope"=>"module"],
            "include-headers-on-all-pages"=>["id"=>"include-headers-on-all-pages","group"=>"General","order"=>"21","default"=>"No","label"=>"Include headers on all pages","description"=>"To be able to apply an effect on any page.","type"=>"array","subType"=>"radio","values"=>["Yes","No"],"scope"=>"module"],
            "columns"=>["id"=>"columns","group"=>"Image 360","order"=>"50","default"=>"36","label"=>"Number of images on X-axis","description"=>"Enter number of images used to create 360 degree spin (left/right)","type"=>"num","scope"=>"image360"],
            "magnify"=>["id"=>"magnify","group"=>"Image 360","order"=>"60","default"=>"Yes","label"=>"Magnifier appearing effect","type"=>"array","subType"=>"radio","values"=>["Yes","No"],"scope"=>"image360"],
            "magnifier-width"=>["id"=>"magnifier-width","group"=>"Image 360","order"=>"70","default"=>"80%","label"=>"Magnifier size","description"=>"Magnifier size in % of small image width or fixed size in px","type"=>"text","scope"=>"image360"],
            "magnifier-shape"=>["id"=>"magnifier-shape","group"=>"Image 360","order"=>"71","default"=>"inner","label"=>"Shape of magnifying glass","type"=>"array","subType"=>"radio","values"=>["inner","circle","square"],"scope"=>"image360"],
            "fullscreen"=>["id"=>"fullscreen","group"=>"Image 360","order"=>"72","default"=>"Yes","label"=>"Allow full-screen mode","type"=>"array","subType"=>"radio","values"=>["Yes","No"],"scope"=>"image360"],
            "spin"=>["id"=>"spin","group"=>"Image 360","order"=>"110","default"=>"drag","label"=>"Spin","description"=>"Method for spinning the image","type"=>"array","subType"=>"radio","values"=>["drag","hover"],"scope"=>"image360"],
            "autospin-direction"=>["id"=>"autospin-direction","group"=>"Image 360","order"=>"111","default"=>"clockwise","label"=>"Direction of auto-spin","type"=>"array","subType"=>"radio","values"=>["clockwise","anticlockwise","alternate-clockwise","alternate-anticlockwise"],"scope"=>"image360"],
            "sensitivityX"=>["id"=>"sensitivityX","group"=>"Image 360","order"=>"120","default"=>"50","label"=>"Sensitivity on X-axis","description"=>"Drag sensitivity on X-axis (1 = very slow, 100 = very fast)","type"=>"num","scope"=>"image360"],
            "sensitivityY"=>["id"=>"sensitivityY","group"=>"Image 360","order"=>"121","default"=>"50","label"=>"Sensitivity on Y-axis","description"=>"Drag sensitivity on Y-axis (1 = very slow, 100 = very fast)","type"=>"num","scope"=>"image360"],
            "mousewheel-step"=>["id"=>"mousewheel-step","advanced"=>"1","group"=>"Image 360","order"=>"121","default"=>"1","label"=>"Mousewheel step","description"=>"Number of frames to spin on mousewheel","type"=>"num","scope"=>"image360"],
            "autospin-speed"=>["id"=>"autospin-speed","group"=>"Image 360","order"=>"122","default"=>"3600","label"=>"Speed of auto-spin","description"=>"e.g. 1 = fast / 10000 = slow","type"=>"num","scope"=>"image360"],
            "smoothing"=>["id"=>"smoothing","group"=>"Image 360","order"=>"130","default"=>"Yes","label"=>"Smoothing","description"=>"Smoothly stop the image spinning","type"=>"array","subType"=>"radio","values"=>["Yes","No"],"scope"=>"image360"],
            "autospin"=>["id"=>"autospin","group"=>"Image 360","order"=>"140","default"=>"once","label"=>"Duration of automatic spin","type"=>"array","subType"=>"radio","values"=>["once","twice","infinite","off"],"scope"=>"image360"],
            "autospin-start"=>["id"=>"autospin-start","group"=>"Image 360","order"=>"150","default"=>"load,hover","label"=>"Autospin starts on","description"=>"Start automatic spin on page load, click or hover","type"=>"array","subType"=>"select","values"=>["load","hover","click","load,hover","load,click"],"scope"=>"image360"],
            "autospin-stop"=>["id"=>"autospin-stop","group"=>"Image 360","order"=>"160","default"=>"click","label"=>"Autospin stops on","description"=>"Stop automatic spin on click or hover","type"=>"array","subType"=>"radio","values"=>["click","hover","never"],"scope"=>"image360"],
            "initialize-on"=>["id"=>"initialize-on","group"=>"Image 360","order"=>"170","default"=>"load","label"=>"When to Load the All Images","description"=>"When to load Image 360 (download images to optimize page speed).","type"=>"array","subType"=>"radio","values"=>["load","hover","click"],"scope"=>"image360"],
            "start-column"=>["id"=>"start-column","advanced"=>"1","group"=>"Image 360","order"=>"220","default"=>"1","label"=>"Start column (left/right movement)","description"=>"Image from which to start spin. 'auto' means to start from the middle","type"=>"num","scope"=>"image360"],
            "start-row"=>["id"=>"start-row","advanced"=>"1","group"=>"Image 360","order"=>"230","default"=>"auto","label"=>"Start row (up/down movement)","description"=>"Position from which to start spin. 'auto' means to start from the middle","type"=>"num","scope"=>"image360"],
            "loop-column"=>["id"=>"loop-column","advanced"=>"1","group"=>"Image 360","order"=>"240","default"=>"Yes","label"=>"Loop column","description"=>"Continue spin after the last image on X-axis (left/right)","type"=>"array","subType"=>"radio","values"=>["Yes","No"],"scope"=>"image360"],
            "loop-row"=>["id"=>"loop-row","advanced"=>"1","group"=>"Image 360","order"=>"250","default"=>"No","label"=>"Loop row","description"=>"Continue spin after the last image on Y-axis (up/down)","type"=>"array","subType"=>"radio","values"=>["Yes","No"],"scope"=>"image360"],
            "reverse-column"=>["id"=>"reverse-column","advanced"=>"1","group"=>"Image 360","order"=>"260","default"=>"No","label"=>"Reverse rotation on X-axis (left/right)","type"=>"array","subType"=>"radio","values"=>["Yes","No"],"scope"=>"image360"],
            "reverse-row"=>["id"=>"reverse-row","group"=>"Image 360","order"=>"270","default"=>"No","label"=>"Reverse rotation on Y-axis (up/down)","type"=>"array","subType"=>"radio","values"=>["Yes","No"],"scope"=>"image360"],
            "column-increment"=>["id"=>"column-increment","advanced"=>"1","group"=>"Image 360","order"=>"280","default"=>"1","label"=>"Column increment (left/right)","description"=>"Load only every second (2) or third (3) column so that spins load faster","type"=>"num","scope"=>"image360"],
            "row-increment"=>["id"=>"row-increment","advanced"=>"1","group"=>"Image 360","order"=>"290","default"=>"1","label"=>"Row increment (up/down)","description"=>"Load only every second (2) or third (3) row so that spins load faster","type"=>"num","scope"=>"image360"],
            "display-spin"=>["id"=>"display-spin","group"=>"Positioning and Geometry","order"=>"5","default"=>"inside fotorama gallery","label"=>"Display spin","description"=>"","type"=>"array","subType"=>"radio","values"=>["inside fotorama gallery","separately"],"scope"=>"module"],
            "thumb-max-width"=>["id"=>"thumb-max-width","group"=>"Positioning and Geometry","order"=>"10","default"=>"550","label"=>"Maximum width of thumbnail (in pixels)","type"=>"num","scope"=>"module"],
            "thumb-max-height"=>["id"=>"thumb-max-height","group"=>"Positioning and Geometry","order"=>"11","default"=>"550","label"=>"Maximum height of thumbnail (in pixels)","type"=>"num","scope"=>"module"],
            "square-images"=>["id"=>"square-images","group"=>"Positioning and Geometry","order"=>"40","default"=>"No","label"=>"Always create square images","description"=>"","type"=>"array","subType"=>"radio","values"=>["Yes","No"],"scope"=>"module"],
            "icon"=>["id"=>"icon","group"=>"Miscellaneous","order"=>"10","default"=>"app/code/Codilar/Image360/view/frontend/web/img/360icon.png","label"=>"Icon for thumbnail","description"=>"Relative for site base path.","type"=>"text","scope"=>"module"],
            "show-message"=>["id"=>"show-message","group"=>"Miscellaneous","order"=>"150","default"=>"Yes","label"=>"Show message under image?","type"=>"array","subType"=>"radio","values"=>["Yes","No"],"scope"=>"module"],
            "message"=>["id"=>"message","group"=>"Miscellaneous","order"=>"160","default"=>"Drag image to spin","label"=>"Enter message to appear under spins","type"=>"text","scope"=>"module"],
            "loading-text"=>["id"=>"loading-text","group"=>"Miscellaneous","order"=>"257","default"=>"Loading...","label"=>"Loading text","description"=>"Text displayed while images are loading.","type"=>"text","scope"=>"image360-language"],
            "hint"=>["id"=>"hint","group"=>"Miscellaneous","order"=>"259","default"=>"Yes","label"=>"Show hint message","type"=>"array","subType"=>"radio","values"=>["Yes","No"],"scope"=>"image360"],
            "hint-text"=>["id"=>"hint-text","group"=>"Miscellaneous","order"=>"260","default"=>"Drag to spin","label"=>"Hint text appears on desktop","type"=>"text","scope"=>"image360-language"],
            "mobile-hint-text"=>["id"=>"mobile-hint-text","group"=>"Miscellaneous","order"=>"261","default"=>"Swipe to spin","label"=>"Hint text appears on iOS/Android devices","type"=>"text","scope"=>"image360-language"]
        ];
        $this->params->appendParams($params);
    }
}
