<?php
namespace com\default_admin;
use re\rgx as RGX;
/**
 * 用户模块
 */
class user_module extends admin_module {
    /**
     * @method index_action
     * @return [type]       [description]
     */
    public function index_action () {
        $this->set_pos('cur' , '用户列表');
        $tab    =    RGX\OBJ('user_table');
        $type = $this->get('type') ?: '';
        $type = $type ? explode(',', $type) : [];
        $filter = [
            'values'       => [
                'skey'          => RGX\filter::text(urldecode($this->get('skey'))) ?: '',
                'stype'         => $this->get('stype') ?: 'name',
                'type'          => $type
            ],
            'configs'       => [
                [
                    'code'      => 'stype',
                    'type'      => 'select',
                    'default'   => [
                        'value'     => 'name',
                        'label'     => '用户学号',
                    ],
                    'options'   => [
                        'sno'      => '用户学号',
                        'sname'    => '用户学校',
                        'mobile'   => '用户手机',
                    ],
                    'input'     => [
                        'code'          => 'skey',
                        'placeholder'   => '请输入关键字'
                    ]
                ],
            ]
        ];

        if (!empty($filter['values']['skey'])) {
            // 按编号检索
            if ($filter['values']['stype'] == 'sno') {
                $tab->where("user_sno like '%{$filter['values']['skey']}%'");
            }
            if ($filter['values']['stype'] == 'sname') {
                $tab->where("user_sname like '%{$filter['values']['skey']}%'");
            }
            if ($filter['values']['stype'] == 'mobile') {
                $tab->where("user_mobile = '{$filter['values']['skey']}'");
            }
        }

        $pager = new RGX\page_helper($tab, $this->get('pn'), 24);
        $this->assign('list' , $tab->get_all());
        $this->assign('pobj', $pager->to_array());
        $this->assign('filter', $filter);
        $this->display('user/list.tpl');
    }

    /**
     * @method add_action
     */
    public function add_action () {
        $cur   =    '新增用户';
        $id    =    intval($this->get('id'));
        $data  =    [];


        if ( $id ) {
            $data    =    RGX\OBJ('user_table')->get(['user_id' => $id]);
            if ( !empty($data) ) {
                $cur =    '编辑【' . $data['user_no'] . '】';
            }
        }

        $this->assign('data' , $data);
        $this->set_pos('cur' , $cur);
        $this->display('user/add.tpl');
    }

    /**
     * [保存]
     * @method save_action
     * @return [type]      [description]
     */
    public function save_action () {
        $data           =    $this->get('data' , 'p');
        $ret['code']    =    1;
        if ( !empty($data) ) {
            $user_id    =    intval($data['user_id']) ? : 0;
            $tab    =    RGX\OBJ('user_table');

            if ( !$user_id ) {
                $data['user_register_date'] = date('Y-m-d H:i:s');
                if ( empty($data['user_password']) ) {
                    $data['user_password'] = '123456';
                }
            }

            if ( !empty($data['user_password']) ) {
                if ( !$user_id ) {
                    $salt = mt_rand(100001,900009);
                    $data['user_salt'] = $salt;
                }else{
                    $user = $tab->where("user_id={$user_id}")->limit(1)->get();
                    $salt = $user['user_salt'];
                }

                $data['user_password'] = sha1(md5($data['user_password']) . $salt);
            }else{
                unset($data['user_password']);
            }

            $tab->load($data);
            $ret           =    $tab->save();
            if ( !$user_id ) {
                $user_id = (int)$ret['row_id'];
            }
            $ret['code']  = 0;
            $ret['url']   = RGX\router::url('user-index');
        }
        $this->ajaxout($ret);
    }

     /**
     * [删除]
     * @method del_action
     * @return [type]     [description]
     */
    public function del_action () {
        $id    =    intval($this->get('id'));
        $ret   =    ['code' => 1];
        if ( $id ) {
            $tab    =    RGX\OBJ('user_table');
            $ret    =    $tab->delete(['user_id' => $id]);
            $this->ajaxout($ret);
        }
        $this->ajaxout($ret);
    }

} //Class End