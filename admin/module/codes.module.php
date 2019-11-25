<?php
namespace com\default_admin;
use re\rgx as RGX;
/**
 * 兑码模块
 */
class codes_module extends admin_module {
    /**
     * [企业信息列表]
     * @method index_action
     * @return [type]       [description]
     */
    public function index_action () {
        $this->set_pos('cur' , '兑码列表');
        $type = $this->get('type') ? : '';
        $type = $type ? explode(',', $type) : [];

        $level = $this->get('level') ? : '';
        $level = $level ? explode(',', $level) : [];

        $oprator = RGX\filter::text(urldecode($this->get('oprator'))) ? : '';
        $oprator = $oprator ? explode(',', $oprator) : [];

        $tab    =    RGX\OBJ('codes_table');
        $filter = [
            'values'       => [
                'skey'          => RGX\filter::text(urldecode($this->get('skey'))) ?: '',
                'stype'         => $this->get('stype') ?: 'code',
                'type'          => $type,
                'level'         => $level,
                'oprator'       => $oprator,
            ],
            'configs'       => [
                [
                    'name'      => 'stype',
                    'type'      => 'select',
                    'default'   => [
                        'value'     => 'code',
                        'label'     => '兑码编号',
                    ],
                    'options'   => [
                        'code'     => '兑码编号',
                    ],
                    'input'     => [
                        'code'          => 'skey',
                        'placeholder'   => '请输入关键字'
                    ]
                ],

                [
                    'type'      => 'checkbox',
                    'code'      => 'type',
                    'options'   => RGX\common_helper::$code_status,
                    'label'     => '全部状态'
                ],

                [
                    'type'      => 'checkbox',
                    'code'      => 'level',
                    'options'   => RGX\common_helper::$code_level,
                    'label'     => '全部卡种'
                ],

                [
                    'type'      => 'checkbox',
                    'code'      => 'oprator',
                    'options'   => RGX\common_helper::get_admin(),
                    'label'     => '全部人员'
                ]
            ],

        ];

        if (!empty($filter['values']['skey'])) {
            // 按编号检索
            if ($filter['values']['stype'] == 'code') {
                $tab->where("codes_table.code = '{$filter['values']['skey']}'");
            }
        }

        if (!empty($type)) {
            $where = [];
            foreach ($type as $type_id) {
                $where[] = "codes_table.code_status = '{$type_id}'";
            }
            if (!empty($where)) {
                $tab->where(join(' or ',$where));
            }
        }

        if (!empty($level)) {
            $where = [];
            foreach ($level as $level_id) {
                $where[] = "codes_table.code_level = '{$level_id}'";
            }
            if (!empty($where)) {
                $tab->where(join(' or ',$where));
            }
        }

        ## 按操作管理员筛选
        if ( !empty($oprator) ) {
            $where = [];
            foreach ($oprator as $oprator_name) {
                $where[] = "op_admin = '{$oprator_name}'";
            }
            $use_tab = RGX\OBJ('code_use_table')->fields('code');
            if (!empty($where)) {
                $use_tab->where(join(' or ',$where));
                $codes = $use_tab->get_all();

                if ( !empty($codes) ) {
                    $codes_str = [];
                    foreach ( $codes as $code ) {
                        $codes_str[] = $code['code'];
                    }
                    $codes_str = implode("','" , $codes_str);
                    $tab->where("codes_table.code in ('" . $codes_str . "')");
                }
            }
        }

        $pager = new RGX\page_helper($tab, $this->get('pn'), 24);
        $this->assign('list' , $tab->order('create_time desc')->get_all());
        $this->assign('pobj', $pager->to_array());
        $this->assign('filter', $filter);
        $this->assign('code_level' , RGX\common_helper::$code_level);
        $this->assign('code_status',RGX\common_helper::$code_status);
        $this->assign('agents' , RGX\OBJ('agent_table')->get_all());
        $this->display('codes/list.tpl');
    }

    /**
     * 分配代理商
     * @return [type] [description]
     */
    public function assign_action () {
        $agent_id = intval($this->get('agent_id' , 'p'));
        $codes = $this->get('codes' , 'p');

        $result = [
            'code' => 500,
            'data' => '',
            'msg'  => '操作失败'
        ];

        if ( !$agent_id ) {
            $result['msg'] = '代理商不能为空';
            $this->ajaxout($result);
        }

        if ( !$codes ) {
            $result['msg'] = '兑换码不能为空';
            $this->ajaxout($result);
        }
        $codes = explode(',' , $codes);
        $sql = sprintf("UPDATE codes_table SET agent_id = %d WHERE code_id IN ('%s')" , $agent_id , implode("','" , $codes));
        $tab = RGX\OBJ('codes_table');

        if ( $tab->exec($sql) ) {
            $result['code'] = 0;
            $result['msg'] = '操作成功';
        }
        $this->ajaxout($result);
    }

    public function generate_action () {
        $this->set_pos('cur' , '批量生成');
        $this->assign('code_level' , RGX\common_helper::$code_level);
        $this->display('codes/generate.tpl');
    }

