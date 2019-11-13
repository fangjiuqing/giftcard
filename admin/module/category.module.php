<?php
namespace com\default_www;
use re\rgx as RGX;


/**
 * 类别管理
 */
class category_module extends admin_module {


    public function index_action () {
        $this->list_action();
    }

    /**
     * 列表
     */
    public function list_action () {
        $type_id = (int)$this->get('type') ?: 1;
        if (!isset(RGX\category_helper::$type[$type_id])) {
            $this->show_msg('无效的类型ID');
        }
        $type = RGX\category_helper::$type[$type_id];

        $this->set_pos([
            '@category-list'    => '类型管理',
            'cur'               => "{$type}分类"
        ]);

        $tab = RGX\OBJ('category_table')->where("cat_type = {$type_id}");
        $page = new RGX\page_helper($tab, intval($this->get('pn')), 128);
        $list = $tab->order("cat_level asc, cat_sort desc,cat_id asc")->get_all();
        //
        $tree = RGX\category_table::to_tree($list);
        $html = '<ul class="domtree" id="domtree">';
        foreach ($tree as $v) {
            $html .= $this->mk_html($v);
        }
        $this->assign('html', $html . '</ul>');
        $this->assign('pobj', $page->to_array());
        $this->assign('types', RGX\category_helper::$type);
        $this->assign('type_id', $type_id);
        $this->display('category/index.tpl');
    }


    private function mk_html ($data) {
        $ret  = "<li id=\"cat-{$data['cat_id']}\"><span><a href=\"" . RGX\URL('@category-add-id-%d', $data['cat_id']) . "\">{$data['cat_name']}</a>";
        $ret .= "<a href=\"" . RGX\URL('@category-add-parent-%d', $data['cat_id']) . "\" class=\"btn btn-primary btn-xs\">";
        $ret .= "<i class=\"fa fa-plus-square\"></i></a>&nbsp;&nbsp;";
        $ret .= '<a href="javascript:;" data-target="#cat-' . $data['cat_id'] . '" data-url="' . 
                    RGX\URL('@category-del-id-%d', $data['cat_id']) . '" class="btn btn-danger btn-xs btn-delete">';
        $ret .= '<i class="fa fa-trash-o"></i></a>';
        $ret .= '</span>';

        if (isset($data['nodes']) && !empty($data['nodes'])) {
            $ret .= "<ul>";
            foreach ($data['nodes'] as $k => $v) {
                $ret .= $this->mk_html($v);
            }
            $ret .= "</ul>";
        }
        return $ret . "</li>";
    }

    /**
     * 新增/编辑
     */
    public function add_action () {
        $id = intval($this->get('id'));
        $parent_id = intval($this->get('parent'));

        $cat = RGX\OBJ('category_table')->get([
            'cat_id'    => $id
        ]);
        // 更新
        if (!empty($cat)) {
            $type_id = $cat['cat_type'];
            $type = RGX\category_helper::$type[$cat['cat_type']];
            $this->set_pos([
                '@category-list-type-' . $cat['cat_type']   => "{$type}分类",
                'cur'   => "编辑「 {$cat['cat_name']} 」"
            ]);
            // #替换成换行符
            $cat['cat_desc'] = explode('#',$cat['cat_desc']);

            $this->assign('cat', $cat);
            $parent_id = $cat['cat_parent'];
        }
        // 新增
        else {
            $parent = RGX\OBJ('category_table')->get($parent_id);
            if (!empty($parent)) {
                $type_id = $parent['cat_type'];
                $type = RGX\category_helper::$type[$cat['cat_type']];
                $this->set_pos([
                    '@category-list-type-' . $type_id   => "{$type}分类",
                    'cur'   => "新增{$type}分类"
                ]);
            }
            else {
                // 分类类型ID
                $type_id = (int)$this->get('type') ?: 1;
                if (!isset(RGX\category_helper::$type[$type_id])) {
                    $this->show_msg('无效的类型ID');
                }
                $type = RGX\category_helper::$type[$type_id];
                $this->set_pos([
                    '@category-list-type-' . $type_id   => "{$type}分类",
                    'cur'   => "新增{$type}分类"
                ]);
            }
        }

        $this->assign('type_id', $type_id);
        $this->assign('parent_id', $parent_id);
        $this->assign('cat_tree', RGX\category_table::get_tree($type_id, 0, 1));
        $this->display('category/add.tpl');
    }

