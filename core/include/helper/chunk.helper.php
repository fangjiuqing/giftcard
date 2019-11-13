<?php
namespace re\rgx;

class chunk_helper {

    public $key = null;

    public $index = 0;

    public $count = 0;

    public $id = null;

    public function __construct ($key, $name, $size) {
        $this->key = $key;
        $this->id = md5($name . $size);
        if (!is_dir(UPLOAD_PATH . 'temp')) {
            mkdir(UPLOAD_PATH . 'temp', 0755);
        }
    }

    /**
     * 获取分片
     * @param  [type] $index [description]
     * @param  [type] $count [description]
     * @return [type]        [description]
     */
    public function get ($index, $count) {
        $this->index = $index;
        $this->count = $count;
        return $this;
    }

    /**
     * 文件校验
     * @param  [type] $md5 [description]
     * @return [type]      [description]
     */
    public function check ($md5) {
        return md5_file($_FILES[$this->key]['tmp_name'])  == $md5;
    }

    /**
     * 获取文件名
     * @param  [type] $pre [description]
     * @return [type]      [description]
     */
    private function get_tmpfile_name ($pre, $index = null) {
        return "tmpfile-{$pre}-{$this->id}-{$this->count}." . ($index === null ? $this->index : $index);
    }

    /**
     * 获取上传目录
     *
     * @param unknown_type $date
     * @return unknown
     */
    public function get_dir () {
        static $curdir = null;
        if ($curdir === null) {
            $curdir = date('Y-m-d', $date ? $date : REQUEST_TIME) . '/';
        }
        return $curdir;
    }

    /**
     * 是否完成
     * @return boolean [description]
     */
    public function is_finished () {
        return $this->index == $this->count && $this->count > 0;
    }

    /**
     * 获取文件存储路径
     * @param  [type] $type [description]
     * @return [type]       [description]
     */
    public function get_file_name ($channel_id, $type, $ext = null) {
        $key = common_helper::is_allowed($type);
        if ($key) {
            if ($key == 'eps' && $ext == 'ai') {
                $key = 'ai';
            }
        }
        else {
            if (common_helper::is_allowed_ext($ext)) {
                $key = $ext;
            }
        }
        return $this->get_dir() . "pre_" . strtolower(misc::randstr(12)) . "." . $key;
    }

    /**
     * 合并文件
     * @param  [type] $outfile [description]
     * @return [type]          [description]
     */
    public function merge ($pre, $outfile) {
        if (!is_dir(dirname(UPLOAD_PATH . $outfile))) {
            misc::mkdir(dirname(UPLOAD_PATH . $outfile));
        }
        $dfp = fopen(UPLOAD_PATH . $outfile, 'wb+');
        for ($i = 1; $i <= $this->count; $i ++) {
            $file = UPLOAD_PATH . 'temp' . DS . $this->get_tmpfile_name($pre, $i);
            if (file_exists($file)) {
                $sfp = fopen($file, 'rb');
                while (!feof($sfp)) {
                    fwrite($dfp, fread($sfp, 8192));
                }
                fclose($sfp);
                unlink($file);
            }
        }
        fclose($dfp);
        return file_exists(UPLOAD_PATH . $outfile);
    }

    /**
     * 写入临时文件
     * @param  [type] $pre [description]
     * @return [type]      [description]
     */
    public function save ($pre) {
        $filename = $this->get_tmpfile_name($pre);
        if (move_uploaded_file($_FILES[$this->key]['tmp_name'], UPLOAD_PATH . 'temp' . DS . $filename)) {
            return $filename;
        }
        return false;
    }
}