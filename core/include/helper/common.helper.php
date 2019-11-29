<?php
namespace re\rgx;

/**
 * 通用助手类
 * $Id: common.helper.php 773 2017-11-28 10:33:50Z reginx $
 */
class common_helper extends rgx {
    const ATTACH_TYPE_CAR = 1;

    /**
     * 是否
     * @var [type]
     */
    public static $bool = [
        1       => '否',
        2       => '是'
    ];

    const STATUS_WAITING    = 1;
    const STATUS_CONFIRM    = 2;
    const STATUS_INUSING    = 3;
    const STATUS_COMPLATE   = 4;
    const STATUS_CLOSED     = 5;

    public static $order_status = [
        1 => '正在处理',
        2 => '已确认',
        3 => '使用中',
        4 => '已完成',
        5 => '已关闭',
    ];

    public static $order_status_color = [
        1 => 'order-waiting',
        2 => 'order-confirm',
        3 => 'order-inusing',
        4 => 'order-complate',
        5 => 'order-closed',
    ];

    public static $code_level = [
        1 => '不归类',
        2 => '黑卡',
        3 => '金卡',
        4 => '银卡',
        5 => '冰鲜（0.3-0.5）',
        6 => '冰鲜（0.5-0.7）',
        7 => '冰鲜（0.7-0.9）',
        8 => '冰鲜（0.9-1.1）',
        9 => '冰鲜（1.1-1.3）',
        10 => '冰鲜（1.3-1.5）',
        11 => '冰鲜（1.5-1.7）',
        12 => '冰鲜（1.7-1.9）',
        13 => '冰鲜（1.9-2.2）',
        14 => '冰鲜（2.2以上）',
    ];

    /**
     * [$code_status description]
     * @var [type]
     */
    public static $code_status = [
        1 => '未使用',
        2 => '已登记',
        3 => '已完成',
    ];

    public static $agent_type = [
        1 => '一级',
        2 => '二级',
        3 => '三级',
    ];

    public static $cate_type = [
        1 => '冰鲜（0.3-0.5）',
        2 => '冰鲜（0.5-0.7）',
        3 => '冰鲜（0.7-0.9）',
        4 => '冰鲜（0.9-1.1）',
        5 => '冰鲜（1.1-1.3）',
        6 => '冰鲜（1.3-1.5）',
        7 => '冰鲜（1.5-1.7）',
        8 => '冰鲜（1.7-1.9）',
        9 => '冰鲜（1.9-2.2）',
        10 => '冰鲜（2.2以上）',
    ];

    /**
     * 允许的素材类型
     * @var [type]
     */
    public static $allow_mime = [
        'jpg'       => 'image/jpeg',
        'jpeg'      => 'image/jpeg',
        'png'       => 'image/png',
        'zip'       => 'application/zip',
        'rar'       => [
            'application/x-rar-compressed',
            'application/x-rar'
        ],
        'xls'       => 'application/vnd.ms-excel',
        'xlsx'      => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'csv'       => ['text/csv', 'text/comma-separated-values'],
        'pdf'       => 'application/pdf'
    ];


    /**
     * 判断扩展名是否允许
     * @param  [type]  $ext [description]
     * @return boolean      [description]
     */
    public static function is_allowed_ext ($ext) {
        return isset(self::$allow_mime[$ext]);
    }

    /**
     * 检测 mime 是否 allow
     * @param  [type]  $type [description]
     * @return boolean       [description]
     */
    public static function is_allowed ($type) {
        $ret = false;
        foreach (self::$allow_mime as $k => $v) {
            if ($v == $type || (is_array($v) && in_array($type, $v))) {
                $ret = $k;
            }
        }
        return $ret;
    }

    /**
     * [get_admin description]
     * @return [type] [description]
     */
    public static function get_admin () {
        $tab = OBJ('admin_table');
        $tab->where('admin_group = 1');
        $ret = $tab->get_all();

        $admins = [];
        foreach ( $ret as $v ) {
            $admins[$v['admin_realname']] = $v['admin_realname'];
        }
        return $admins;
    }
} //Class End