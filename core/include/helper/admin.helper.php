<?php
namespace re\rgx;

/**
 * 管理账号助手类
 * $Id: admin.helper.php 159 2017-08-04 07:42:15Z fangwei $
 */
class admin_helper extends rgx {

    /**
     * 获取管理信息
     * @param  [type] $admin [description]
     * @return [type]        [description]
     */
    public static function get ($admin) {
        if ($admin['admin_group_id'] > 0) {
            $group = OBJ('admin_group_table')->get(intval($admin['admin_group_id']));
        }
        return $admin;
    }

    /**
     * 获取选项项目列表
     *
     * @param unknown_type $type
     * @return unknown
     */
    public static function getpermopts ($group_id = 0) {
        if ( !$group_id) {
            # 全部
            //$list = OBJ('admin_group_table')->get_all();
        }
        else {
            $list = OBJ('admin_group_table')->where("group_id = " . intval($group_id))->get();
            $list = explode(',', $list);
        }
        return $list;
    }

} // Class End