<?php
namespace re\rgx;

/**
 * 核心库
 * @copyright reginx.com
 * $Id: core.class.php 5 2017-07-19 03:44:30Z reginx $
 */
class core {
    
    /**
     * 写入 cookie
     *
     * @param unknown_type $key
     * @param unknown_type $val
     * @param unknown_type $ttl
     * @param unknown_type $path
     * @param unknown_type $domain
     */
    public static function set_cookie ($key, $val, $ttl = 86400, $path = '/', $domain = null) {
        setcookie($key, $val, REQUEST_TIME + $ttl , $path, $domain ? $domain : sess::get_domain());
    }



    /**
     * 加载语言包文件
     *
     * @param unknown_type $key
     */
    public static function loadlang ($key = '@default:zh-cn') {
        static $loaded = array();
        if (!isset($loaded[$key])) {
            $file = self::_getlangfile($key);
            if (is_file($file)) {
                $loaded[$key] = true;
                $GLOBALS['_RL'] = array_merge(
                    empty($GLOBALS['_RL']) ? array() : $GLOBALS['_RL'], include($file));
            }
            else {
                throw_error(LANG('file not found', self::relpath($file)), 'FNF');
            }
        }
    }

    /**
     * 获取语言文件
     *
     * @param unknown_type $key
     * @return unknown
     */
    private static function _getlangfile ($key) {
        // app name
        if(($pos = strpos($key, '@')) !== false){
            $app = substr($key, 0, $pos);
            $key = substr($key, $pos + 1);
        }
        // 默认app
        if($app == 'default'){
            $app = (BASE_PATH . 'lang/');
        }else{
            $app  = empty($app) ? (REX_PATH . 'extra/lang/') : (BASE_PATH . $app . '/lang/');
        }
        // mod name
        if(($pos = strpos($key , ':')) !== false){
            $mod   = substr($key, 0, $pos);
            $key   = substr($key, $pos + 1);
        }
        return $app . (empty($mod) ? 'default' : $mod) . '.' . $key . '.php';
    }

    /**
     * 判断 模块文件是否存在
     *
     * @param unknown_type $module
     * @return unknown
     */
    public static function module_file_exists ($module) {
        return file_exists(APP_PATH . 'module' . DS . $module . '.module.php');
    }



    /**
     * 加载扩展文件
     *
     * @param unknown_type $file
     */
    public static function loadfile ($file) {
        $key  = explode('/', $file);
        $path = sprintf('%sextra%s%s%s%s.%s.php', REX_PATH, DS, $key[0], DS, $key[1], $key[0]);
        if (!is_file($path)) {
            new error($path);
        }
        return include($path);
    }
    
    /**
     * 获取 app 配置信息
     *
     * @param unknown_type $app
     * @return unknown
     */
    public static function loadconfig ($app) {
        $file = ($app == 'default' ? BASE_PATH : (BASE_PATH . $app . DS)). 'config' . DS . 'config.php';
        if (is_file($file)) {
            return include($file);
        }
        return null;
    }
    
    
    /**
     * 获取系统运行产生的缓存目录
     *
     * @return unknown
     */
    public static function get_cache_list () {
        $ret = array();
        foreach (glob(CACHE_PATH . '/*') as $k => $v) {
            if (is_dir($v)) {
                $ret['cache'][] = basename($v);
            }
        }
        foreach (glob(TEMP_PATH . '/*') as $k => $v) {
            if (is_dir($v)) {
                $ret['temp'][] = basename($v);
            }
        }
        return $ret;
    }
    
    /**
     * 时长格式化
     *
     * @param unknown_type $ts
     * @param unknown_type $sdate
     * @return unknown
     */
    public static function duration ($ts, $sdate = null) {
        $ret   = '';
        $sdate = empty($sdate) ? REQUEST_TIME : $sdate;
        $years = (int)((($sdate - $ts) / (7 * 86400)) / 52.177457);
        $rem   = (int)(($sdate - $ts) - ($years * 52.177457 * 7 * 86400));
        $weeks = (int)(($rem) / (7 * 86400));
        $days  = (int)(($rem) / 86400) - $weeks * 7;
        $hours = (int)(($rem) / 3600) - $days * 24 - $weeks * 7 * 24;
        $mins  = (int)(($rem) / 60) - $hours * 60 - $days * 24 * 60 - $weeks * 7 * 24 * 60;
        if ($years == 1) {
            $ret .= "$years year, ";
        }
        if ($years > 1) {
            $ret .= "$years years, ";
        }
        if ($weeks == 1) {
            $ret .= "$weeks week, ";
        }
        if ($weeks > 1) {
            $ret .= "$weeks weeks, ";
        }
        if ($days == 1) {
            $ret .= "$days day,";
        }
        if ($days > 1) {
            $ret .= "$days days,";
        }
        if ($hours == 1) {
            $ret .= " $hours hour and";
        }
        if ($hours > 1) {
            $ret .= " $hours hours and";
        }
        if ($mins == 1) {
            $ret .= " 1 minute";
        }
        else {
            $ret .= " $mins minutes";
        }
        return $ret;
    }
    
    
    /**
     * 字串解密
     *
     * @param unknown_type $str
     * @param unknown_type $date
     * @return unknown
     */
    public static function rex_decode ($str, $date = null) {
        $ret  = false;
        $str  = base64_decode($str);
        if ($str) {
            $info = unpack('nlen/Ndate', substr($str, 0, 6));
            if ($date === null || $info['date'] >= $date) {
                $ret  = unpack('S' . $info['len'], substr($str, 6));
                foreach($ret as $k => $v) {
                    $ret[$k] = chr($v);
                }
                $ret = join('', $ret);
            }
        }
        return $ret;
    }
    
    /**
     * 字串加密
     *
     * @param unknown_type $str
     * @return unknown
     */
    public static function rex_encode ($str, $date = null) {
        $len = strlen($str);
        $ret = pack("nN", $len, empty($date) ? strtotime(date('Y-m-d')) : $date);
        for ($i = 0; $i < $len; $i ++) {
            $ret .= pack("S", ord($str{$i}));
        }
        return base64_encode($ret);
    }
} // end class
