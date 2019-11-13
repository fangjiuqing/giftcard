<?php
namespace re\rgx;

/**
 * 分类助手类
 * $Id: category.helper.php 958 2017-12-18 07:15:24Z fangwei $
 */
class category_helper extends rgx {
    /**
     * 获取分类树
     * @param  [type]  $channel_id [description]
     * @param  [type]  $root_id    [description]
     * @param  integer $simple     [description]
     * @return [type]              [description]
     */
    public static function get_tree ($channel_id, $root_id = 0, $simple = 0) {
        return CACHE("category@tree@{$channel_id}-{$root_id}-{$simple}", function () use ($channel_id, $root_id, $simple) {
            return category_table::get_tree($channel_id, $root_id, $simple);
        }, 300);
    }

    /**
     * [get_list description]
     * @method get_list
     * @param  [type]   $type_id [description]
     * @param  integer  $root_id [description]
     * @return [type]   [description]
     */
    public static function get_list ($type_id , $root_id = 0) {
        return CACHE("category-list-{$type_id}-{$type_id}-{$root_id}-t", function () use ($type_id, $root_id) {
            return category_table::get_list($type_id, $root_id);
        }, 86400);
    }

    /**
     * [get_list description]
     * @method get_list
     * @param  [type]   $type_id [description]
     * @param  integer  $root_id [description]
     * @return [type]   [description]
     */
    public static function get_cert_types ($cache = false) {
        $func = function () {
            $ret = [];
            OBJ('category_table')->map(function ($row) use (&$ret) {
                $row['tags'] = $row['cat_desc'] ? explode('#', $row['cat_desc']) : [];
                if ($row['cat_parent'] == '0') {
                    $ret[$row['cat_id']] = $row;
                    $ret[$row['cat_id']]['subs'] = [];
                }
                else {
                    $ret[$row['cat_parent']]['subs'][$row['cat_id']] = $row;
                }
                return null;
            })->order('cat_level asc,cat_sort desc')->get_all([
                'cat_type'  => 1
            ]);
            return $ret;
        };
        return $cache ? CACHE("category-certtypes", $func, 86400) : $func();
    }

    /**
     * [get_list description]
     * @method get_list
     * @param  [type]   $type_id [description]
     * @param  integer  $root_id [description]
     * @return [type]   [description]
     */
    public static function get_ent_types ($cache = false) {
        $func = function () {
            $ret = [];
            OBJ('category_table')->map(function ($row) use (&$ret) {
                $row['tags'] = $row['cat_desc'] ? explode('#', $row['cat_desc']) : [];
                if ($row['cat_parent'] == '0') {
                    $ret[$row['cat_id']] = $row;
                    $ret[$row['cat_id']]['subs'] = [];
                }
                else {
                    $ret[$row['cat_parent']]['subs'][$row['cat_id']] = $row;
                }
                return null;
            })->order('cat_level asc')->get_all([
                'cat_type'  => 3
            ]);
            return $ret;
        };
        return $cache ? CACHE("category-certtypes", $func, 86400) : $func();
    }

    /**
     * [获取类型分类]
     * @method get_asset_types
     * @param  boolean         $cache [description]
     * @return [type]          [description]
     */
    public static function get_types ($type_id = 1, $cache = false) {
        $func = function () use ($type_id) {
            $ret = [];
            OBJ('category_table')->map(function ($row) use (&$ret) {
                $row['tags'] = $row['cat_desc'] ? explode('#', $row['cat_desc']) : [];
                if ($row['cat_parent'] == '0') {
                    $ret[$row['cat_id']] = $row;
                    $ret[$row['cat_id']]['subs'] = [];
                }
                else {
                    $ret[$row['cat_parent']]['subs'][$row['cat_id']] = $row;
                }
                return null;
            })->order('cat_level asc,cat_sort desc')->get_all([
                'cat_type'  => $type_id
            ]);
            return $ret;
        };
        return $cache ? CACHE("category@type-{$type_id}", $func, 86400) : $func();
    }

} //Class End