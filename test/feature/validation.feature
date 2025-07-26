Feature: testando o funcionamento da verificação de cartão de crédito

  Scenario: Verificar o funcionamento da validação de cartão de crédito
    When a rota validarCartaoCredito é chamada com número "4111111111111111", nome "JOHN DOE", data de validade "12/25" e código de segurança "123"
    Then o cartão de crédito deve ser validado com sucesso