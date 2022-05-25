<div display = flex justtify-content = "center">
    <img src ="/tmp/monitor_test.png" width= "150px">
</div>
<h1>Integration Tests</h1>
<br>
<h4>São testes de Integração realizados na API <a href="https://github.com/alimadeoliveiranatalia/financial_statement">Financial Statement</a></h4>
<br>
<p>Os testes podem ser acessados em: src/modules/(escolha user ou statement)/useCase/(qualquer arquivo com a terminação).spec.ts</p>
<br>
<h6>Principais Testes Desenvolvidos</h6>
<ul>
    <li>POST: /api/v1/users, cadastra um usuário</li>
    <li>POST: /api/v1/sessions, autentifica um usuário com um token JWT.</li>
    <li>GET: /api/v1/profile, retorna informações de um usuário autentificado.</li>
    <li>GET: /api/v1/statements/balance, retorna as operações de depósito e saque de um usuário autentificado.</li>
    <li>POST: /api/v1/statements/deposit, cadastra uma operação de depósito de um usuário autentificado.</li>
    <li>GET: /api/v1/statements/withdraw, registra uma operação de saque de um usuário autentificado.</li>
    <li>GET: /api/v1/statements/:statement_id, realiza a busca de informações de uma operação passando seu id único.</li>
</ul>
<br>
<h4>Principais Tecnologias Utilizadas:</h4>
<ul>
    <li>Node.JS</li>
    <li>JWT (JSON WEB TOKEN)</li>
    <li>Express</li>
    <li>Jest</li>
    <li>Supertest</li>
    <li>TypeORM</li>
    <li>PostgreSQL</li>
    <li>Docker</li>
</ul>
