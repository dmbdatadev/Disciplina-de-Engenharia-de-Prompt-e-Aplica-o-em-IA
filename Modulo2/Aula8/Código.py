import requests

def consultar_cep(cep: str):
    """
    Realiza consulta de endereço via API REST.
    Lógica refatorada para performance e segurança.
    """
    # Limpeza do input (Garantindo apenas números)
    cep_limpo = "".join(filter(str.isdigit, cep))
    
    if len(cep_limpo) != 8:
        return {"erro": "CEP Inválido (deve conter 8 dígitos)"}

    url = f"https://viacep.com.br/ws/{cep_limpo}/json/"

    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()  # Validação de status HTTP
        
        dados = response.json()
        
        # Tratamento de erro específico da API ViaCEP
        if "erro" in dados:
            return {"erro": "CEP não encontrado na base de dados."}
            
        # Retorno otimizado (Uso inteligente de dicionários)
        return {
            "logradouro": dados.get("logradouro", "N/A"),
            "bairro": dados.get("bairro", "N/A"),
            "cidade": dados.get("localidade", "N/A"),
            "estado": dados.get("uf", "N/A")
        }

    except requests.exceptions.RequestException as e:
        return {"erro": f"Falha na conexão: {str(e)}"}

# Exemplo de uso
if __name__ == "__main__":
    resultado = consultar_cep("70040-010") # Exemplo: Brasília
    print(resultado)
