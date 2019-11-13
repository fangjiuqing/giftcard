<?php
namespace re\rgx;

/**
 * CURL封装类
 * @copyright reginx.com
 * $Id: curl.helper.php 765 2017-11-28 03:38:31Z reginx $
 */
class curl_helper {

    /**
     * UA
     *
     * @var unknown_type
     */
    public static $ua  = 'Mozilla/5.0 (Windows NT 6.1; rv:21.0) Gecko/20100101 Firefox/21.0';

    /**
     * 引用地址
     *
     * @var unknown_type
     */
    public static $ref = 'http://www.baidu.com/';


    /**
     * 发送Http请求
     * @param  [type] $url    [description]
     * @param  array  $params [description]
     * @return [type]         [description]
     */
    public static function request ($url, $param = []) {
        $ret = [];
        $s = curl_init();
        curl_setopt($s, CURLOPT_URL, $url);
        curl_setopt($s, CURLOPT_TIMEOUT, isset($param['timeout']) ? $param['timeout'] :15);
        curl_setopt($s, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($s, CURLOPT_USERAGENT, self::$ua);
        // gzip
        if (isset($param['gzip'])) {
            curl_setopt($s, CURLOPT_ENCODING, 'gzip');
        }
        // post
        if (isset($param['post'])) {
            curl_setopt($s, CURLOPT_POST, 1);
            curl_setopt($s, CURLOPT_POSTFIELDS, $param['post']);
        }
        // post
        if (isset($param['gpost'])) {
            curl_setopt($s, CURLOPT_POSTFIELDS, $param['gpost']);
        }
        // 是否使用自定义 ref 页地址
        if (isset($param['gref'])) {
            curl_setopt($s, CURLOPT_REFERER, $param['gref']);
        }
        else {
            curl_setopt($s, CURLOPT_REFERER, self::$ref);
        }
        // 是否获取返回 header 信息
        if (isset($param['gheader'])) {
            curl_setopt($s, CURLOPT_HEADER, 1);
        }
        // 是否使用 SSL 验证
        if (isset($param['gssl_verifyhost'])) {
            curl_setopt($s, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($s, CURLOPT_SSL_VERIFYHOST, $param['gssl_verifyhost']);
        }
        // SSL 证书文件
        if (isset($param['gcainfo'])) {
            curl_setopt($s, CURLOPT_CAINFO, $param['gcainfo']);
        }
        // 是否启用自定义 header
        if (isset($param['header']) && is_array($param['header'])) {
            curl_setopt($s, CURLOPT_HTTPHEADER, $param['header']);
        }
        // 是否使用cookie
        if (isset($param['gcookie'])) {
            curl_setopt($s, CURLOPT_COOKIEJAR, $param['gcookie']);
            curl_setopt($s, CURLOPT_COOKIEFILE, $param['gcookie']);
        }
        
        curl_setopt($s, CURLOPT_FOLLOWLOCATION, 1);
        $ret['html']   = curl_exec($s);
        $ret['header'] = curl_getinfo($s);
        $ret['code']   = $ret['header']['http_code'];
        curl_close($s);

        return $ret;
    }

    /**
     * 获取 原生HTTP响应
     * @param  [type] $url   [description]
     * @param  array  $param [description]
     * @return [type]        [description]
     */
    public static function get_raw ($url, $param = []) {
        return self::request($url, $param);
    }

    /**
     * 获取远程 HTTP 响应
     *
     * @param unknown_type $url
     * @param unknown_type $param
     * @return unknown
     */
    public static function gethtml ($url, $param = array()){
        $ret = self::request($url, $param);

        // http header 获取编码设置
        if(!empty($ret['header']['content_type'])){
            $charset = array();
            preg_match('/charset=([\w\-]+)/i' , $ret['header']['content_type'] , $charset);
            $ret['charset'] = empty($charset[1]) ? false : $charset[1];
        }
        // html代码获取编码设置
        if(!$ret['charset'] && !empty($ret['html'])){
            preg_match('/<meta.+?charset=[^\w]?([-\w]+)/is' , $ret['html'] , $m);
            $ret['charset'] = $m[1];
        }
        // 转码
        if(!empty($ret['charset']) && $ret['charset'] != 'utf-8'){
            $ret['charset'] = $ret['charset'] == 'gb2312' ? 'gbk' : $ret['charset'];
            $ret['html'] = mb_convert_encoding($ret['html'] , 'utf-8'  , $ret['charset']);
            $ret['charset'] = 'utf-8';
        }

        return $ret;
    }
}