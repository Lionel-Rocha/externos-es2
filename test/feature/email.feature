Feature: testando o funcionamento do email

  Scenario: Verificar o funcionamento do envio de email
    When a rota enviarEmail é chamada com destinatário "sputniknel@gmail.com", assunto "teste" e corpo "teste"
    Then o email deve ser enviado com sucesso

  Scenario: Verificar o funcionamento do envio de email com destinatário inválido
    When a rota enviarEmail é chamada com destinatário "invalid-email", assunto "teste" e corpo "teste"
    Then deve retornar um erro informando que o endereço de email é inválido

