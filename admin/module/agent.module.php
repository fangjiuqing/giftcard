<?php
namespace com\default_admin;
use re\rgx as RGX;
/**
 * 代理人模块
 */
class agent_module extends admin_module {
    /**
     * [企业信息列表]
     * @method index_action
     * @return [type]       [description]
     */
    public function index_action () {
        $this->set_pos('cur' , '代理人列表');
        $tab    =    RGX\OBJ('agent_table');
        $agent_type = RGX\common_helper::$agent_type;
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
                        'label'     => '代理编码',
                    ],
                    'options'   => [
                        'no'      => '代理编码',
                        'name'    => '代理姓名',
                        'mobile'  => '代理手机号',
                    ],
                    'input'     => [
                        'code'          => 'skey',
                        'placeholder'   => '请输入关键字'
                    ]
                ],
                [
                    'type'      => 'checkbox',
                    'code'      => 'type',
                    'options'   => $agent_type,
                    'label'     => '全部类型'
                ],
            ]
        ];

        if (!empty($filter['values']['skey'])) {
            // 按编号检索
            if ($filter['values']['stype'] == 'name') {
                $tab->where("agent_fullname = '{$filter['values']['skey']}'");
            }
            if ($filter['values']['stype'] == 'no') {
                $tab->where("agent_code like '%{$filter['values']['skey']}%'");
            }
            if ($filter['values']['stype'] == 'mobile') {
                $tab->where("agent_mobile = '{$filter['values']['skey']}'");
            }
        }

        if (!empty($type)) {
            $where = [];
            foreach ($type as $type_id) {
                $where[] = "agent_level = '{$type_id}'";
            }
            if (!empty($where)) {
                $tab->where(join(' or ',$where));
            }
        }
        # all agents
        $order_tab = RGX\OBJ('codes_table');
        $code_level = RGX\common_helper::$code_level;

        $init = array_flip(array_values($code_level));

        $init = [];
        foreach ( $code_level as $k => $v ) {
            $init[$k] = [
                'name' => $v,
                'nums' => 0
            ];
        }

        $tab->map(function($row) use ($order_tab , $code_level , $init) {
            $row['agent_order_nums'] = $order_tab->where("agent_id = " . $row['agent_id'])->count();

            ## 按卡分类
            $all = $order_tab->where("agent_id = " . $row['agent_id'])->get_all();
            if ( !empty($all) ) {
                foreach ($all as $v ) {
                    foreach ( $init as $ik => &$iv ) {
                        if ( $v['code_level'] == $ik ) {
                            $iv['nums'] += 1;
                        }
                    }
                }
            }
            $row['agent_summary'] = $init;
            return $row;
        });
//echo '<pre>';print_r($tab->get_all());die;
        $pager = new RGX\page_helper($tab, $this->get('pn'), 24);
        $this->assign('list' , $tab->get_all());
        $this->assign('pobj', $pager->to_array());
        $this->assign('filter', $filter);
        $this->assign('agent_type' , $agent_type);
        $this->display('agent/list.tpl');
    }

    /**
     * @method add_action
     */
    public function add_action () {
        $cur   =    '新增代理人';
        $id    =    intval($this->get('id'));
        $data  =    [];


        if ( $id ) {
            $data    =    RGX\OBJ('agent_table')->get(['agent_id' => $id]);
            if ( !empty($data) ) {
                $cur =    '编辑【' . $data['agent_no'] . '】';
            }
        }

        $this->assign('data' , $data);
        $this->assign('agent_type' , RGX\common_helper::$agent_type);
        $this->set_pos('cur' , $cur);
        $this->display('agent/add.tpl');
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
            $agent_id    =    intval($data['agent_id']) ? : 0;
            if ( $agent_id ) {
                $ori_agent = RGX\OBJ('agent_table')->where("agent_id = {$agent_id}")->get();
                $agent_remark = $ori_agent['remark'] . PHP_EOL;

                if ( $data['remark'] ) {
                    $data['remark'] = $agent_remark . $data['remark'];
                }
            }

            $tab    =    RGX\OBJ('agent_table');
            $data['agent_create_time'] = date('Y-m-d H:i:s');
            $tab->load($data);
            $ret           =    $tab->save();
            if ( !$agent_id ) {
                $agent_id = (int)$ret['row_id'];
            }
            $ret['code'] =0;
            $ret['url']    =    RGX\router::url('agent-index');
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
            $tab    =    RGX\OBJ('agent_table');
            $ret    =    $tab->delete(['agent_id' => $id]);
            $this->ajaxout($ret);
        }
        $this->ajaxout($ret);
    }

} //Class End