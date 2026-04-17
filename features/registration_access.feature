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
    Given que possuo uma conta registrada
    And estou na tela de login
    When eu informo meu e-mail e senha corretos
    And clico em "Entrar"
    Then o sistema deve validar meu acesso
    And exibir minha lista de contatos

Scenario: Cadastro com e-mail já existente
    Given que estou na tela de cadastro
    When eu tento registrar um e-mail que já possui conta
    Then o sistema deve exibir um alerta de "E-mail já cadastrado"

Scenario: Login com senha incorreta
    Given que possuo uma conta cadastrada
    When eu informo meu e-mail correto mas a senha errada
    Then o sistema deve impedir o acesso
    And exibir a mensagem "Credenciais inválidas"
    And registrar a tentativa de login suspeita

Scenario: [EXPERIMENTAL] Recuperação de conta via SMS
    Given que esqueci minha senha de acesso
    When eu solicito a recuperação via número de celular
    Then o sistema deve enviar um código de verificação por SMS
    And permitir a criação de uma nova senha temporária

Scenario: [EXPERIMENTAL] Validação de segurança por e-mail
    Given que o sistema detectou um acesso de um novo dispositivo
    When eu confirmo minha identidade através do link enviado por e-mail
    Then o sistema deve autorizar o novo dispositivo para uso

Scenario: [FINAL] Validação de segurança por e-mail com expiração
    Given que o sistema detectou um acesso de um novo dispositivo
    When eu confirmo minha identidade através do link enviado por e-mail em até 10 minutos
    Then o sistema deve autorizar o novo dispositivo
    But o link deve expirar após esse período por questões de segurança