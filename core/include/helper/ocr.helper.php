<?php
namespace re\rgx;
/**
 * 识别助手类
 * $Id: ocr.helper.php 114 2017-07-26 09:48:04Z fangwei $
 */
class ocr_helper extends rgx {
    /**
     * [发票识别#增值税普通发票]
     * @method receipt
     * @param  [type]  $recepit_file [description]
     * @return [type]  [description]
     */
    public static function receipt($recepit_file) {
        $fp  = fopen($recepit_file,"rb");
        $buf = fread($fp,filesize($recepit_file));
        $ocr = new bdocr_helper();
        $ret = $ocr->receipt($buf);
        $data= [];
        if ( !empty($ret['words_result']) ) {
            # 连接串
            $data_string = '';
            foreach ( $ret['words_result'] as $word ) {
                $data_string .= '#' . $word['words'];
            }

            # 发票号码
            preg_match('/(\d{10})/ius' , $data_string, $matches);
            if ( $matches[1] ) {
                $data['invoice_number']    =    $matches[1];
            }

            # 发票号码
            preg_match('/#(\d{8})#/ius' , $data_string, $matches);
            if ( $matches[1] ) {
                $data['invoice_sn']    =    $matches[1];
            }

            # 开票日期
            preg_match('/(\d{4}年\d{2}月\d{2})日/ius' , $data_string, $matches);
            if ( $matches[1] ) {
                $matches[1]    =    str_replace(['年' ,'月'] , ['-' ,'-'] , $matches[1]);
                $data['invoice_billing_time']    =    $matches[1];
            }

            # 发票购买方名称
            preg_match('/称:?(.*?)#/ius' , $data_string, $matches);
            if ( $matches[1] ) {
                $data['invoice_buyer_name']    =    $matches[1];
            }

            # 发票购买方购买方纳税人识别号
            preg_match('/纳税人识别号:?(.*?)#/ius' , $data_string, $matches);
            if ( $matches[1] ) {
                $data['invoice_buyer_tax_no']    =    $matches[1];
            }

            # 发票购买方地址、电话:
            preg_match('/地址、电话:?(.*?)(\d{3,4}[—|-]?\d{6,8})#/ius' , $data_string, $matches);
            if ( $matches[1] ) {
                $data['invoice_buyer_address']    =    $matches[1];
            }
            if ( $matches[2] ) {
                $data['invoice_buyer_phone']    =    $matches[2];
            }

            # 发票购买方开户行及账号:
            preg_match('/开户行及账号:?(.*?)(\d{12,})+/ius' , $data_string, $matches);
            if ( $matches[1] ) {
                $data['invoice_buyer_bank']    =    $matches[1];
            }
            if ( $matches[2] ) {
                $data['invoice_buyer_bank_account']    =    $matches[2];
            }

            # 发票金额(小写)
            preg_match('/\(小写\)\s?￥+\s?(-?\d+[\.|,]\d{2})#/ius' , $data_string, $matches);
            if ( $matches[1] ) {
                $data['invoice_amount']    =    str_replace(',','.',$matches[1]);
            }

            # 发票销售方名称
            preg_match('/.+称:?(.*?)#/ius' , $data_string, $matches);
            if ( $matches[1] ) {
                $data['invoice_seller_name']    =    $matches[1];
            }

            # 发票销售方纳税人识别号
            preg_match('/.+纳税人识别号:?(.*?)#/ius' , $data_string, $matches);
            if ( $matches[1] ) {
                $data['invoice_seller_tax_no']    =    $matches[1];
            }

            # 发票销售方地址、电话:
            preg_match('/.+地址、电话:?(.*?)(\d{3,4}[—|-]?\d{6,8})#/ius' , $data_string, $matches);
            if ( $matches[1] ) {
                $data['invoice_seller_address']    =    $matches[1];
            }
            if ( $matches[2] ) {
                $data['invoice_seller_phone']    =    $matches[2];
            }

            # 发票销售方开户行及账号:
            preg_match('/.+开户行及账号:?(.*?)(\d+)#/ius' , $data_string, $matches);
            if ( $matches[1] ) {
                $data['invoice_seller_bank']    =    $matches[1];
            }
            if ( $matches[2] ) {
                $data['invoice_seller_bank_account']    =    $matches[2];
            }

            # 收款人
            preg_match('/收款人:?(.*?)#/ius' , $data_string, $matches);
            if ( $matches[1] ) {
                $data['invoice_payee']    =    $matches[1];
            }

            # 复核人
            preg_match('/复核,?:?(.*?)#/ius' , $data_string, $matches);
            if ( $matches[1] ) {
                $data['invoice_reviewer']    =    $matches[1];
            }

            # 开票人
            preg_match('/开票人:?(.*?)#/ius' , $data_string, $matches);
            if ( $matches[1] ) {
                $data['invoice_drawer']    =    $matches[1];
            }
        }
        return $data;
    }
}// Class End