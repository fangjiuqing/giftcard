<?php
namespace com\default_admin;
use re\rgx as RGX;
/**
 * 库存模块
 */
class product_module extends admin_module {
    /**
     * [企业信息列表]
     * @method index_action
     * @return [type]       [description]
     */
    public function index_action () {
        $this->set_pos('cur' , '库存概况');
        $type = $this->get('type') ? : '';
        $type = $type ? explode(',', $type) : [];

        // $cate = $this->get('cate') ? : '';
        // $cate = $cate ? explode(',', $cate) : [];

        $tab    =    RGX\OBJ('product_table');
        $filter = [
            'values'       => [
                'skey'          => RGX\filter::text(urldecode($this->get('skey'))) ?: '',
                'stype'         => $this->get('stype') ?: 'code',
                'type'          => $type,
                //'cate'          => $cate,
            ],
            'configs'       => [
                [
                    'name'      => 'stype',
                    'type'      => 'select',
                    'default'   => [
                        'value'     => 'code',
                        'label'     => '产品编号',
                    ],
                    'options'   => [
                        'code'     => '产品编号',
                    ],
                    'input'     => [
                        'code'          => 'skey',
                        'placeholder'   => '请输入关键字'
                    ]
                ],

                [
                    'type'      => 'checkbox',
                    'code'      => 'type',
                    'options'   => RGX\common_helper::$code_level,
                    'label'     => '全部等级'
                ],

                // [
                //     'type'      => 'checkbox',
                //     'code'      => 'cate',
                //     'options'   => RGX\common_helper::$cate_type,
                //     'label'     => '全部类型'
                // ],
            ],

        ];

        if (!empty($filter['values']['skey'])) {
            // 按编号检索
            if ($filter['values']['stype'] == 'code') {
                $tab->where("pro_no = '{$filter['values']['skey']}'");
            }
        }

        if (!empty($type)) {
            $where = [];
            foreach ($type as $type_id) {
                $where[] = "pro_type = '{$type_id}'";
            }
            if (!empty($where)) {
                $tab->where(join(' or ',$where));
            }
        }

        if (!empty($cate)) {
            $where = [];
            foreach ($cate as $cate_id) {
                $where[] = "pro_cate = '{$cate_id}'";
            }
            if (!empty($where)) {
                $tab->where(join(' or ',$where));
            }
        }

        $pager = new RGX\page_helper($tab, $this->get('pn'), 24);
        $this->assign('list' , $tab->order('pro_id desc')->get_all());
        $this->assign('pobj', $pager->to_array());
        $this->assign('filter', $filter);
        $this->assign('pro_type' , RGX\common_helper::$code_level);
        //$this->assign('cate_type' , RGX\common_helper::$cate_type);

        ## 新增统计
        $statistic = RGX\product_helper::statistic();
        $this->assign('statistic' , $statistic);
        $this->display('product/list.tpl');
    }

    /**
     * @method add_action
     */
    public function add_action () {
        $cur   =    '新增产品';
        $id    =    intval($this->get('id'));
        $data  =    [];


        if ( $id ) {
            $data    =    RGX\OBJ('product_table')->get(['pro_id' => $id]);
            if ( !empty($data) ) {
                $cur =    '编辑【' . $data['pro_no'] . '】';
            }
        }

        $this->assign('data' , $data);
        $this->assign('pro_type' , RGX\common_helper::$code_level);
        //$this->assign('cate_type' , RGX\common_helper::$cate_type);
        $this->set_pos('cur' , $cur);
        $this->display('product/add.tpl');
    }

    /**
     * @method store_action
     */
    public function store_action () {
        $cur   =    '调整库存';
        $id    =    intval($this->get('id'));
        $data  =    [];


        if ( $id ) {
            $data    =    RGX\OBJ('product_table')->get(['pro_id' => $id]);
            if ( !empty($data) ) {
                $cur =    '编辑【' . $data['pro_no'] . '】';
            }
        }

        $this->assign('data' , $data);
        $this->assign('pro_type' , RGX\common_helper::$code_level);
        $this->set_pos('cur' , $cur);
        $this->display('product/store.tpl');
    }

