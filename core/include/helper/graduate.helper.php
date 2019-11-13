<?php
namespace re\rgx;

class graduate_helper {
    /**
     * 非法学
     */
    const NOT_LEGISTIC = 2;

    /**
     * 法学
     */
    const IS_LEGISTIC = 1;

    /**
     * 非全日制
     */
    const NOT_FULL_TIME = 2;

    /**
     * 全日制
     */
    const IS_FULL_TIME = 1;

    public static $school = [
        1 => '华东政法大学',
        2 => '南京大学',
        3 => '苏州大学',
        4 => '南京师范大学'
    ];
}