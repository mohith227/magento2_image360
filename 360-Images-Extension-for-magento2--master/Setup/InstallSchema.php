<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/
namespace Codilar\Image360\Setup;

use Magento\Framework\Setup\InstallSchemaInterface;
use Magento\Framework\Setup\SchemaSetupInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\DB\Ddl\Table;

/**
 * @codeCoverageIgnore
 */
class InstallSchema implements InstallSchemaInterface
{
    /**
     * {@inheritdoc}
     */
    public function install(SchemaSetupInterface $setup, ModuleContextInterface $context)
    {
        $setup->startSetup();

        /**
         * Create table 'image360_config'
         */
        if (!$setup->tableExists('image360_config')) {
            $table = $setup->getConnection()->newTable(
                $setup->getTable('image360_config')
            )->addColumn(
                'id',
                Table::TYPE_INTEGER,
                null,
                ['identity' => true, 'unsigned' => true, 'nullable' => false, 'primary' => true],
                'ID'
            )->addColumn(
                'platform',
                Table::TYPE_BOOLEAN,
                null,
                ['nullable' => false, 'default' => '0'],
                'Platform'
            )->addColumn(
                'profile',
                Table::TYPE_TEXT,
                64,
                ['nullable'  => false],
                'Profile'
            )->addColumn(
                'name',
                Table::TYPE_TEXT,
                64,
                ['nullable'  => false],
                'Name'
            )->addColumn(
                'value',
                Table::TYPE_TEXT,
                null,
                ['nullable'  => false],
                'Value'
            )->addColumn(
                'status',
                Table::TYPE_BOOLEAN,
                null,
                ['nullable' => false, 'default' => '0'],
                'Status'
            )->setComment(
                'Image 360 configuration'
            );
            $setup->getConnection()->createTable($table);
        }

        /**
         * Create table 'image360_gallery'
         */
        if (!$setup->tableExists('image360_gallery')) {
            $table = $setup->getConnection()->newTable(
                $setup->getTable('image360_gallery')
            )->addColumn(
                'id',
                Table::TYPE_INTEGER,
                null,
                ['identity' => true, 'unsigned' => true, 'nullable' => false, 'primary' => true],
                'ID'
            )->addColumn(
                'product_id',
                \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER,
                null,
                ['unsigned' => true, 'nullable' => false, 'default' => '0'],
                'Product ID'
            )->addColumn(
                'position',
                \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER,
                null,
                ['unsigned' => true],
                'Position'
            )->addColumn(
                'file',
                \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
                255,
                [],
                'File'
            )->setComment(
                'Image 360 gallery'
            );
            $setup->getConnection()->createTable($table);
        }

        /**
         * Create table 'image360_columns'
         */
        if (!$setup->tableExists('image360_columns')) {
            $table = $setup->getConnection()->newTable(
                $setup->getTable('image360_columns')
            )->addColumn(
                'product_id',
                \Magento\Framework\DB\Ddl\Table::TYPE_INTEGER,
                null,
                ['unsigned' => true, 'nullable' => false, 'default' => '0', 'primary' => true],
                'Product ID'
            )->addColumn(
                'columns',
                \Magento\Framework\DB\Ddl\Table::TYPE_SMALLINT,
                null,
                ['unsigned' => true],
                'Columns'
            )->setComment(
                'Image 360 columns'
            );
            $setup->getConnection()->createTable($table);
        }

        $setup->endSetup();
    }
}
