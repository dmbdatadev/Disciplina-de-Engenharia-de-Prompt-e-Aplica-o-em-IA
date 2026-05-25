import re

def validar_cpf(cpf_bruto: str) -> bool:
    """
    Valida um número de CPF brasileiro de acordo com o algoritmo da Receita Federal.

    Args:
        cpf_bruto (str): O CPF a ser validado (aceita formatado ou apenas números).

    Returns:
        bool: True se o CPF for válido, False caso contrário.
    """
    
    # 1. Limpeza: Remove qualquer caractere que não seja número
    cpf = re.sub(r'\D', '', cpf_bruto)

    # 2. Restrição: Verifica se possui 11 dígitos
    if len(cpf) != 11:
        return False

    # 3. Restrição: Verifica se é uma sequência de números repetidos (casos conhecidos como falsos)
    if cpf == cpf[0] * 11:
        return False

    # 4. Cálculo do Primeiro Dígito Verificador
    soma_1 = sum(int(cpf[i]) * (10 - i) for i in range(9))
    resto_1 = (soma_1 * 10) % 11
    digito_1 = resto_1 if resto_1 < 10 else 0

    if digito_1 != int(cpf[9]):
        return False

    # 5. Cálculo do Segundo Dígito Verificador
    soma_2 = sum(int(cpf[i]) * (11 - i) for i in range(10))
    resto_2 = (soma_2 * 10) % 11
    digito_2 = resto_2 if resto_2 < 10 else 0

    if digito_2 != int(cpf[10]):
        return False

    return True

# --- Exemplos de Uso ---
if __name__ == "__main__":
    cpfs_para_teste = [
        "123.456.789-09",  # Inválido
        "111.111.111-11",  # Inválido (repetido)
        "44455566677",     # Exemplo de formato apenas números
        "00000000191",     # Válido (exemplo real de algoritmo)
    ]

    for c in cpfs_para_teste:
        resultado = "VÁLIDO" if validar_cpf(c) else "INVÁLIDO"
        print(f"CPF: {c:15} | Status: {resultado}")
