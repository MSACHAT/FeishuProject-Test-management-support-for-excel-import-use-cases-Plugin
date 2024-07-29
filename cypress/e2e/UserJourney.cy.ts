describe('开心路径', () => {
  before(() => {});

  it('用户基本旅程', () => {
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

    //开始测试
    cy.get('.dashboard-container').find('button').should('exist').click();
    cy.get('[role="dialog"]').should('exist');

    //上传文件
    const filePath = 'example(withAllSupportFields).xlsx';
    cy.get('.semi-upload-hidden-input').should('be.visible').selectFile(filePath, { force: true });

    cy.contains('span', '上传成功').should('be.visible');

    // 点击“下一步”按钮
    cy.get('button[aria-label="confirm"]').click();

    // 验证表头
    cy.get('th[title="用例名称"]').should('be.visible').and('contain.text', '用例名称');
    cy.get('th[title="前置条件"]').should('be.visible').and('contain.text', '前置条件');
    cy.get('th[title="用例类型"]').should('be.visible').and('contain.text', '用例类型');
    cy.get('th[title="优先级"]').should('be.visible').and('contain.text', '优先级');
    cy.get('th[title="描述"]').should('be.visible').and('contain.text', '描述');
    cy.get('th[title="标签"]').should('be.visible').and('contain.text', '标签');
    cy.get('th[title="步骤"]').should('be.visible').and('contain.text', '步骤');
    cy.get('th[title="结果预期"]').should('be.visible').and('contain.text', '结果预期');

    // 验证第一行的每个单元格内容
    cy.get('tbody > tr')
      .eq(0)
      .within(() => {
        cy.get('td').eq(0).should('have.attr', 'title', '测试插件点位');
        cy.get('td').eq(1).should('have.attr', 'title', '1,2,3');
        cy.get('td').eq(2).should('have.attr', 'title', '功能用例');
        cy.get('td').eq(3).should('have.attr', 'title', 'P1');
        cy.get('td').eq(4).should('have.attr', 'title', '啊吧吧吧');
        cy.get('td').eq(5).should('have.attr', 'title', 'ty');
        cy.get('td').eq(6).should('have.attr', 'title', 'sdjkabwd');
        cy.get('td').eq(7).should('have.attr', 'title', 'das');
      });
    // 验证第二行的每个单元格内容
    cy.get('tbody > tr')
      .eq(1)
      .within(() => {
        cy.get('td').eq(0).should('have.attr', 'title', '测试插件点位2');
        cy.get('td').eq(1).should('have.attr', 'title', '1,2,3');
        cy.get('td').eq(2).should('have.attr', 'title', '功能用例');
        cy.get('td').eq(3).should('have.attr', 'title', 'P0');
        cy.get('td').eq(4).should('have.attr', 'title', '吗吗吗');
        cy.get('td').eq(5).should('have.attr', 'title', 'ty');
        cy.get('td').eq(6).should('have.attr', 'title', 'adw');
        cy.get('td').eq(7).should('have.attr', 'title', 'asdad');
      });
  });
  // 验证第三行的每个单元格内容
  cy.get('tbody > tr')
    .eq(2)
    .within(() => {
      cy.get('td').eq(0).should('be.empty');
      cy.get('td').eq(1).should('be.empty');
      cy.get('td').eq(2).should('be.empty');
      cy.get('td').eq(3).should('be.empty');
      cy.get('td').eq(4).should('be.empty');
      cy.get('td').eq(5).should('be.empty');
      cy.get('td').eq(6).should('have.attr', 'title', 'asdi');
      cy.get('td').eq(7).should('have.attr', 'title', 'djbda');
    });

  cy.get('button[aria-label="confirm"]').click();

  cy.contains('span', '导入完成，即将帮您自动跳转').should('be.visible');
});
