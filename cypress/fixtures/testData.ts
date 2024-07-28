//测试用例的字段信息
export const fields = [
  {
    field_type_key: 'multi_select',
    field_alias: 'tags',
    field_key: 'field_65e1cc',
    options: [
      {
        label: 'ty',
        value: 'ty',
      },
    ],
    field_name: '标签',
    is_custom_field: true,
    value_generate_mode: 'Default',
  },
  {
    field_key: 'owner',
    field_type_key: 'user',
    field_alias: 'owner',
    field_name: '创建人',
    is_custom_field: false,
    value_generate_mode: 'Default',
  },
  {
    field_alias: 'step',
    field_name: '执行步骤',
    is_custom_field: true,
    field_key: 'field_023f96',
    field_type_key: 'multi_text',
    value_generate_mode: 'Default',
  },
  {
    is_custom_field: false,
    value_generate_mode: 'Default',
    field_key: 'owned_project',
    field_alias: 'owned_project',
    field_name: '所属空间',
    field_type_key: 'owned_project',
  },
  {
    field_key: 'current_status_operator',
    field_alias: 'current_status_operator',
    field_name: '当前负责人',
    field_type_key: 'multi_user',
    is_custom_field: false,
    value_generate_mode: 'Default',
  },
  {
    field_alias: 'attachment',
    field_name: '附件',
    is_custom_field: true,
    field_key: 'field_603db5',
    field_type_key: 'multi_file',
    value_generate_mode: 'Default',
  },
  {
    field_alias: 'business',
    field_name: '业务线',
    field_key: 'business',
    field_type_key: 'business',
    is_custom_field: false,
    value_generate_mode: 'Default',
  },
  {
    field_key: 'start_time',
    field_type_key: 'date',
    field_alias: 'start_time',
    field_name: '创建时间',
    is_custom_field: false,
    value_generate_mode: 'Default',
  },
  {
    field_key: 'watchers',
    field_type_key: 'multi_user',
    field_alias: 'watchers',
    field_name: '关注人',
    is_custom_field: false,
    value_generate_mode: 'Default',
  },
  {
    field_type_key: 'multi_select',
    field_name: '当前状态授权角色',
    value_generate_mode: 'Default',
    field_key: 'current_status_operator_role',
    field_alias: 'current_status_operator_role',
    is_custom_field: false,
  },
  {
    field_key: 'description',
    field_name: '描述',
    is_custom_field: false,
    field_type_key: 'multi_text',
    field_alias: 'description',
    value_generate_mode: 'Default',
  },
  {
    value_generate_mode: 'Default',
    options: [
      {
        label: 'P0',
        value: 'option_1',
      },
      {
        label: 'P1',
        value: 'option_2',
      },
      {
        label: 'P2',
        value: 'option_3',
      },
    ],
    field_alias: 'priority',
    field_name: '优先级',
    is_custom_field: false,
    field_key: 'priority',
    field_type_key: 'select',
  },
  {
    field_key: 'field_e42a97',
    field_type_key: 'multi_select',
    is_custom_field: true,
    options: [
      {
        label: '功能用例',
        value: 'testcase_function',
      },
      {
        label: '兼容性用例',
        value: 'testcase_compatibility',
      },
    ],
    field_alias: 'testcase_type',
    field_name: '用例类型',
    value_generate_mode: 'Default',
  },
  {
    field_name: '测试用例类型',
    field_key: 'template',
    options: [
      {
        label: '默认测试用例类型',
        value: '1523819',
      },
    ],
    field_alias: 'template',
    field_type_key: 'work_item_template',
    is_custom_field: false,
    value_generate_mode: 'Default',
  },
  {
    value_generate_mode: 'Default',
    field_key: 'work_item_status',
    options: [
      {
        label: '待评审',
        value: 'not_reviewed',
      },
      {
        label: '评审通过',
        value: 'review_passed',
      },
      {
        label: '评审不通过',
        value: 'review_failed',
      },
      {
        label: '已终止',
        value: 'systemEnded',
      },
    ],
    field_name: '状态',
    is_custom_field: false,
    field_type_key: 'work_item_status',
    field_alias: 'work_item_status',
  },
  {
    field_key: 'field_2c7371',
    field_type_key: 'multi_text',
    field_name: '预期结果',
    field_alias: 'expected_result',
    is_custom_field: true,
    value_generate_mode: 'Default',
  },
  {
    field_key: 'archiving_date',
    field_type_key: 'date',
    field_alias: 'archiving_date',
    field_name: '完成日期',
    value_generate_mode: 'Default',
    is_custom_field: false,
  },
  {
    field_key: 'work_item_id',
    field_type_key: 'number',
    field_alias: 'work_item_id',
    field_name: '工作项id',
    is_custom_field: false,
    value_generate_mode: 'Default',
  },
  {
    field_key: 'archiving_status',
    field_alias: 'archiving_status',
    field_name: '是否完成',
    is_custom_field: false,
    value_generate_mode: 'Default',
    field_type_key: 'bool',
  },
  {
    is_custom_field: true,
    value_generate_mode: 'Default',
    field_key: 'field_f717b4',
    field_type_key: 'multi_text',
    field_alias: 'action',
    field_name: '前置条件',
  },
  {
    field_type_key: 'text',
    field_alias: 'name',
    field_name: '用例名称',
    is_custom_field: false,
    field_key: 'name',
    value_generate_mode: 'Default',
  },
  {
    field_type_key: 'work_item_related_multi_select',
    field_alias: 'related_story',
    field_name: '关联需求',
    is_custom_field: true,
    value_generate_mode: 'Default',
    field_key: 'field_d73be1',
  },
  {
    field_type_key: 'select',
    options: [
      {
        label: 'P0',
        value: 'wx10xqwo8',
      },
      {
        value: 'c0z9ko2mk',
        label: 'P1',
      },
      {
        label: 'P2',
        value: 'ck4xd409s',
      },
    ],
    field_name: '用例分级',
    is_custom_field: true,
    field_key: 'field_ad0ad4',
    field_alias: 'testcase_priority',
    value_generate_mode: 'Default',
  },
  {
    field_type_key: 'select',
    field_alias: 'work_item_type_key',
    field_name: '工作项类型',
    is_custom_field: false,
    field_key: 'work_item_type_key',
    value_generate_mode: 'Default',
    options: [
      {
        label: '需求',
        value: 'story',
      },
      {
        label: '缺陷',
        value: 'issue',
      },
      {
        label: '版本',
        value: 'version',
      },
      {
        label: '迭代',
        value: 'sprint',
      },
      {
        label: '项目',
        value: 'project',
      },
      {
        label: '任务',
        value: 'sub_task',
      },
      {
        label: '项目文档',
        value: '6295c578fc8ff70885763b1a',
      },
      {
        value: '63fc6b3a842ed46a33c769cf',
        label: '测试计划',
      },
      {
        label: '测试用例',
        value: '63fc6356a3568b3fd3800e88',
      },
      {
        label: '执行用例',
        value: '63fc81008b7f897a30b36663',
      },
      {
        label: '测试用例集',
        value: '65f2fed3067c907f0466f016',
      },
    ],
  },
  {
    value_generate_mode: 'Default',
    compound_fields: [
      {
        field_type_key: 'multi_text',
        field_alias: 'case_detail_result',
        field_name: '结果预期',
        is_custom_field: true,
        field_key: 'field_a5c6ef',
        value_generate_mode: 'Default',
      },
      {
        field_key: 'field_bb1da7',
        field_type_key: 'multi_text',
        is_custom_field: true,
        field_alias: 'case_detail_step',
        field_name: '步骤',
        value_generate_mode: 'Default',
      },
    ],
    field_alias: 'case_detail',
    field_name: '用例详情',
    is_custom_field: true,
    field_key: 'field_f3e8ce',
    field_type_key: 'compound_field',
  },
  {
    field_key: 'updated_by',
    field_alias: 'updated_by',
    field_type_key: 'user',
    field_name: '更新人',
    is_custom_field: false,
    value_generate_mode: 'Default',
  },
  {
    field_key: 'updated_at',
    field_type_key: 'date',
    field_name: '更新时间',
    is_custom_field: false,
    field_alias: 'updated_at',
    value_generate_mode: 'Default',
  },
  {
    field_key: 'auto_number',
    field_name: '自增数字',
    value_generate_mode: 'Default',
    field_type_key: 'number',
    field_alias: 'auto_number',
    is_custom_field: false,
  },
  {
    field_name: '终止原因',
    is_custom_field: false,
    field_alias: 'abort_reason',
    field_type_key: 'select',
    options: [
      {
        value: 'cancel',
        label: '取消，现在先不做了',
      },
      {
        label: '重复/合并，与其他在做工作项一同推进',
        value: 'repeat',
      },
      {
        label: '测试一下',
        value: 'test',
      },
      {
        label: '其他',
        value: 'other',
      },
    ],
    value_generate_mode: 'Default',
    field_key: 'abort_reason',
  },
  {
    field_key: 'abort_detail',
    field_type_key: 'text',
    field_alias: 'abort_detail',
    is_custom_field: false,
    value_generate_mode: 'Default',
    field_name: '补充终止原因',
  },
  {
    field_type_key: 'text',
    field_name: 'aaaaaaa',
    is_custom_field: true,
    value_generate_mode: 'Default',
    field_key: 'field_326586',
    field_alias: '',
  },
];

