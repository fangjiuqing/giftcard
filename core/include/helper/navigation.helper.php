<?php
namespace re\rgx;
// PASSED
/**
 * 导航助手类
 * $Id: navigation.helper.php 951 2017-12-18 06:43:09Z fangwei $
 */
class navigation_helper extends rgx {
    public static $navs    =    [
        [
            'name'   =>    '兑码管理',
            'icon'   =>    'fa fa-home',
            'urls'    =>   [
                ['url' => 'codes-index', 'name' => '兑码列表'],
                ['url' => 'codes-generate', 'name' => '兑码生成'],
            ],
        ],
        [
            'name'   =>    '库存管理',
            'icon'   =>    'fa fa-cogs',
            'urls'    =>   [
                ['url' => 'product-index', 'name' => '库存概况'],
                ['url' => 'product-add', 'name' => '新增库存'],
            ],
        ],
        [
            'name'   =>    '代理管理',
            'icon'   =>    'fa fa-user',
            'urls'    =>   [
                ['url' => 'agent-index', 'name' => '代理列表'],
                ['url' => 'agent-add', 'name' => '新增代理'],
            ],
        ],
        [
            'name'   =>    '账号管理',
            'icon'   =>    'fa fa-user',
            'urls'    =>   [
                ['url' => 'account-list', 'name' => '账号列表'],
                ['url' => 'account-add', 'name' => '新增账号'],
            ],
        ]
    ];

    /**
     * 根据当前登录用户获取导航菜单
     * @param  [type] $login [description]
     * @return [type]        [description]
     */
    public static function get ($login = []) {
        if ( $login['is_admin'] ) {
            return self::$navs + self::$admin_navs;
        }
        return self::$navs;
    }

    /**
     * [format description]
     * @method format
     * @param  array  $except [description]
     * @return [type] [description]
     */
    public static function format ($except = [] ) {
        $data    =    [];
        foreach( self::$navs as $k => $v ) {
            if ( $v['url'] ) {
                $data[$v['url']]    =    $v['name'];
            }
            if ( !empty($v['urls']) ) {
                foreach ( $v['urls'] as $sk => $sv ) {
                    $data[$sv['url']]    =    $sv['name'];
                }
            }
        }
        return $data;
    }
} //Class End