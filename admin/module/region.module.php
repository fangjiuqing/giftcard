<?php
namespace com\default_admin;
use re\rgx as RGX;

/**
 * 地区管理模块
 * $Id: region.module.php 5406 2015-10-13 09:54:19Z reginx $
 */
class region_module extends admin_module {
    /**
     * 地域选择
     *
     */
    public function select_action () {
        $parent = $level = 0;
        $nul = intval($this->get('nul'));
        $id = intval($this->get('id'));

        if ($id > 0) {
            $region = RGX\OBJ('region_table')->fields('id,name,parent,level')->where("id = $id")->get();
            if (!empty($region)) {
                $parent = $region['id'];
                $level  = $region['level'] + 1;
                $this->assign('region', $region);
                if ($region['level'] == 2 || ($nul && $region['level'] == '1')) {
                    $data = array();
                    if ($region['parent'] > 0) {
                        $data[] = RGX\OBJ('region_table')->fields('id,name,parent,level')->where("id = {$region['parent']}")->get();
                    }
                    $data[] = $region;
                    $this->assign('data', json_encode($data, 256));
                }
            }
        }
        $this->assign('nul', $nul);
        $this->assign('list', RGX\region_helper::getlist($parent, $level));
        //$this->assign('callback', RGX\filter::normal($this->get('callback')));
	    $this->assign('callback', $this->get('callback'));
        $this->display('region/select.tpl');
    }

    /**
     * 获取 select 的 option 列表
     *
     */
    public function optionAction () {
        $this->nocache();
        $default_id = intval($this->get('def'));
        $parent_id = intval($this->get('id'));
        $list = OBJ('region_table')->where("parent = {$parent_id}")->getall();
        foreach ($list as $v) {
            echo ("<option value='{$v['id']}'" . ($v['id'] == $default_id ? ' selected' : '') . ">{$v['name']}</option>");
        }
        exit (0);
    }

    public function api_action () {
        $this->nocache();
        $out['code']    =    1;
        $out['html']    =    '<option value="0">全部</option>';
        $out['first']   =    0;
        $parent_id      =    intval($this->get('id'));
        $default_id     =    intval($this->get('def'));
        if ( $parent_id ) {
            $list      = RGX\OBJ('region_table')->where("parent = {$parent_id}")->get_all();
            if ( !empty($list) ) {
                foreach ($list as $v) {
                    if ( $out['first'] <= 0 ) {
                        $out['first']    =    $v['id'];
                    }
                    $out['html'] .= "<option value='{$v['id']}'" . ($v['id'] == $default_id ? ' selected' : '') . ">{$v['name']}</option>";
                }
                $out['code']    =    0;
            }

        }
        $this->ajaxout($out);
    }
}