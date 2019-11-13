<?php
namespace re\rgx;

/**
 * 配置相关助手类
 * $Id: config.helper.php 16 2017-07-21 04:22:25Z reginx $
 */
class config_helper extends rgx {

    /**
     * 配置表模型实例
     * @var null
     */
    protected static $table = null;

    /**
     * 架构方法
     */
    public function __construct () {
        if (is_null(self::$table)) {
            self::$table = OBJ('config_table');
        }
    }

    /**
     * 格式化处理
     * @param  [type] $item [description]
     * @return [type]       [description]
     */
    public static function format ($item) { //&#092;
        return empty($item['config_value']) ? [] : filter::json_unecsape($item['config_value']);
    }

    /**
     * 获取配置分组
     * @return [type] [description]
     */
    public function get_group () {
        return self::$group;
    }

    /**
     * 获取配置记录
     * @param  [type] $config_item [description]
     * @return [type]              [description]
     */
    public function get ($config_item) { 
        return self::$table->map([__CLASS__, 'format'])->get(['config_item' => strval($config_item)]);
    }

    /**
     * 获取缓存的配置信息
     * @param  [type] $key [description]
     * @return [type]      [description]
     */
    public static function get_config ($key) {
        return CACHE("config-{$key}", function () use ($key) {
            return OBJ('config_helper')->get($key);
        }, 86400);
    }

    /**
     * 获取所有的配置项
     * @return [type] [description]
     */
    public function get_all () {
        $config_list = self::$group;
        array_walk($config_list, function ($item, $index) use (&$config_list) {
            $config_list[$index] = [
                'id'        => $index,
                'label'     => $item,
                'items'     => []
            ];
        });
        self::$table->map(function ($row) use (&$config_list) {
            $config_list[$row['config_group']]['items'][$row['config_item']] = self::format($row);
            return null;
        })->get_all();

        return $config_list;
    }

    /**
     * 获取配置值
     * @param  [type] $config_item [description]
     * @return [type]              [description]
     */
    public function get_value ($config_item) {
        $value = self::$table->fields('config_value')->fetch(['config_item' => $config_item]);
        return $value ? json_decode($value, 1) : [];
    }

    /**
     * 获取配置列表
     * @param  [type] $group_id [description]
     * @return [type]           [description]
     */
    public function get_items ($group_id = null) {
        if (null !== $group_id) {
            $group_id = defined(__CLASS__ . "::{$group_id}") ? constant(__CLASS__ . "::{$group_id}") : $group_id;
            self::$table->where("config_group = " . intval($group_id));
        }
        return self::$table->akey('config_item')->map(function ($row) {
            return empty($row['config_value']) ? null : json_decode($row['config_value'], 1);
        })->get_all();
    }

    /**
     * 设置配置项目
     * @param [type] $config_item  [description]
     * @param [type] $config_value [description]
     * @param [type] $config_group [description]
     */
    public function set ($config_item, $config_value, $config_name, $config_group) {
        return self::$table->replace([
            'config_item'   => strval($config_item),
            'config_name'   => $config_name,
            'config_value'  => filter::json_ecsape($config_value),
            'config_group'  => $config_group
        ]);
    }

}