<?php
/*
  +-------------------------------------------------------
  + codes 表模型
  + ------------------------------------------------------
  + @update 2019-11-17 00:10:56
  + @desc 若修改了表结构, 请使用下面的命令更新模型文件
  + @cmd /bin/php core/rgx/build.php -t -d=/data/htdocs/emera_tech/giftcard/admin -f=1
  +-------------------------------------------------------
*/
namespace re\rgx;

class codes_table extends table {

    /*
      +--------------------------
      + 编码
      +--------------------------
    */
    protected $_charset = 'utf8mb4';

    /*
      +--------------------------
      + 字段
      +--------------------------
    */
    protected $_fields = [
        'code_id' => [
            'name'               => 'code_id',
            'type'               => 'int',
            'field_type'         => 'int',
            'min'                => 0,
            'max'                => 4294967295,
            'label'              => 'code_id',
            'allow_empty_string' => true,
            'allow_null'         => true
        ],
        'code' => [
            'name'               => 'code',
            'type'               => 'char',
            'field_type'         => 'varchar',
            'min'                => 0,
            'max'                => 30,
            'label'              => 'code',
            'allow_empty_string' => true,
            'allow_null'         => true
        ],
        'is_used' => [
            'name'               => 'is_used',
            'type'               => 'int',
            'field_type'         => 'tinyint',
            'min'                => 0,
            'max'                => 255,
            'label'              => 'is_used',
            'allow_empty_string' => true,
            'allow_null'         => true
        ],
        'code_level' => [
            'name'               => 'code_level',
            'type'               => 'int',
            'field_type'         => 'smallint',
            'min'                => 0,
            'max'                => 65535,
            'label'              => '卡类型',
            'allow_empty_string' => true,
            'allow_null'         => true
        ],
        'create_time' => [
            'name'               => 'create_time',
            'type'               => 'date',
            'field_type'         => 'date',
            'min'                => 0,
            'max'                => 0,
            'label'              => 'create_time',
            'validate'           => ['re\rgx\filter', 'is_mysql_date'],
            'allow_empty_string' => true,
            'allow_null'         => true
        ],
    ];

    /*
      +--------------------------
      + 主键
      +--------------------------
    */
    protected $_primary_key = [
        'key' => 'code_id',
        'inc' => true
    ];

    /*
      +--------------------------
      + 字段默认值
      +--------------------------
    */
    public $defaults = [
        'code_id'     => 0,
        'code'        => '',
        'is_used'     => 0,
        'code_level'  => 1,
        'create_time' => '',
    ];

    /*
      +--------------------------
      + 字段过滤规则
      +--------------------------
    */
    public $filter = [
        'code_id'     => ['re\rgx\filter', 'int'],
        'code'        => ['re\rgx\filter', 'char'],
        'is_used'     => ['re\rgx\filter', 'int'],
        'code_level'  => ['re\rgx\filter', 'int'],
    ];

    /*
      +--------------------------
      + 唯一性检测
      +--------------------------
    */
    public $unique_check = [
        ['code']
    ];

    /*
      +--------------------------
      + 自定义字段验证规则
      + @example 
           [
               // 字段名称
               'name'  => 'user_name',
               // 验证类型, 0 使用filter::$rule的规则进行验证
               //         1 使用正则表达式验证
               //         2 使用自定义方法验证
               'type'  => 0,
               // 若type为 0 则 rule 表示规则名称
               //         1 则 rule 为正则表达式 (/^\w+$/)
               //         2 则 rule 为自定义方法或函数 (['re\rgx\filter', 'char']] 或 'is_numeric')
               'rule'  => 'require',
               // 验证失败返回的文案
               // 若要使用语言变量, 则用#开头. (例如: #user name)
               'error' => '您输入的用户名格式有误'
           ]
      +--------------------------
    */
    public $validate = [];

}