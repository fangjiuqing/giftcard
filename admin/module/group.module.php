<?php
namespace com\default_www;
use re\rgx as RGX;

class group_module extends admin_module {

    /**
     * [index_action description]
     * @method index_action
     * @return [type]       [description]
     */
    public function index_action () {
        $this->list_action();
    }

    /**
     * 管理组
     *
     */
    public function list_action () {
        $this->set_pos('cur', '权限管理');
        $tab    =    RGX\OBJ('admin_group_table')->order('group_id asc');
        $tab->map( function ($row) {
            $row['group_perms']    =    explode(',', $row['group_perms']);
            return $row;
        });
        $this->assign('list', $tab->get_all());
        $this->assign('perms' , RGX\navigation_helper::format());
        $this->display('group/list.tpl');
    }

     /**
     * 分组新增/修改
     *
     */
    public function add_action () {
        $id = intval($this->get('id'));
        $this->set_pos('cur', '新增分组');
        $data['group_perms'] = [];
        if ($id > 0) {
            $data = RGX\OBJ('admin_group_table')->where("group_id = $id")->get();
            if (!empty($data)) {
                $data['group_perms'] = explode(',', $data['group_perms']);
                $this->assign('data', $data);
            }
        }

        $perms = RGX\navigation_helper::$navs;
        $this->assign('perms', $perms);
        $this->assign('data', $data);
        $this->display('group/add.tpl');
    }

    /**
     * 分组删除
     *
     */
    public function del_action () {
        $id = intval($this->get('id'));
        $grp = RGX\OBJ('admin_group_table')->where("group_id = $id")->get();
        if (!empty($grp)) {
            if ( RGX\OBJ('admin_table')->where("admin_group = {$id}")->count() > 0 ) {
                $this->ajaxout(array(
                    'code'  => 1,
                    'msg'   => '请先删除该组下成员'
                ));
            }
            else {
                $ret = RGX\OBJ('admin_group_table')->where("group_id = $id")->delete();
                if ((int)$ret['code'] === 0 ) {
                    $this->ajaxout(array(
                        'code'  => 0,
                        'msg'   => '删除成功'
                    ));
                }
            }
        }
        $this->ajaxout(array(
            'code'  => 1,
            'msg'   => '记录未找到'
        ));
    }

    /**
     * 分组权限保存
     *
     */
    public function save_action () {
        $data = $this->get('data', 'p');
        $perm = $this->get('perms' , 'p');

        $data['group_perms'] = empty($perm) ? '' : join(',', $perm);
        $tab = RGX\OBJ('admin_group_table');
        if ($tab->load($data)) {
            $ret = $tab->save();
            if ((int)$ret['code'] === 0) {
                $this->ajaxout(array(
                    'code'  => 0,
                    'msg'   => '操作成功',
                    'url'   => RGX\router::url('group-index')
                ));
            }
        }
        $this->ajaxout(array(
            'code'  => 1,
            'msg'   => '失败了',
            'error' => $tab->geterr()
        ));
    }

}// Class End