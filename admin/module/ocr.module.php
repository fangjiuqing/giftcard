<?php
namespace com\default_www;
use re\rgx as RGX;

/**
 * 文字识别
 */
class ocr_module extends RGX\module {


    public function exec_action () {
        $list = RGX\CACHE('task');
        $dir  = DATA_PATH . 'files/';
        $tdir = UPLOAD_PATH . 'files/';
        $ctab = RGX\OBJ('certificate_table');
        foreach ($list as $ek => $emp) {
            foreach ($emp['certs'] as $k => $v) {
                switch ($k) {
                    case '身份证':
                        //$emp['cert_list'][] = RGX\analysis_helper::get_cert_1($v, $dir, $list[$ek]);
                        break;
                    case '劳动合同':
                        //$emp['cert_list'][] = RGX\analysis_helper::get_cert_30($v, $dir, $list[$ek]);
                        break;
                    case '毕业证':
                        $emp['cert_list'][] = RGX\analysis_helper::get_cert_26($v, $dir, $list[$ek]);
                        break;
                }
            }
            RGX\analysis_helper::save_emp($emp);
            $udir = $tdir . substr($emp['emp_id'], -1, 1) . '/';
            if (!is_dir($udir)) {
                RGX\misc::mkdir($udir);
            }
            foreach ((array)$emp['cert_list'] as $v) {
                $v['cert_emp_id'] = $emp['emp_id'];
                foreach ($v['cert_images'] as $ik => $img) {
                    $dfile = "pre_{$v['cert_emp_id']}-{$v['cert_type']}-{$v['cert_cat_id']}-{$ik}.jpg";
                    copy($dir . $img, $udir . $dfile);
                    $v['cert_images'][$ik] = 'files/' . $dfile;
                    if ($ik === 0) {
                        $v['cert_cover'] = 'files/' . $dfile;
                    }
                }
                $v['cert_images'] = join('#', $v['cert_images']);
                // if ($ctab->load($v)) {
                //     $ctab->replace();
                // }
            }
            if ($ek > 50) {
                exit();
            }
        }
    }

    public function index_action () {

        $ocr = RGX\OBJ('bdocr_helper');
        // images dir
        $dir = DATA_PATH . 'files';
        $list = RGX\CACHE('task');
        if (empty($list)) {
            foreach (glob($dir . '/*') as $file) {
                if (!is_dir($file)) {
                    continue;
                }
                if (!preg_match('/^[0-9a-z]+\-(.+)$/ui', basename($file))) {
                    echo('#无法获取工号: ' . basename($file) . PHP_EOL);
                    continue;
                }
                $emp = RGX\analysis_helper::get_emp($file);
                foreach (glob($file . '/*.jpg') as $img) {
                    $key = null;
                    if (preg_match('/(身份|省份)证/u', $img)) {
                        $key = '身份证';
                    }
                    else if (preg_match('/劳动合同/u', $img)) {
                        $key = '劳动合同';
                    }
                    else if (preg_match('/(电子相册|证件照|电子照片|电子照|\-照片|寸照片|红底照片|照片白|照片红|照片蓝|大1寸)/u', $img)) {
                        $emp['avatar'] = $img;
                        continue;
                    }
                    else if (preg_match('/(安全员|安防)/u', $img)) {
                        $key = '安全员';
                    }
                    else if (preg_match('/(学历|毕业|学士|学位)/u', $img)) {
                        $key = '毕业证';
                    }
                    else if (preg_match('/(电子信息工程|高工|职称|资格证书|专业资格|锐捷|中兴|华为|信息工程师|电信协优)/u', $img)) {
                        $key = '职称';
                    }
                    else if (preg_match('/PMP/iu', $img)) {
                        $key = 'PMP证';
                    }
                    else if (preg_match('/概预算/iu', $img)) {
                        $key = '概预算证';
                    }
                    else if (preg_match('/(质检|质量|检测)员/iu', $img)) {
                        $key = '质量员';
                    }
                    else if (preg_match('/建造师/iu', $img)) {
                        $key = '建造师';
                    }
                    else if (preg_match('/施工员/iu', $img)) {
                        $key = '施工员';
                    }
                    else if (preg_match('/电工/iu', $img)) {
                        $key = '电工证';
                    }
                    else if (preg_match('/(资料|信息)员/iu', $img)) {
                        $key = '资料员';
                    }
                    else if (preg_match('/劳务员/iu', $img)) {
                        $key = '劳务员';
                    }
                    else if (preg_match('/机械员/iu', $img)) {
                        $key = '机械员';
                    }
                    else if (preg_match('/机务员/iu', $img)) {
                        $key = '机务员证';
                    }
                    else if (preg_match('/线务员/iu', $img)) {
                        $key = '线务员证';
                    }
                    else if (preg_match('/(材料员|物料)/iu', $img)) {
                        $key = '材料员';
                    }
                    else if (preg_match('/登高/iu', $img)) {
                        $key = '登高证';
                    }

                    if (empty($key)) {
                        echo("##无法识别证书类型: " . basename($file) . "/" . basename($img) . PHP_EOL);
                        ob_flush();
                        continue;
                    }

                    $emp['certs'][$key][] = [
                        'file'  => basename($file) . "/" . basename($img),
                        'ps'    => preg_match('/ps/i', $img)
                    ];
                }
                $list[] = $emp;
            }
            RGX\CACHE('task', $list, 86400);
        }
        echo("Success" . PHP_EOL);
        

    }
}