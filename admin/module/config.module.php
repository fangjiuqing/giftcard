<?php
namespace com\default_www;
use re\rgx as RGX;

class config_module extends admin_module {

    /**
     * 配置项目
     * @var [type]
     */
    private $config_group = [
        'base'          => '系统配置',
        'info'          => '企业信息'
    ];

    /**
     * 配置更新
     * @return [type] [description]
     */
    public function save_action () {
        $key = $this->get('key');
        if (!isset($this->config_group[$key])) {
            if ($this->is_ajax) {
                $this->ajax_failure('无效的配置项目');
            }
            $this->show_msg('无效的配置项');
        }
        $config = $this->get('config', 'p');
        if (!empty($config)) {
            if ($key == 'material') {
                usort($config, function ($a, $b) {
                    return $a['sort'] > $b['sort'] ? 1 : 0;
                });
            }
            $this->ajaxout(RGX\OBJ('config_helper')->set($key, $config, $this->config_group[$key], $key) + ['msg' => '操作成功']);
        }
    }

    /**
     * 配置
     * @param  [type] $method [description]
     * @param  [type] $argv   [description]
     * @return [type]         [description]
     */
    public function __call ($method, $argv = null) {
        $key = str_replace('_action', '', $method);
        if (!isset($this->config_group[$key])) {
            if ($this->is_ajax) {
                $this->ajax_failure('无效的配置项目');
            }
            $this->show_msg('无效的配置项');
        }
        $this->set_pos([
            '@config-' . $key   => '系统设置',
            'cur'               => $this->config_group[$key]
        ]);
        $this->assign('config', RGX\OBJ('config_helper')->get($key) ?: []);
        $this->assign('config_key', $key);
        $this->display("config/config_{$key}.tpl");
    }

}