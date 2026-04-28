Feature: Notificações e Alertas
  As a usuário do aplicativo de chat
  I want to receber avisos visuais e sonoros de novas mensagens
  So that eu saiba que recebi algo mesmo estando fora da tela do chat

  Scenario: Banner de notificação exibido em outra tela
    Given que o usuário "Ana" está na tela "Configurações de Perfil"
    And possui conexão ativa com o servidor
    When o usuário "Filipe" envia a mensagem "E aí, tudo bem?" para "Ana"
    Then o sistema exibe um banner no topo da tela com "Filipe" e "E aí, tudo bem?"
    And o banner desaparece após 4 segundos

  Scenario: Badge zerado ao abrir conversa
    Given que o usuário "Ana" está na tela "Lista de Conversas"
    And o badge ao lado de "João" exibe "3" mensagens não lidas
    When "Ana" abre a conversa com "João"
    Then o badge ao lado de "João" é removido
    And todas as mensagens de "João" ficam marcadas como lidas
    And o ícone do app na barra de tarefas para de piscar 

  Scenario: Feedback de falha de conexão ao tentar atualizar notificações
    Given que o usuário "Ana" está na tela "Lista de Conversas"
    And o dispositivo está sem conexão com a internet
    When "Ana" tenta atualizar a lista de notificações
    Then o sistema exibe o banner de erro "Sem conexão. Verifique sua internet."
    And o badge numérico permanece inalterado

  Scenario: Erro interno do servidor ao consultar badges
    Given que o usuário "Ana" está autenticada no sistema
    And o servidor de notificações está em estado de manutenção
    When o serviço recebe a requisição GET /api/v1/notifications/badges
    Then o serviço retorna HTTP 503 Service Unavailable
    And o corpo da resposta contém a mensagem "Serviço temporariamente indisponível"

  Scenario: Notificação recebida com tela bloqueada
    Given que o usuário "Ana" está com a tela do dispositivo bloqueada
    And possui notificações push ativadas
    When o usuário "João" envia uma mensagem urgente para "Ana"
    Then o sistema exibe o banner de notificação na tela de bloqueio
    And o dispositivo emite vibração curta

  Scenario: Som de notificação customizado por contato
    Given que o usuário "Ana" configurou um som personalizado para "João"
    When "João" envia uma nova mensagem
    Then o sistema reproduz o som customizado ao invés do som padrão