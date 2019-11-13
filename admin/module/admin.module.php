<?php
namespace com\default_admin;
use re\rgx as RGX;

/**
 * 模块基类
 */
class admin_module extends base_module {

    /**
     * 架构方法
     * @param array $params [description]
     */
    public function __construct ($params = []) {
        parent::__construct($params);
        $this->admin = $this->sess_get('admin');

        if (empty($this->admin)) {
            $this->redirect('login');
        }
        $this->assign('route', RGX\router::get_config());
        $this->get_navs($this->login);
    }

    /**
     * [get_navs description]
     * @method get_navs
     * @param  integer  $admin_group [description]
     * @return [type]   [description]
     */
    public function get_navs( $login ) {
        $navs = RGX\navigation_helper::get($login);
        $this->assign('navs' , $navs);
    }

    /**
     * [check_perm description]
     * @method check_perm
     * @param  [type]     $login [description]
     * @return [type]     [description]
     */
    public function check_perm ($login) {
        $_opt = RGX\router::get_mod(false) . '-' . RGX\router::get_act(false);
        # 默认无需权限检测的加入到用户已有的权限列表中
        $login['admin_perms'][] = 'index-index';
        if ( !in_array($_opt , $login['admin_perms'] ) ) {
            $this->show_msg('无权操作！');die;
        }

    }
} //Class End