<?php
/*
  +-------------------------------------------------------
  + store_log 表模型
  + ------------------------------------------------------
  + @update 2019-12-01 18:42:07
  + @desc 若修改了表结构, 请使用下面的命令更新模型文件
  + @cmd /bin/php core/rgx/build.php -t -d=/data/htdocs/emera_tech/giftcard/admin -f=1
  +-------------------------------------------------------
*/
namespace re\rgx;

class store_log_table extends table {

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
        'log_id' => [
            'name'               => 'log_id',
            'type'               => 'int',
            'field_type'         => 'int',
            'min'                => 0,
            'max'                => 4294967295,
            'label'              => 'log_id',
            'allow_empty_string' => true,
            'allow_null'         => true
        ],
        'pro_id' => [
            'name'               => 'pro_id',
            'type'               => 'int',
            'field_type'         => 'int',
            'min'                => -2147483648,
            'max'                => 2147483647,
            'label'              => 'pro_id',
            'allow_empty_string' => true,
            'allow_null'         => true
        ],
        'ori_store' => [
            'name'               => 'ori_store',
            'type'               => 'int',
            'field_type'         => 'int',
            'min'                => 0,
            'max'                => 4294967295,
            'label'              => '原来库存',
            'allow_empty_string' => true,
            'allow_null'         => true
        ],
        'opd_store' => [
            'name'               => 'opd_store',
            'type'               => 'int',
            'field_type'         => 'int',
            'min'                => 0,
            'max'                => 4294967295,
            'label'              => '操作后库存',
            'allow_empty_string' => true,
            'allow_null'         => true
        ],
        'op_type' => [
            'name'               => 'op_type',
            'type'               => 'char',
            'field_type'         => 'varchar',
            'min'                => 0,
            'max'                => 20,
            'label'              => 'op_type',
            'allow_empty_string' => true,
            'allow_null'         => true
        ],
        'op_time' => [
            'name'               => 'op_time',
            'type'               => 'date',
            'field_type'         => 'date',
            'min'                => 0,
            'max'                => 0,
            'label'              => '操作时间',
            'validate'           => ['re\rgx\filter', 'is_mysql_date'],
            'allow_empty_string' => true,
            'allow_null'         => true
        ],
        'op_remark' => [
            'name'               => 'op_remark',
            'type'               => 'char',
            'field_type'         => 'varchar',
            'min'                => 0,
            'max'                => 200,
            'label'              => '操作说明',
            'allow_empty_string' => true,
            'allow_null'         => true
        ],
        'op_admin' => [
            'name'               => 'op_admin',
            'type'               => 'char',
            'field_type'         => 'varchar',
            'min'                => 0,
            'max'                => 30,
            'label'              => 'op_admin',
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
        'key' => 'log_id',
        'inc' => true
    ];

    /*
      +--------------------------
      + 字段默认值
      +--------------------------
    */
    public $defaults = [
        'log_id'      => 0,
        'pro_id'      => 0,
        'ori_store'   => 0,
        'opd_store'   => 0,
        'op_type'     => '',
        'op_time'     => '',
        'op_remark'   => '',
        'op_admin'    => '',
    ];

    /*
      +--------------------------
      + 字段过滤规则
      +--------------------------
    */
    public $filter = [
        'log_id'      => ['re\rgx\filter', 'int'],
        'pro_id'      => ['re\rgx\filter', 'int'],
        'ori_store'   => ['re\rgx\filter', 'int'],
        'opd_store'   => ['re\rgx\filter', 'int'],
        'op_type'     => ['re\rgx\filter', 'char'],
        'op_remark'   => ['re\rgx\filter', 'char'],
        'op_admin'    => ['re\rgx\filter', 'char'],
    ];

    /*
      +--------------------------
      + 唯一性检测
      +--------------------------
    */
    public $unique_check = [
        
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