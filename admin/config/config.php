<?php
return [
    'db'    => [
        'pre'       => 'pre_',
        'type'      => 'mysql',
        'mysql'     => [
             'default'   => 'host=111.231.106.198;port=3306;db=codes;user=root;passwd=fang123wei;charset=utf8;profiling=1',
        ],
    ],
   'CACHE_VER'  => 2,
   'SYS_NAME'  => '礼品码生成-单机版',
   'tpl'        => [
      'style'     => 'default',
      '404_tpl'   => '404.tpl',
      'msg_tpl'   => 'msg.tpl',
      'ob'        => true,
      'native'    => false,
      'tpl_pre'   => '{',
      'tpl_suf'   => '}',
      'cmod'      => false,
      'charset'   => 'utf-8',
      'allow_php' => false
  ],
  //'app_url'     => 'http://localhost/giftcard/admin/',
  'upload_url'  => 'https://case.isoftware.xyz/carrent/data/attachment/',
];
