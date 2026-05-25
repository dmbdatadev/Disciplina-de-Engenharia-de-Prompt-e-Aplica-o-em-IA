def calcular_media_academica():
    """
    Calcula a média de 4 notas e verifica o status de aprovação.
    Regra: Média mínima 7.0 para aprovação.
    """
    try:
        # Coleta das 4 notas do aluno
        notas = []
        for i in range(1, 5):
            nota = float(input(f"Digite a nota {i}: "))
            notas.append(nota)

        # Processamento lógico: Cálculo da média aritmética
        media = sum(notas) / len(notas)

        # Verificação de status (Aprovação/Reprovação)
        print(f"\nMédia Final: {media:.2f}")
        
        if media >= 7.0:
            print("Status: APROVADO")
        else:
            print("Status: REPROVADO")

    except ValueError:
        print("Erro: Por favor, insira apenas valores numéricos válidos.")

if __name__ == "__main__":
    calcular_media_academica()
