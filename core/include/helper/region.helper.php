<?php
namespace re\rgx;

class region_helper {


    /**
     * 获取地区列表
     *
     * @param unknown_type $parent
     * @param unknown_type $level
     * @return unknown
     */
    public static function get_array ($parent, $level = 1) {
        $ret = array();
        $tab = OBJ('region_table')->order("sort desc");
        $tab->where("parent = {$parent} and $level = $level");
        $data = $tab->getall();
        foreach ((array)$data as $k => $v) {
            $ret[$v['id']] = $v['name'];
        }
        return $ret;
    }

    /**
     * 获取地区列表
     *
     * @param unknown_type $parent
     * @param unknown_type $level
     * @return unknown
     */
    public static function getlist ($parent, $level = 1) {
        $ret = array();
        $tab = OBJ('region_table');
        $tab->where("parent = {$parent} and $level = $level");
        return $tab->get_all();
    }

    /**
     * 根据ID批量获取地域信息
     *
     * @param unknown_type $ids
     * @return unknown
     */
    public static function getlistbyids ($ids = array()) {
        $ret = array();
        if (!empty($ids)) {
            $ids = array_map('intval', $ids);
            $ret = OBJ('region_table')->fields('*')
                    ->where("id in (" . join(',', $ids) . ")")->akey('id')->get_all();
        }
        return $ret;
    }

    public static function getnamebyid ($id = 0 , $level = 0) {
        $name = '';
        if (intval($id)) {
            $tab = OBJ('region_table')->fields('name')->where("id={$id}");
            if ( $level ) {
                $tab->where('level = ' . $level);
            }
            $ret = $tab->get();
            if (!empty($ret)) {
                $name = $ret['name'];
            }
        }
        return $name;
    }


    /**
     * 根据百度球面坐标计算两点距离
     *
     * @param unknown_type $sc 起始
     * @param unknown_type $ec 结束
     * @return unknown
     */
    public static function get_distance ($sc, $ec) {
        $lat1 = (M_PI / 180) * doubleval($sc[0]);
        $lat2 = (M_PI / 180) * doubleval($ec[0]);

        $lon1 = (M_PI / 180) * doubleval($sc[1]);
        $lon2 = (M_PI / 180) * doubleval($ec[1]);
        //地球半径
        $r = 6370.99681;
        return acos(sin($lat1) * sin($lat2) + cos($lat1) * cos($lat2) * cos($lon2-$lon1)) * $r * 1000;
    }

    public static function get_dist ($sc, $ec) {
        $pk = 180 / M_PI;
        $a1 = doubleval($sc[0]) / $pk;
        $a2 = doubleval($sc[1]) / $pk;
        $b1 = doubleval($ec[0]) / $pk;
        $b2 = doubleval($ec[1]) / $pk;
        $t1 = cos($a1) * cos($a2) * cos($b1) * cos($b2);
        $t2 = cos($a1) * sin($a2) * cos($b1) * sin($b2);
        $t3 = sin($a1) * sin($b1);
        $tt = acos($t1 + $t2 + $t3);
        return 6370996.81 * $tt;
    }
}