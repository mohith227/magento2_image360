<?php
/**
 * Codilar Technologies Pvt. Ltd.
 * @package   Image360
 * @copyright   Copyright (c) 2016 Codilar. (http://www.codilar.com)
 * @author       Codilar Team
 **/
namespace Codilar\Image360\Model\ResourceModel;

use Magento\Framework\Model\ResourceModel\Db\AbstractDb;

/**
 * mysql resource
 */
class Config extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb
{
    /**
     * Resource initialization
     *
     * @return void
     */
    protected function _construct()
    {
        $this->_init('image360_config', 'id');
    }

    /**
     * Insert config data to db and retrieve last id
     *
     * @param array $data
     * @return integer
     */
    public function insertConfigData($data)
    {
        $connection = $this->getConnection();
        $data = $this->_prepareDataForTable(new \Magento\Framework\DataObject($data), $this->getMainTable());
        $connection->insert($this->getMainTable(), $data);

        return $connection->lastInsertId($this->getMainTable());
    }
}