    /**
     * [保存]
     * @method save_action
     * @return [type]      [description]
     */
    public function storesave_action () {
        $log           =    $this->get('log' , 'p');
        $ret['code']   =    1;

        if ( !empty($log) ) {
            $pro_id    =    intval($log['pro_id']) ? : 0;

            $op_type = $log['op_type'] ? : '增加';
            $op_num  = intval($log['op_num']);

            if ( !$op_num ) {
                $ret['msg'] = '调整数量不能为0';
                $this->ajaxout($ret);
            }

            $log['op_remark'] = trim($log['op_remark']);
            if ( empty($log['op_remark']) ) {
                $ret['msg'] = '备注说明不能为空';
                $this->ajaxout($ret);
            }

            if ( $op_type == '增加' ) {
                $sql = sprintf("UPDATE product_table SET pro_store = pro_store + %d WHERE pro_id = %d" , $op_num , $pro_id);

                $log['opd_store'] = $log['ori_store'] + $op_num;

            }else if ( $op_type == '减少' ) {
                $sql = sprintf("UPDATE product_table SET pro_store = pro_store - %d WHERE pro_id = %d" , $op_num , $pro_id);
                $log['opd_store'] = $log['ori_store'] - $op_num;
            }else{
                $ret['msg'] = '未知的调整类型';
                $this->ajaxout($ret);
            }

            if ( !$log['opd_store'] ) {
                $ret['msg'] = '调整后库存为负数，无法执行';
                $this->ajaxout($ret);
            }

            ## 01更新产品库存
            $tab    =    RGX\OBJ('product_table');
            if ( $tab->exec($sql) ) {
                ## 02 记录库存日志
                $log['op_time'] = date('Y-m-d H:i:s');
                $log['op_remark'] .= ',' . $log['op_type'] . '了' . $op_num;
                $log['op_admin'] = $_SESSION['admin']['admin_realname'];
                $log_tab = RGX\OBJ('store_log_table');
                $log_tab->load($log);
                $ret = $log_tab->save();

                $ret['code'] =0;
                $ret['url']    =    RGX\router::url('product-index');
            }
        }
        $this->ajaxout($ret);
    }

    /**
     * [保存]
     * @method save_action
     * @return [type]      [description]
     */
    public function save_action () {
        $data          =    $this->get('data' , 'p');
        $log           =    $this->get('log' , 'p');
        $ret['code']   =    1;
        if ( !empty($data) ) {
            $pro_id    =    intval($data['pro_id']) ? : 0;
            $tab    =    RGX\OBJ('product_table');
            $tab->load($data);
            $ret           =    $tab->save();
            if ( !$pro_id ) {
                $pro_id = (int)$ret['row_id'];
            }

            if ( $log['ori_store'] != $data['pro_store'] ) {
                if ( $log['ori_store'] < $data['pro_store'] ) {
                    $log['op_remark'] = '增加了'. ($data['pro_store'] - $log['ori_store']);
                    $log['op_type'] = '增加';
                }else{
                    $log['op_remark'] = '减少了' . ( $log['ori_store'] - $data['pro_store'] );
                    $log['op_type'] = '减少';
                }
                $log['pro_id'] = $pro_id;
                $log['opd_store'] = $data['pro_store'];
                $log['op_time'] = date('Y-m-d H:i:s');
                $log['op_admin'] = $_SESSION['admin']['admin_realname'];
                $log_tab = RGX\OBJ('store_log_table');
                $log_tab->load($log);
                $ret = $log_tab->save();
            }

            $ret['code'] =0;
            $ret['url']    =    RGX\router::url('product-index');
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
            $tab    =    RGX\OBJ('product_table');
            $ret    =    $tab->delete(['pro_id' => $id]);

            ## 库存日志一起删除
            RGX\OBJ('store_log_table')->delete(['pro_id' => $id]);

            $this->ajaxout($ret);
        }
        $this->ajaxout($ret);
    }

    /**
     * 库存日志
     * @return [type] [description]
     */
    public function log_action () {
        $this->set_pos('cur' , '库存日志');
        $pro_id = (int)$this->get('id');
        $tab    =    RGX\OBJ('store_log_table');
        $tab->where("pro_id = $pro_id");
        $pager = new RGX\page_helper($tab, $this->get('pn'), 50);
        $this->assign('list' , $tab->order('op_time desc')->get_all());
        $this->assign('pobj', $pager->to_array());

        $data    =    RGX\OBJ('product_table')->get(['pro_id' => $pro_id]);
        $this->assign('data' , $data);

        $this->display('product/log.tpl');
    }

} //Class End