    /**
     * 兑码保存
     * @return [type] [description]
     */
    public function save_action () {
        $code = $this->get('data' , 'p');
        $level = (int)$this->get('level' , 'p');

        $temp = json_decode($code,true);

        // 两次反转进行去重
        $code_list = array_flip(array_flip($temp));

        $tab = RGX\OBJ('codes_table');

        $sql = 'INSERT IGNORE INTO codes_table (code , code_level, create_time) VALUES ';
        $create_time = date('Y-m-d H:i:s');
        foreach ( $code_list as $code ) {
            $sql .= sprintf("('%s' , %d, '%s')," , $code, $level , $create_time);
        }
        $sql = rtrim($sql , ',');

        $result = [
            'code' => 500,
            'data' => '',
            'msg'  => ''
        ];

        try {
            $res = $tab->exec($sql);
            if ( $res ) {
                $result['code'] = 200;
                $result['data'] = json_encode($code_list);
            }
        } catch ( Exception $e ) {
            $result['msg'] = $e->getMessage();
        }

        $this->ajaxout($result);
    }

    /**
     * [use_action description]
     * @return [type] [description]
     */
    public function use_action () {
        $code = $this->get('code');
        if ( $code ) {
            $this->assign('code' , $code);
            $this->assign('code_level' , RGX\common_helper::$code_level);

            // code已使用，仅展示
            $tab = RGX\OBJ('codes_table');
            $tab->left_join('code_use_table' , 'codes_table.code' , 'code_use_table.code');
            $tab->where("code = '{$code}'");

            $info = $tab->get();
            $this->assign('products' , RGX\OBJ('product_table')->where("pro_type = " . $info['code_level'])->get_all());
            $this->assign('data',$info);
            $this->assign('code_status',RGX\common_helper::$code_status);

            ## 非管理、员工
            if ( $this->admin['admin_group'] == 2 ) {
                $admin_group = RGX\common_helper::get_admin();
                $this->assign('admin_group' , $admin_group);
            }else{
                $this->assign('admin_name' , $this->admin['admin_realname']);
            }
            $this->display('codes/use.tpl');
        }
    }

    /**
     * 使用情况保存
     * @return [type] [description]
     */
    public function usesave_action () {
        $data           =    $this->get('data' , 'p');
        $ret['code']    =    0;
        if ( !empty($data) ) {
            $id    =    intval($data['id']) ? : 0;
            if ( !$id ) {
                $pro_id = intval($data['pro_id']);
                $pro_info = RGX\OBJ('product_table')->get([
                    'pro_id' => $pro_id
                ]);

                ## 检查库存是否充足
                if ( $pro_info['pro_store'] < $data['use_nums'] ) {
                    $ret['msg'] = '可用库存不足';
                    $this->ajaxout($ret);
                }

                $tab    =    RGX\OBJ('code_use_table');

                $data['create_date'] = date('Y-m-d H:i:s');
                $tab->load($data);
                $ret    =    $tab->save();

                if ( $ret['row_id'] > 0 ) {
                    $sql = sprintf("UPDATE codes_table SET code_status = %d WHERE code = '%s'" , $data['code_status'] , $data['code']);
                    $exe = $tab->exec($sql);

                    ## 库存日志变动
                    $log['ori_store'] = $pro_info['pro_store'];
                    $log['op_remark'] = '使用兑换码【'.$data['code'].'】兑换，减少库存' . $data['use_nums'];
                    $log['op_type'] = '减少';
                    $log['pro_id'] = $pro_id;
                    $log['opd_store'] = $pro_info['pro_store'] - $data['use_nums'];
                    $log['op_time'] = $data['create_date'];
                    $log_tab = RGX\OBJ('store_log_table');
                    $log_tab->load($log);
                    $ret = $log_tab->save();

                    ## 更新产品库存
                    $sql = sprintf("UPDATE product_table SET pro_store = %d WHERE pro_id = %d" , $log['opd_store'] , $pro_id);
                    $exe = $tab->exec($sql);

                }else{
                    $ret['code'] = 1;
                }
            }
        }

        $ret['url']    =    RGX\router::url('codes-index');
        $this->ajaxout($ret);
    }

    /**
     * @method add_action
     */
    public function add_action () {
        $this->generate_action();

        $cur   =    '新增兑码';
        $id    =    intval($this->get('id'));
        $data  =    [];


        if ( $id ) {
            $data    =    RGX\OBJ('codes_table')->get(['codes_id' => $id]);
            if ( !empty($data) ) {
                $cur =    '编辑【' . $data['codes_no'] . '】';
            }
        }

        $this->assign('data' , $data);
        $this->assign('codes_status' , RGX\common_helper::$codes_status);
        $this->assign('agents' , RGX\OBJ('agent_table')->get_all());
        $this->set_pos('cur' , $cur);
        $this->display('codes/add.tpl');
    }

    /**
     * [保存]
     * @method save_action
     * @return [type]      [description]
     */
    // public function usesave_action () {
    //     $data           =    $this->get('data' , 'p');
    //     $ret['code']    =    1;
    //     if ( !empty($data) ) {
    //         $codes_id    =    intval($data['codes_id']) ? : 0;
    //         $tab    =    RGX\OBJ('codes_table');
    //         $tab->load($data);
    //         $ret           =    $tab->save();
    //         if ( !$codes_id ) {
    //             $codes_id = (int)$ret['row_id'];
    //         }
    //         $ret['code'] =0;
    //         $ret['url']    =    RGX\router::url('codes-index');
    //     }
    //     $this->ajaxout($ret);
    // }

     /**
     * [删除]
     * @method del_action
     * @return [type]     [description]
     */
    public function del_action () {
        $id    =    intval($this->get('id'));
        $ret   =    ['code' => 1];
        if ( $id ) {
            $tab    =    RGX\OBJ('codes_table');
            $ret    =    $tab->delete(['code_id' => $id]);
            $this->ajaxout($ret);
        }
        $this->ajaxout($ret);
    }

} //Class End