//包含跨多行的子步骤数据
export const multiLineStepData = [
  {
    用例名称: '测试插件点位',
    前置条件: '1,2,3',
    执行步骤: '步骤1',
    预期结果: '结果1',
  },
  {
    执行步骤: '步骤2',
    预期结果: ' 结果2',
  },
  {
    用例名称: '测试插件点位2',
    前置条件: '1,2,3',
    执行步骤: '步骤1',
    预期结果: '结果1',
  },
  {
    执行步骤: '步骤2',
    预期结果: ' 结果2',
  },
];

//包含跨多行的子步骤数据输出
export const multiLineStepDataOutput = [
  {
    field_value_pairs: [
      {
        field_key: 'name',
        field_value: '测试插件点位',
      },
      {
        field_key: 'field_f717b4',
        field_value: '1,2,3',
      },
      {
        field_key: 'field_023f96',
        field_value: '步骤1',
      },
      {
        field_key: 'field_2c7371',
        field_value: '结果1',
      },
    ],
  },
  {
    field_value_pairs: [
      {
        field_key: 'name',
        field_value: '测试插件点位2',
      },
      {
        field_key: 'field_f717b4',
        field_value: '1,2,3',
      },
      {
        field_key: 'field_023f96',
        field_value: '步骤1',
      },
      {
        field_key: 'field_2c7371',
        field_value: '结果1',
      },
    ],
  },
];

//用户输入数据包含不支持字段
export const inputWithUnsupportField = [
  {
    用例名称: '测试插件点位',
    前置条件: '1,2,3',
    执行步骤: '步骤1',
    预期结果: '结果1',
    完成日期: '2021-09-09',
    关联字段: 'a',
  },
  {
    执行步骤: '步骤2',
    预期结果: ' 结果2',
  },
  {
    用例名称: '测试插件点位2',
    前置条件: '1,2,3',
    执行步骤: '步骤1',
    预期结果: '结果1',
    完成日期: '2021-09-09',
    关联字段: 'a',
  },
  {
    执行步骤: '步骤2',
    预期结果: ' 结果2',
  },
];
