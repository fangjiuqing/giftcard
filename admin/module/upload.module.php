<?php
namespace com\default_admin;
use re\rgx as RGX;

class upload_module extends admin_module {


    /**
     * 图片上传接口
     * @return [type] [description]
     */
    public function image_action () {

        $upload = new RGX\upload_helper('JPG|JPEG|GIF|PNG', '8m');
        $out = [
            'code'  => 0,
            'msg'   => ''
        ];
        $file            = $upload->get();
        $file['url']     = $file['savedir'] . $file['savename'];

        // 新增上传记录
        $file['file_id'] = RGX\upload_helper::addrecord($file['url'] , $file['size'],$file['name'] , '', $file['ext']);


        $out['data']      = $file;
        if ($out['data']['error']) {
            $out['code']  = 1;
            $out['error'] = $out['msg']= $out['data']['error'];
        }
        else {
            //$out['data']['url'] = $out['data']['savedir'] . $out['data']['savename'];
            $sfile = UPLOAD_PATH . $out['data']['url'];
            RGX\image::get_instance()->thumb($sfile, $sfile, '800xauto');
            RGX\image::get_instance()->thumb($sfile, '400xauto');
        }
        $this->ajaxout($out);
    }

    /**
     * 附件删除
     * @return [type] [description]
     */
    public function remove_action () {
        $this->ajax_failure('删除失败了');
    }

    /**
     * data url 上传
     * @return [type] [description]
     */
    public function base64_action () {
        $out = [];
        $base64str = $this->get('source', 'p');
        $ref_id = (int)$this->get('ref_id', 'p');
        $channel_id = (int)$this->get('channel_id', 'p');
        if ($channel_id > 0 && !RGX\common_helper::exists_channel($channel_id)) {
            $this->ajax_failure('文件上传失败了, 无效的频道ID');
        }
        if (!preg_match('/^data\:\s*(\w+)\/(\w+);base64\,/i', $base64str, $mts)) {
            $this->ajax_failure('invalid request');
        }
        $dir  = RGX\common_helper::get_upload_dir($channel_id);
        $file = "pre_" . strtolower(RGX\misc::randstr(16)) . '.jpg';
        $out['url']  = "{$dir}{$file}";
        if (file_put_contents(UPLOAD_PATH . $out['url'], base64_decode(str_replace($mts[0], '', $base64str)), LOCK_EX)) {
            $out['size'] = filesize(UPLOAD_PATH . $out['url']);
            $out['mime'] = 'image/jpeg';
            $out['sync'] = true;
            RGX\attachment_helper::add_file($this->login['user_id'], $out, [
                'ref_id'        => $ref_id,
                'channel_id'    => $channel_id
            ]);
            $this->ajax_success('', $out);
        }
        $this->ajax_failure('写入上传文件失败');
    }

    /**
     * data url 上传
     * @return [type] [description]
     */
    public function url_action () {
        $out = [];
        $url = $this->get('url', 'p');
        $ref_id = (int)$this->get('ref_id', 'p');
        $channel_id = (int)$this->get('channel_id', 'p');
        if (!RGX\common_helper::exists_channel($channel_id)) {
            $this->ajax_failure('文件上传失败了, 无效的频道ID');
        }
        $img  = RGX\curl_helper::get_raw($url);
        if ($img['code'] != '200') {
            $this->ajax_failure('获取远程内容失败');
        }
        $dir  = RGX\common_helper::get_upload_dir($channel_id);
        $file = "pre_" . strtolower(RGX\misc::randstr(16)) . '.jpg';
        $out['url']  = "{$dir}{$file}";
        if (file_put_contents(UPLOAD_PATH . $out['url'], $img['html'], LOCK_EX)) {

            $config = RGX\config_helper::get_config('attachment');
            $thumbs = explode(',', $config[RGX\common_helper::$type_code[$channel_id] . '_thumb'] ?: '') ?: [];
            $sfile  = UPLOAD_PATH . $out['url'];

            RGX\image::get_instance()->thumb($sfile, $sfile, $config[RGX\common_helper::$type_code[$channel_id] . '_thumb_big']);

            foreach ((array)$thumbs as $v) {
                $tfile = RGX\image::get_instance()->thumb($sfile, $v);
                if (!empty($tfile)) {
                    $tfile = str_replace(UPLOAD_PATH, '', $tfile);
                    RGX\attachment_helper::add_file($this->login['user_id'], [
                        'url'           => $tfile,
                        'size'          => filesize(UPLOAD_PATH . $tfile),
                        'mime'          => 'image/jpeg',
                        'sync'          => true
                    ], [
                        'ref_id'        => $ref_id,
                        'channel_id'    => $channel_id
                    ]);
                }
            }

            $out['size'] = filesize(UPLOAD_PATH . $out['url']);
            $out['mime'] = 'image/jpeg';
            $out['sync'] = true;
            $out['id']   = RGX\attachment_helper::add_file($this->login['user_id'], $out, [
                'ref_id'        => $ref_id,
                'channel_id'    => $channel_id
            ]);
            $this->ajax_success('', $out);
        }
        $this->ajax_failure('写入上传文件失败');
    }

    /**
     * 分片上传接口
     * @return [type] [description]
     */
    public function file_action () {
        $ret   = [];
        $count = (int)$_POST['chunk_count'];
        $file_size = intval($_POST['file_size']);
        $ext = $_POST['file_ext'];
        // 请求为分片
        if ($count > 0) {
            $type = $_POST['file_type'];
            $chunk_helper = new RGX\chunk_helper('chunk_blob', $_POST['file_name'], (int)$_POST['file_size']);

            if ($type != '') {
                $ext = RGX\common_helper::is_allowed($type);
                if (!$ext) {
                    $this->ajax_failure('无法上传该类型文件1');
                }

            }
            if (!RGX\common_helper::is_allowed_ext($ext)) {
                $this->ajax_failure('无法上传该类型文件4' . $ext);
            }
            else {
                $type = RGX\common_helper::$allow_mime[$ext];
                $type = is_array($type) ? $type[0] : $type;
            }

            if (!$chunk_helper->check($_POST['chunk_md5'])) {
                $this->ajax_failure('分片校验失败');
            }

            $file = $chunk_helper->get((int)$_POST['chunk_index'], $count)->save($this->login['admin_id'], $type);
            if ($file) {
                if ($chunk_helper->is_finished()) {
                    $file = $chunk_helper->get_file_name($channel_id, $type, $ext);
                    if ($chunk_helper->merge($this->login['admin_id'], $file)) {
                        if (!RGX\upload_helper::check_mime_type(UPLOAD_PATH . $file)) {
                            unlink(UPLOAD_PATH . $file);
                            $this->ajax_failure('无法上传该类型文件3');
                        }
                        $file_size = $file_size ?: filesize(UPLOAD_PATH . $file);
                        $ret['file'] = $file;
                        $ret['finished'] = 1;
                        $ret['filesize'] = $file_size;
                        $ret['file_ext'] = $ext;
                        $ret['date'] = date('Y-m-d H:i', REQUEST_TIME);
                        $ret['name'] = $_POST['file_name'];
                        $ret['owner'] = $this->login['admin_nickname'];
                        $this->ajax_success('', $ret);
                    }
                }
                $this->ajax_success($file, ['file' => '']);
            }
        }
        $this->ajax_failure('操作失败了');
    }
}