<?php
namespace re\rgx;

class product_helper extends rgx {
    public static function statistic () {
        $all_codes = OBJ('codes_table')->get_all();
        $code_level = common_helper::$code_level;

        $recate = [];
        foreach ( $all_codes as $v ) {
            $recate[$v['code_level']]['list'][] = $v;
        }
        ksort($recate);

        $tab = OBJ('product_table');
        foreach ( $code_level as $k => $v ) {
            $pro_store = $tab->fields('SUM(pro_store) as pro_store')->get(['pro_type' => $k]);
            $recate[$k]['store_total'] = $pro_store['pro_store'];
            $recate[$k]['name'] = $v;
            $recate[$k]['nums'] = is_array($recate[$k]['list']) ? count($recate[$k]['list']) : 0;

            $recate[$k]['unuse'] = 0;
            $recate[$k]['register'] = 0;
            $recate[$k]['complate'] = 0;

            if ( !empty($recate[$k]['list']) ) {
                foreach ( $recate[$k]['list'] as $v ) {
                    if ( $v['code_status'] == 1 ) {
                        $recate[$k]['unuse'] += 1;
                    }
                    if ( $v['code_status'] == 2 ) {
                        $recate[$k]['register'] += 1;
                    }
                    if ( $v['code_status'] == 3 ) {
                        $recate[$k]['complate'] += 1;
                    }
                }
            }
            unset($recate[$k]['list']);

        }
        return $recate;
    }
} //Class End