describe('开心路径', () => {
  before(() => {
    cy.visit(
      'https://accounts.feishu.cn/accounts/page/login?app_id=104&app_name=meego&no_trap=1&pattern=4&redirect_uri=https%3A%2F%2Fproject.feishu.cn%2FfetchCookieByLogin%3Fstate%3Dhttps%3A%2F%2Fproject.feishu.cn%2F%26has_channel%3Dtrue&template_id=6992782334254432259',
    );
    cy.wait(50000);
    cy.url().should('include', 'https://project.feishu.cn/');
    cy.visit('https://project.feishu.cn/jerrysspace/test_cases/homepage');
    cy.wait(10000);
    cy.url().should('include', 'https://project.feishu.cn/jerrysspace/test_cases/homepage');
    cy.visit(
      'https://project.feishu.cn/jerrysspace/test_cases/detail/4528484072?parentUrl=%2Fjerrysspace%2Ftest_cases%2Fhomepage',
    );
    cy.wait(10000);
    cy.url().should(
      'include',
      'https://project.feishu.cn/jerrysspace/test_cases/detail/4528484072?parentUrl=%2Fjerrysspace%2Ftest_cases%2Fhomepage',
    );
    cy.wait(10000);
    cy.reload();

    cy.wait(50000);
    cy.wait(50000);
    cy.get('span.sortable-tab-name-text').contains('Excel导入').click();
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
