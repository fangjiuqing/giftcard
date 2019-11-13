<?php
namespace com\default_admin;
use re\rgx as RGX;

/**
 * 模块基类
 * $Id: base.module.php 738 2017-11-21 04:39:27Z reginx $
 */
class base_module extends RGX\module {
    // public function __construct ( $params = [] ) {
    //     parent::__construct($params);
    // }
    /**
     * 当前登录用户
     * @var null
     */
    public $admin = null;

    public function sess_get ($key) {
        session_start();
        if ( isset($_SESSION[$key]) ) {
            return $_SESSION[$key];
        }
        return null;
    }

    public function sess_set ($key , $val) {
        session_start();
        $_SESSION[$key] = $val;
    }

    /**
     * 设置当前登录用户
     * @param [type] $user [description]
     */
    public function set_login ($admin) {
        $this->sess_set('admin', $admin);
    }

    public function logout_action () {
        $this->sess_del('admin');
        $this->redirect('login');
    }

    /**
     * set title
     * @param array $paths
     */
    public final function set_title ($paths = []) {
        $paths = is_array($paths) ? $paths : [$paths];
        foreach ($paths as $v) {
            $this->assign('_title[]', $v);
        }
    }

    /**
     * 子标题设置
     * @param [type] $label [description]
     */
    public final function set_stitle ($label) {
        $this->assign('_stitle', $label);
    }

    /**
     * 设置当前位置
     * @param string $key
     * @param string $label
     */
    public final function set_pos ($key = 'cur', $label = '') {
        $label = is_array($key) ? $key : [$key => $label];
        foreach ((array)$label as $k => $v) {
            $this->assign("_pos[$k]", $v);
        }
    }

    /**
     * 渲染模板
     *
     * @param unknown_type $tplfile
     * @return unknown
     */
    public function display ($tplfile, $type = 'text/html', $headers = []) {
        $this->assign('login', $this->login ?: []);
        $this->assign('_title[]', $this->get_tpl_var('base')['name']);
        return parent::display($tplfile, $type, $headers);
    }

    /**
     * [过滤筛选]
     * @method filter
     * @param  array  $_filter [description]
     * @return [type] [description]
     */
    public function filter( $_filter = [] , $new_urldecode = [] ) {
        $filter = array();
        if ( !empty($_filter) && is_array($_filter)  ){
            if ( !empty($new_urldecode) ) {
                $this->_urldecode_key = array_merge($this->_urldecode_key , $new_urldecode);
            }
            foreach ($_filter as $fk => $fv) {
                if ($this->has($fk) && ($v = urldecode($this->get($fk))) != '') {
                    # 中文进行解码
                    if ( in_array($fk , $this->_urldecode_key) ) {
                        $filter[$fk] = urldecode($this->get($fk));
                    }
                    else {
                        $filter[$fk] = urldecode($v);
                    }
                }
                else {
                    $filter[$fk] = '';
                }
            }
        }
        return $filter;
    }
}