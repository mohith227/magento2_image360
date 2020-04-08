<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/
namespace Codilar\Image360\Setup;

use Magento\Framework\Setup\UpgradeDataInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;

/**
 * Upgrade Data script
 * @codeCoverageIgnore
 */
class UpgradeData implements UpgradeDataInterface
{
    /**
     * {@inheritdoc}
     * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
     */
    public function upgrade(ModuleDataSetupInterface $setup, ModuleContextInterface $context)
    {
        $setup->startSetup();

        if ($setup->tableExists('image360_config')) {
            $tableName = $setup->getTable('image360_config');
            $version = $context->getVersion();

            if ($version && version_compare($version, '2.0.0') < 0) {
                //NOTE: make sure that the option is not present before inserting new one
                $setup->getConnection()->delete($tableName, ['name = ?' => 'display-spin']);
                $setup->getConnection()->insert($tableName, [
                    'platform' => 0,
                    'profile' => 'product',
                    'name' => 'display-spin',
                    'value' => 'inside fotorama gallery',
                    'status' => 2
                ]);
            }
        }

        $setup->endSetup();
    }
}
