<?php
namespace com\default_admin;
use re\rgx as RGX;
/**
 * 车辆管理模块
 */
class car_module extends admin_module {
    /**
     * [企业信息列表]
     * @method index_action
     * @return [type]       [description]
     */
    public function index_action () {
        $this->set_pos('cur' , '车辆列表');
        $tab    =    RGX\OBJ('car_table');
        $car_type = RGX\common_helper::$car_type;
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
                        'label'     => '车牌号码',
                    ],
                    'options'   => [
                        'no'      => '车牌号码',
                        'name'    => '车辆名称',
                    ],
                    'input'     => [
                        'code'          => 'skey',
                        'placeholder'   => '请输入关键字'
                    ]
                ],
                [
                    'type'      => 'checkbox',
                    'code'      => 'type',
                    'options'   => $car_type,
                    'label'     => '全部类型'
                ],
            ]
        ];

        if (!empty($filter['values']['skey'])) {
            // 按编号检索
            if ($filter['values']['stype'] == 'no') {
                $tab->where("car_no = '{$filter['values']['skey']}'");
            }
            if ($filter['values']['stype'] == 'name') {
                $tab->where("car_name like '%{$filter['values']['skey']}%'");
            }
        }

        if (!empty($type)) {
            $where = [];
            foreach ($type as $type_id) {
                $where[] = "car_type = '{$type_id}'";
            }
            if (!empty($where)) {
                $tab->where(join(' or ',$where));
            }
        }

        $pager = new RGX\page_helper($tab, $this->get('pn'), 24);
        $this->assign('list' , $tab->get_all());
        $this->assign('pobj', $pager->to_array());
        $this->assign('filter', $filter);
        $this->assign('car_type' , $car_type);
        $this->display('car/list.tpl');
    }

    /**
     * @method add_action
     */
    public function add_action () {
        $cur   =    '新增车辆';
        $id    =    intval($this->get('id'));
        $data  =    [];


        if ( $id ) {
            $data    =    RGX\OBJ('car_table')->get(['car_id' => $id]);
            if ( !empty($data) ) {
                $cur =    '编辑【' . $data['car_no'] . '】';
            }
        }

        $this->assign('data' , $data);
        $this->assign('car_type' , RGX\common_helper::$car_type);
        $this->set_pos('cur' , $cur);
        $this->display('car/add.tpl');
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
            $car_id    =    intval($data['order_id']) ? : 0;
            $tab    =    RGX\OBJ('car_table');
            if ( $tab->load($data) ) {
                $ret           =    $tab->save();
                if ( !$car_id ) {
                    $car_id = (int)$ret['row_id'];
                }
                $ret['url']    =    RGX\router::url('car-index');
            }
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
            $tab    =    RGX\OBJ('car_table');
            $ret    =    $tab->delete(['car_id' => $id]);
            $this->ajaxout($ret);
        }
        $this->ajaxout($ret);
    }

} //Class End