    /**
     * 保存
     */
    public function save_action () {
        $tab = RGX\OBJ('category_table');
        $cat = $this->get('cat', 'p');
        $cat_id = intval($cat['cat_id']);
        $sqls = [];
        if ($cat['cat_parent'] > 0) {
            $parent = $tab->get([
                'cat_id'    => $cat['cat_parent']
            ]);
            if (empty($parent)) {
                $this->show_msg('无效的父级分类');
            }
            if ($cat['cat_id'] == $cat['cat_parent']) {
                $this->ajax_failure(['cat_parent' => '不能设置分类自身为父级分类']);
            }
            $path = explode('#', substr($parent['cat_paths'], 1, -1));
            if ($cat['cat_id'] > 0 && in_array($cat['cat_id'], $path)) {
                $this->ajax_failure(['cat_parent' => '当前分类的子分类无法成为父级分类']);
            }
            $cat['cat_level'] = $parent['cat_level'] + 1;
            if ($cat_id > 0) {
                $cat['new_paths'] = $parent['cat_paths'] . "{$parent['cat_id']}#";
                $tab->where("cat_type = {$parent['cat_type']} and cat_paths like '{$cat['cat_paths']}{$cat['cat_id']}#%'")->map(function ($row) use (&$sqls, $cat){
                    $path = str_replace($cat['cat_paths'], $cat['new_paths'], $row['cat_paths']);
                    $level  = substr_count($path, '#') - 2;
                    $sqls[] = "update category_table set cat_paths = '{$path}',cat_level = {$level} where cat_id = {$row['cat_id']}";
                    return $row;
                })->get_all();
            }

            $cat['cat_type']  = $parent['cat_type'];
            $cat['cat_paths'] = $parent['cat_paths'] . "{$parent['cat_id']}#";
        }
        else {
            if ($cat_id > 0) {
                $tab->where("cat_type = {$cat['cat_type']} and cat_paths like '{$cat['cat_paths']}{$cat['cat_id']}#%'")->map(function ($row) use (&$sqls, $cat){
                    $path   = str_replace($cat['cat_paths'], "#0#", $row['cat_paths']);
                    $level  = substr_count($path, '#') - 2;
                    $sqls[] = "update category_table set cat_paths = '{$path}',cat_level = {$level} where cat_id = {$row['cat_id']}";
                    return $row;
                })->get_all();
            }

            $cat['cat_paths'] = '#0#';
            $cat['cat_level'] = 0;
        }

        // 空格换行符替换成#
        $cat['cat_desc'] = $cat['cat_desc'] ? join('#', preg_split('/\s+/uis', $cat['cat_desc'])) : '';
        if ($tab->load($cat)) {
            if ($cat['cat_id'] > 0) {
                $sqls[] = $tab->get_sql('update');
            }
            else {
                $sqls[] = $tab->get_sql('insert');
            }
            if ($tab->transaction($sqls)) {
                $this->ajax_success('操作成功', [], RGX\router::url('@category-list-type-' . $cat['cat_type']));
            }
        }
        $this->ajaxout([
            'code'  => 1,
            'error' => $tab->get_error()
        ]);
    }


    /**
     * 查看
     */
    public function view_action () {
        $id = intval($this->get('id'));
        $cat  = RGX\OBJ('category_table')->get([
            'cat_id'    => $id
        ]);
        if ($id) {
            $this->assign('tree', RGX\cat_cls::get_tree($id, 1, true));
            $this->assign('parent', RGX\OBJ('category_table')->get([
                'cat_id'    => $cat['cat_parent']
            ]));
        }
        $this->set_pos([
            '@cat'  => '类目管理',
            'cur'   => $cat['cat_name']
        ]);
        $this->add_menu([
            'url'   => 'cat',
            'label' => '返回'
        ], 'back');
        $this->assign('cat', $cat);
        $this->display('cat/view.tpl');
    }

    /**
     * [分类删除]
     * @method del_action
     * @return [type]     [description]
     */
    public function del_action() {
        $id = intval($this->get('id'));

        if (RGX\OBJ('category_table')->where([
                'cat_parent'    => $id
            ])->count() > 0) {
            $this->ajax_failure('请先删除子类别');
        }

        // 删除
        if (RGX\OBJ('category_table')->delete(['cat_id' => $id])['code'] === 0) {
            $this->ajax_success('删除成功');
        }
        $this->ajax_failure('删除失败');
    }
}