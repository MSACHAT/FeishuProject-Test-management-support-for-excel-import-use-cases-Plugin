describe('开心路径', () => {
  beforeEach(() => {
    cy.visit(
      'https://project.feishu.cn/excel-plugin/story/detail/4462528407?parentUrl=%2Fexcel-plugin%2Fstory%2Fhomepage#MII_669626B3D1C6C002-dashboard_9w9z',
    );
  });
  it('1. 用户点击导入excel文件按钮', () => {
    cy.get('.dashboard-container').find('button').should('exist').click();
  });
  it('2. 弹出全屏对话框', () => {
    cy.get('.semi-modal-header').find('h5').contains('从表格导入测试用例');
  });
  it('3. 上方进度条显示正常', () => {
    cy.get('div.semi-steps-item-title')
      .eq(0)
      .find('div.semi-steps-item-title-text')
      .contains('第一步：导入');
    cy.get('div.semi-steps-item-title')
      .eq(1)
      .find('div.semi-steps-item-title-text')
      .contains('第一步：导入');
    cy.get('div.semi-steps-item-title')
      .eq(2)
      .find('div.semi-steps-item-title-text')
      .contains('第一步：导入');
  });
});
