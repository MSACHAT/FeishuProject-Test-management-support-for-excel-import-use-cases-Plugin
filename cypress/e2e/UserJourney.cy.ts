describe('开心路径', () => {
  before(() => {
    cy.visit('https://project.feishu.cn/jerrysspace/test_cases/homepage');
    cy.wait(100000);
  });
  beforeEach(() => {
    cy.visit(
      'https://project.feishu.cn/jerrysspace/test_cases/detail/4505594137?parentUrl=%2Fjerrysspace%2Ftest_cases%2Fhomepage#MII_669626B3D1C6C002-dashboard_9w9z',
    );
  });
  it('1. 用户点击导入excel文件按钮', () => {
    cy.get('.dashboard-container').find('button').should('exist').click();
  });
  it('2. 弹出全屏对话框', () => {
    cy.get('[role="dialog"]').should('exist');
  });
  it('3. 上方进度条显示正常', () => {
    cy.get('div.semi-steps-item-title')
      .eq(0)
      .find('div.semi-steps-item-title-text')
      .contains('第一步：导入');
    cy.get('div.semi-steps-item-title')
      .eq(1)
      .find('div.semi-steps-item-title-text')
      .contains('第二步：预览');
    cy.get('div.semi-steps-item-title')
      .eq(2)
      .find('div.semi-steps-item-title-text')
      .contains('第三步：完成');
  });
});
