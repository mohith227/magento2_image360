<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/
namespace Codilar\Image360\Setup;

use Magento\Framework\Setup\InstallDataInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Module\Dir\Reader;

/**
 * @codeCoverageIgnore
 */
class InstallData implements \Magento\Framework\Setup\InstallDataInterface
{
    /**
     * @var \Magento\Framework\Module\Dir\Reader
     */
    protected $_modulesReader;

    /**
     * @param \Magento\Framework\Module\Dir\Reader $modulesReader
     */
    public function __construct(
        \Magento\Framework\Module\Dir\Reader $modulesReader
    ) {
        $this->_modulesReader = $modulesReader;
    }

    /**
     * {@inheritdoc}
     * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
     */
    public function install(ModuleDataSetupInterface $setup, ModuleContextInterface $context)
    {
        $setup->startSetup();

        /**
         * Install default config
         */
        $data = [];
        $moduleEtcPath = $this->_modulesReader->getModuleDir(\Magento\Framework\Module\Dir::MODULE_ETC_DIR, 'Codilar_Image360');
        $fileName = $moduleEtcPath.'/defaults.xml';
        libxml_use_internal_errors(true);
        $xml = simplexml_load_file($fileName);
        libxml_use_internal_errors(false);
        if ($xml) {
            $params = $xml->xpath('/defaults/param');
            foreach ($params as $param) {
                $data[] = [
                    'platform' => (int)$param['platform'],
                    'profile' => (string)$param['profile'],
                    'name' => (string)$param['name'],
                    'value' => (string)$param['value'],
                    'status' => (int)$param['status']
                ];
            }
            unset($xml);
        }
        if (!empty($data) && $setup->tableExists('image360_config')) {
            $tableName = $setup->getTable('image360_config');

            //NOTE: make sure that the table is empty before inserting new data
            $setup->getConnection()->truncateTable($tableName);

            $setup->getConnection()->insertMultiple($tableName, $data);
        }

        $setup->endSetup();
    }
}
