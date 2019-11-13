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

    /**
     * [$car_type description]
     * @var [type]
     */
    public static $car_type = [
        1 => '经济型',
        2 => '舒适型',
        3 => '精英型',
        4 => 'SUV',
        5 => '商务车',
        6 => '电动型',
        7 => '高端车',
    ];


    public static $agent_type = [
        1 => 'A级',
        2 => 'B级',
        3 => 'C级',
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
} //Class End