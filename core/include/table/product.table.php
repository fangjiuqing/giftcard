<?php
/*
  +-------------------------------------------------------
  + product 表模型
  + ------------------------------------------------------
  + @update 2019-11-25 13:35:44
  + @desc 若修改了表结构, 请使用下面的命令更新模型文件
  + @cmd /bin/php core/rgx/build.php -t -d=/data/htdocs/emera_tech/giftcard/admin -f=1
  +-------------------------------------------------------
*/
namespace re\rgx;

class product_table extends table {

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
        'pro_id' => [
            'name'               => 'pro_id',
            'type'               => 'int',
            'field_type'         => 'int',
            'min'                => 0,
            'max'                => 4294967295,
            'label'              => 'pro_id',
            'allow_empty_string' => true,
            'allow_null'         => true
        ],
        'pro_no' => [
            'name'               => 'pro_no',
            'type'               => 'char',
            'field_type'         => 'varchar',
            'min'                => 0,
            'max'                => 20,
            'label'              => 'pro_no',
            'allow_empty_string' => true,
            'allow_null'         => true
        ],
        'pro_name' => [
            'name'               => 'pro_name',
            'type'               => 'char',
            'field_type'         => 'varchar',
            'min'                => 0,
            'max'                => 200,
            'label'              => 'pro_name',
            'allow_empty_string' => true,
            'allow_null'         => true
        ],
        'pro_type' => [
            'name'               => 'pro_type',
            'type'               => 'int',
            'field_type'         => 'smallint',
            'min'                => -32768,
            'max'                => 32767,
            'label'              => 'pro_type',
            'allow_empty_string' => true,
            'allow_null'         => true
        ],
        'pro_attr' => [
            'name'               => 'pro_attr',
            'type'               => 'char',
            'field_type'         => 'varchar',
            'min'                => 0,
            'max'                => 200,
            'label'              => 'pro_attr',
            'allow_empty_string' => true,
            'allow_null'         => true
        ],
        'pro_desc' => [
            'name'               => 'pro_desc',
            'type'               => 'char',
            'field_type'         => 'varchar',
            'min'                => 0,
            'max'                => 255,
            'label'              => 'pro_desc',
            'allow_empty_string' => true,
            'allow_null'         => true
        ],
        'pro_store' => [
            'name'               => 'pro_store',
            'type'               => 'int',
            'field_type'         => 'int',
            'min'                => -2147483648,
            'max'                => 2147483647,
            'label'              => 'pro_store',
            'allow_empty_string' => true,
            'allow_null'         => true
        ],
        'pro_cate' => [
            'name'               => 'pro_cate',
            'type'               => 'int',
            'field_type'         => 'int',
            'min'                => 0,
            'max'                => 4294967295,
            'label'              => 'pro_cate',
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
        'key' => 'pro_id',
        'inc' => true
    ];

    /*
      +--------------------------
      + 字段默认值
      +--------------------------
    */
    public $defaults = [
        'pro_id'      => 0,
        'pro_no'      => '',
        'pro_name'    => '',
        'pro_type'    => 0,
        'pro_attr'    => '',
        'pro_desc'    => '',
        'pro_store'   => 0,
        'pro_cate'   => 0,
    ];

    /*
      +--------------------------
      + 字段过滤规则
      +--------------------------
    */
    public $filter = [
        'pro_id'      => ['re\rgx\filter', 'int'],
        'pro_no'      => ['re\rgx\filter', 'char'],
        'pro_name'    => ['re\rgx\filter', 'char'],
        'pro_type'    => ['re\rgx\filter', 'int'],
        'pro_attr'    => ['re\rgx\filter', 'char'],
        'pro_desc'    => ['re\rgx\filter', 'char'],
        'pro_store'   => ['re\rgx\filter', 'int'],
        'pro_cate'   => ['re\rgx\filter', 'int'],
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