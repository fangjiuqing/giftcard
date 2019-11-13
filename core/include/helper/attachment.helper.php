<?php
namespace re\rgx;

/**
 * 附件助手类
 * $Id: common.helper.php 27 2017-07-21 09:50:28Z reginx $
 */
class attachment_helper extends rgx {

    public static function get_relation ( $attach_rlt_type , $attach_rlt_id ) {
        $tab    =    OBJ('attachment_relation_table')->where("attch_rlt_type = '{$attach_rlt_type}' AND attch_rlt_id = '{$attach_rlt_id}'");
        $tab->fields('attachment_relation_table.*,attachment_table.*');
        $tab->left_join('attachment_table' , 'attachment_relation_table.attch_id', 'attachment_table.attch_id');
        $tab->order('attch_sort asc');
        return $tab->get_all();
    }
} //Class End