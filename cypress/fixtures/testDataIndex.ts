export const multiLineStepData = [
  {
    用例名称: '测试插件点位',
    前置条件: '1,2,3',
    执行步骤: '步骤1',
    预期结果: '结果1',
    优先级: 'P1',
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
    优先级: 'P0',
  },
  {
    执行步骤: '步骤2',
    预期结果: ' 结果2',
  },
];

export const processedMultiLineStepData = [
  {
    用例名称: '测试插件点位',
    前置条件: '1,2,3',
    执行步骤: '步骤1',
    预期结果: '结果1',
    优先级: 'option_2',
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
    优先级: 'option_1',
  },
  {
    执行步骤: '步骤2',
    预期结果: ' 结果2',
  },
];

export const metaFields = [
  {
    field_name: '用例名称',
    label: '',
    is_visibility: 1,
    field_alias: 'name',
    default_value: {
      default_appear: 2,
    },
    is_validity: 1,
    field_key: 'name',
    field_type_key: 'text',
    is_required: 1,
  },
  {
    is_required: 1,
    field_alias: 'action',
    default_value: {
      default_appear: 2,
    },
    is_validity: 1,
    field_name: '前置条件',
    field_type_key: 'multi_text',
    is_visibility: 1,
    label: '',
    field_key: 'field_f717b4',
  },
  {
    field_type_key: 'multi_select',
    field_name: '用例类型',
    label: '',
    is_visibility: 1,
    field_alias: 'testcase_type',
    default_value: {
      default_appear: 2,
    },
    options: [
      {
        label: '功能用例',
        value: 'testcase_function',
        is_disabled: 2,
        is_visibility: 1,
      },
      {
        value: 'testcase_compatibility',
        is_disabled: 2,
        is_visibility: 1,
        label: '兼容性用例',
      },
    ],
    is_validity: 1,
    field_key: 'field_e42a97',
    is_required: 2,
  },
  {
    is_visibility: 1,
    field_key: 'field_65e1cc',
    field_type_key: 'multi_select',
    options: [
      {
        is_visibility: 1,
        label: 'ty',
        value: 'ty',
        is_disabled: 2,
      },
      {
        is_visibility: 1,
        label: 'ml',
        value: 'ml',
        is_disabled: 2,
      },
    ],
    is_required: 2,
    field_alias: 'tags',
    label: '',
    field_name: '标签',
    default_value: {
      default_appear: 2,
    },
    is_validity: 1,
  },
  {
    field_type_key: 'multi_file',
    default_value: {
      default_appear: 2,
    },
    is_required: 2,
    is_visibility: 1,
    field_key: 'field_603db5',
    label: '',
    field_name: '附件',
    field_alias: 'attachment',
    is_validity: 1,
  },
  {
    default_value: {
      default_appear: 2,
    },
    label: '',
    field_name: '关联需求',
    is_visibility: 1,
    field_alias: 'related_story',
    field_type_key: 'work_item_related_multi_select',
    is_required: 2,
    is_validity: 1,
    field_key: 'field_d73be1',
  },
  {
    is_validity: 1,
    is_required: 2,
    field_name: '角色与人员',
    is_visibility: 1,
    field_key: 'role_owners',
    field_alias: '',
    field_type_key: 'role_owners',
  },
  {
    is_visibility: 1,
    field_name: '用例分级',
    field_key: 'field_ad0ad4',
    field_alias: 'testcase_priority',
    is_validity: 1,
    options: [
      {
        label: 'P0',
        value: 'wx10xqwo8',
        is_disabled: 2,
        is_visibility: 1,
      },
      {
        is_visibility: 1,
        label: 'P1',
        value: 'c0z9ko2mk',
        is_disabled: 2,
      },
      {
        label: 'P2',
        value: 'ck4xd409s',
        is_disabled: 2,
        is_visibility: 1,
      },
    ],
    label: '',
    is_required: 2,
    field_type_key: 'select',
    default_value: {
      default_appear: 2,
    },
  },
];
