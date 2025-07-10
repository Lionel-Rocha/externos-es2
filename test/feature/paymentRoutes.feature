Feature: Gestão de cobranças e pagamentos

  Background:
    Given que o token de autenticação foi gerado

  Scenario: Criar e pagar uma cobrança com sucesso
    Given o usuário "12345" existe
    When uma cobrança de valor "100" for criada para o usuário "12345"
    Then a resposta deve conter "Bill paid successfully!"

  Scenario: Criar uma cobrança em fila
    When uma cobrança de valor "50" for enfileirada para o usuário "12345"
    Then a resposta deve ter status 200

  Scenario: Processar todas as cobranças pendentes
    When o sistema processar as cobranças em fila
    Then a resposta deve ser "All bills were processed."

  Scenario: Buscar uma cobrança existente
    Given uma cobrança foi criada para o usuário "12345"
    When o sistema buscar a última cobrança criada
    Then a resposta deve conter status 200

  Scenario: Buscar uma cobrança inexistente
    When o sistema buscar a cobrança "invalida"
    Then a resposta deve conter o status 404

  Scenario: Tentar criar e pagar cobrança com usuário inexistente
    When uma cobrança de valor "100" for criada para o usuário "nao-existe"
    Then a resposta deve conter o status 500


  Scenario: Buscar cobrança inexistente retorna 404
    When o sistema buscar a cobrança "bill_invalido"
    Then a resposta deve conter o status 404

  Scenario: Erro ao enfileirar cobrança por valor inválido
    When uma cobrança de valor "abc" for enfileirada para o usuário "12345"
    Then a resposta deve conter o status 500
