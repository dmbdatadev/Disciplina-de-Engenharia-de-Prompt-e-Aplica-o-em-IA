# Role
Atue como um Engenheiro de Software Sênior com foco em Clean Code e Segurança.

# Contexto
Preciso integrar uma função de validação de CPF no backend de uma aplicação financeira. A precisão é crítica para evitar cadastros fraudulentos ou errôneos.

# Tarefa
Desenvolva uma função em Python 3.10+ chamada `validar_cpf`.

# Restrições e Regras de Negócio
1. **Limpeza:** A função deve aceitar strings com ou sem formatação (pontos e traço) e ignorar caracteres não numéricos.
2. **Casos Triviais:** Deve retornar `False` se o CPF tiver menos ou mais de 11 dígitos ou se for uma sequência de números repetidos (ex: "000.000.000-00").
3. **Algoritmo:** Implemente o cálculo oficial dos dois dígitos verificadores conforme a regra da Receita Federal.
4. **Qualidade:** Use tipagem de dados (`type hints`), Docstrings detalhadas e comentários explicativos.

# Formato de Saída
- Código em bloco Python.
- Uma breve explicação de como o cálculo dos dígitos foi implementado.
- Exemplos de uso com valores Válidos e Inválidos.
