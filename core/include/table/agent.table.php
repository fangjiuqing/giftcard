<?php
/*
  +-------------------------------------------------------
  + agent 表模型
  + ------------------------------------------------------
  + @update 2019-12-01 18:42:06
  + @desc 若修改了表结构, 请使用下面的命令更新模型文件
  + @cmd /bin/php core/rgx/build.php -t -d=/data/htdocs/emera_tech/giftcard/admin -f=1
  +-------------------------------------------------------
*/
namespace re\rgx;

class agent_table extends table {

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
        'agent_id' => [
            'name'               => 'agent_id',
            'type'               => 'int',
            'field_type'         => 'int',
            'min'                => 0,
            'max'                => 4294967295,
            'label'              => 'agent_id',
            'allow_empty_string' => true,
            'allow_null'         => true
        ],
        'agent_fullname' => [
            'name'               => 'agent_fullname',
            'type'               => 'char',
            'field_type'         => 'varchar',
            'min'                => 0,
            'max'                => 100,
            'label'              => 'agent_fullname',
            'allow_empty_string' => true,
            'allow_null'         => true
        ],
        'agent_mobile' => [
            'name'               => 'agent_mobile',
            'type'               => 'char',
            'field_type'         => 'varchar',
            'min'                => 0,
            'max'                => 20,
            'label'              => 'agent_mobile',
            'allow_empty_string' => true,
            'allow_null'         => true
        ],
        'agent_code' => [
            'name'               => 'agent_code',
            'type'               => 'char',
            'field_type'         => 'varchar',
            'min'                => 0,
            'max'                => 20,
            'label'              => 'agent_code',
            'allow_empty_string' => true,
            'allow_null'         => true
        ],
        'agent_create_time' => [
            'name'               => 'agent_create_time',
            'type'               => 'date',
            'field_type'         => 'date',
            'min'                => 0,
            'max'                => 0,
            'label'              => 'agent_create_time',
            'validate'           => ['re\rgx\filter', 'is_mysql_date'],
            'allow_empty_string' => true,
            'allow_null'         => true
        ],
        'agent_level' => [
            'name'               => 'agent_level',
            'type'               => 'int',
            'field_type'         => 'smallint',
            'min'                => -32768,
            'max'                => 32767,
            'label'              => 'agent_level',
            'allow_empty_string' => true,
            'allow_null'         => true
        ],
        'remark' => [
            'name'               => 'remark',
            'type'               => 'char',
            'field_type'         => 'text',
            'min'                => 0,
            'max'                => 65535,
            'label'              => 'remark',
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
        'key' => 'agent_id',
        'inc' => true
    ];

    /*
      +--------------------------
      + 字段默认值
      +--------------------------
    */
    public $defaults = [
        'agent_id'            => 0,
        'agent_fullname'      => '',
        'agent_mobile'        => '',
        'agent_code'          => '',
        'agent_create_time'   => '',
        'agent_level'         => 0,
        'remark'              => '',
    ];

    /*
      +--------------------------
      + 字段过滤规则
      +--------------------------
    */
    public $filter = [
        'agent_id'            => ['re\rgx\filter', 'int'],
        'agent_fullname'      => ['re\rgx\filter', 'char'],
        'agent_mobile'        => ['re\rgx\filter', 'char'],
        'agent_code'          => ['re\rgx\filter', 'char'],
        'agent_level'         => ['re\rgx\filter', 'int'],
        'remark'              => ['re\rgx\filter', 'char'],
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