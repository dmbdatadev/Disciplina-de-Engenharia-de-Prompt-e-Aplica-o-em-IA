import requests

def consultar_cep(cep):
    # Limpeza do CEP
    cep = cep.replace("-", "").replace(".", "").strip()
    
    # Simulação de erro intencional ou correção sugerida pela IA [cite: 367, 368]
    url = f"https://viacep.com.br/ws/{cep}/json/"
    
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status() # Verifica se a requisição foi bem-sucedida
        
        dados = response.json()
        
        if "erro" in dados:
            print("CEP não encontrado.")
        else:
            # Impressão formatada e legível [cite: 373, 374]
            print(f"--- Endereço Encontrado ---")
            print(f"Logradouro: {dados['logradouro']}")
            print(f"Bairro: {dados['bairro']}")
            print(f"Cidade: {dados['localidade']} - {dados['uf']}")
            
    except requests.exceptions.RequestException as e:
        # Tratamento de erros de conexão sem 'quebrar' o script [cite: 375, 376]
        print(f"Erro na requisição: {e}")

if __name__ == "__main__":
    consultar_cep("70040-010")
