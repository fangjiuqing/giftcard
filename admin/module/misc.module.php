<?php
namespace com\default_admin;
use re\rgx as RGX;

class misc_module extends base_module {

    /**
     * 验证码
     * @return [type] [description]
     */
    public function geetest_action () {
        $this->sess();
        $ret = RGX\geetest_helper::get_instance(intval($this->get('pf')))->captcha();
        $this->sess_set('geetest_alive', $ret['alive']);
        $this->ajaxout($ret['data'], 'html');
    }

    /**
     * 图片验证码
     * @return [type] [description]
     */
    public function verify_action () {
        $this->sess();
        $code = mt_rand(1000, 9999);
        $this->sess_set('verify', $code);
        $this->nocache();
        RGX\image::get_instance()->captcha($code, [
            'font'      => DATA_PATH . 'fonts/Microsoft_Yahei.ttf',
            'width'     => 80,
            'height'    => 34,
            'fontsize'  => 24
        ]);
    }

    /**
     * 社保证明
     * @return [type] [description]
     */
    public function gsi_action () {
        $row = RGX\OBJ('employee_table')->left_join('employee_insure_table', 'emp_id', 'insure_emp_id')->get([
            'emp_sn'    => $this->get('sn') ?: ''
        ]);
        $doc = RGX\OBJ('document_table')->where("doc_id = " . intval($this->get('doc_id')))->get();
        $row['print_date']  = $doc['doc_si_pdate'] ?: REQUEST_TIME;
        $row['print_sdate'] = $doc['doc_si_sdate'] ?: REQUEST_TIME;
        $row['print_edate'] = $doc['doc_si_edate'] ?: REQUEST_TIME;

        if (!empty($row)) {
            RGX\document_helper::generate_si($row);
        }
    }

    /**
     * 社保证明
     * @return [type] [description]
     */
    public function glsi_action () {
        $row = RGX\OBJ('employee_table')->left_join('employee_insure_table', 'emp_id', 'insure_emp_id')->get([
            'emp_id'    => $this->get('id') ?: ''
        ]);
        $row['print_date']  = REQUEST_TIME;
        $row['print_sdate'] = $this->get('sdate') ?: REQUEST_TIME;
        $row['print_edate'] = $this->get('edate') ?: REQUEST_TIME;
        if (!empty($row)) {
            RGX\document_helper::generate_lsi($row);
        }
    }

    /**
     * 社保证明2
     * @return [type] [description]
     */
    public function glsi2_action () {
        $si = $this->get('d');
        if (!empty($si)) {
            $si = json_decode(base64_decode($si), 1);
            if (!empty($si)) {
                RGX\document_helper::generate_lsi2($si);
            }
        }
    }

    /**
     * 注销登录
     * @return [type] [description]
     */
    public function logout_action () {
        $this->sess();
        $this->sess_remove();
        $this->redirect('login');
    }

    /**
     * 获取指定PID下的地区列表
     * @return [type] [description]
     */
    public function region_action () {
        $pid = (int)$this->get('pid');
        $tab = RGX\OBJ('region_table');
        $this->ajax_success('', $tab->map(function ($row) {
            if ($row['level'] <= 2) {
                $row['name'] = str_replace([
                    '特别行政区',
                    '壮族自治区',
                    '回族自治区',
                    '回族自治州',
                    '土家族苗族自治县',
                    '苗族土家族自治县',
                    '土家族自治县',
                    '维吾尔自治区',
                    '蒙古族藏族自治州',
                    '哈萨克自治州',
                    '藏族自治州',
                    '自治区',
                    '自治州',
                    '省',
                    '市'
                ], '', $row['name']);
            }
            return [
                'id'    => $row['id'],
                'name'  => $row['name']
            ];
        })->get_all([
            'parent'        => function ($k) use ($pid) {
                return "{$k} = {$pid} and {$k} not in (1, 18, 2250, 795)";
            }
        ]));
    }

    public function js_action () {
        $this->display('misc/js.tpl');
    }

}