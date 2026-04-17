Feature: Gestão de Cadastro e Acesso
  As a visitante ou usuário do sistema
  I want to realizar cadastro e login
  So that eu possa acessar as funcionalidades de chat com segurança

  Scenario: Cadastro de novo usuário com sucesso
    Given que estou na tela de cadastro
    When eu insiro um e-mail válido, nome de usuário e senha
    And clico no botão "Registrar"
    Then o sistema deve criar minha conta
    And me redirecionar até a tela principal do chat

  Scenario: Login com credenciais válidas
    Given que possuo uma conta cadastrada
    And estou na tela de login
    When eu informo meu e-mail e senha corretos
    And clico em "Entrar"
    Then o sistema deve validar meu acesso
    And exibir minha lista de contatos