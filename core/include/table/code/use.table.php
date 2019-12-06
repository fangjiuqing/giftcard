<?php
/*
  +-------------------------------------------------------
  + code_use 表模型
  + ------------------------------------------------------
  + @update 2019-12-06 19:46:50
  + @desc 若修改了表结构, 请使用下面的命令更新模型文件
  + @cmd /bin/php core/rgx/build.php -t -d=/data/htdocs/emera_tech/giftcard/admin -f=1
  +-------------------------------------------------------
*/
namespace re\rgx;

class code_use_table extends table {

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
        'id' => [
            'name'               => 'id',
            'type'               => 'int',
            'field_type'         => 'int',
            'min'                => 0,
            'max'                => 4294967295,
            'label'              => 'id',
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
        'use_nums' => [
            'name'               => 'use_nums',
            'type'               => 'int',
            'field_type'         => 'int',
            'min'                => 0,
            'max'                => 4294967295,
            'label'              => '消耗数量',
            'allow_empty_string' => true,
            'allow_null'         => true
        ],
        'client_name' => [
            'name'               => 'client_name',
            'type'               => 'char',
            'field_type'         => 'varchar',
            'min'                => 0,
            'max'                => 100,
            'label'              => 'client_name',
            'allow_empty_string' => true,
            'allow_null'         => true
        ],
        'client_mobile' => [
            'name'               => 'client_mobile',
            'type'               => 'char',
            'field_type'         => 'varchar',
            'min'                => 0,
            'max'                => 20,
            'label'              => 'client_mobile',
            'allow_empty_string' => true,
            'allow_null'         => true
        ],
        'client_info' => [
            'name'               => 'client_info',
            'type'               => 'char',
            'field_type'         => 'varchar',
            'min'                => 0,
            'max'                => 500,
            'label'              => 'client_info',
            'allow_empty_string' => true,
            'allow_null'         => true
        ],
        'remark' => [
            'name'               => 'remark',
            'type'               => 'char',
            'field_type'         => 'varchar',
            'min'                => 0,
            'max'                => 500,
            'label'              => 'remark',
            'allow_empty_string' => true,
            'allow_null'         => true
        ],
        'create_date' => [
            'name'               => 'create_date',
            'type'               => 'date',
            'field_type'         => 'date',
            'min'                => 0,
            'max'                => 0,
            'label'              => 'create_date',
            'validate'           => ['re\rgx\filter', 'is_mysql_date'],
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
        'key' => 'id',
        'inc' => true
    ];

    /*
      +--------------------------
      + 字段默认值
      +--------------------------
    */
    public $defaults = [
        'id'              => 0,
        'code'            => '',
        'pro_id'          => 0,
        'use_nums'        => 1,
        'client_name'     => '',
        'client_mobile'   => '',
        'client_info'     => '',
        'remark'          => '',
        'create_date'     => '',
        'op_admin'        => '',
    ];

    /*
      +--------------------------
      + 字段过滤规则
      +--------------------------
    */
    public $filter = [
        'id'              => ['re\rgx\filter', 'int'],
        'code'            => ['re\rgx\filter', 'char'],
        'pro_id'          => ['re\rgx\filter', 'int'],
        'use_nums'        => ['re\rgx\filter', 'int'],
        'client_name'     => ['re\rgx\filter', 'char'],
        'client_mobile'   => ['re\rgx\filter', 'char'],
        'client_info'     => ['re\rgx\filter', 'char'],
        'remark'          => ['re\rgx\filter', 'char'],
        'op_admin'        => ['re\rgx\filter', 'char'],
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