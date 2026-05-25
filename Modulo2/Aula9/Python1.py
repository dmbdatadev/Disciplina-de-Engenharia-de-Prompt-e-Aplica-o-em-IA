import os
import shutil

def organizar_arquivos(diretorio_alvo):
    # Lista todos os arquivos no diretório
    for arquivo in os.listdir(diretorio_alvo):
        caminho_completo = os.path.join(diretorio_alvo, arquivo)
        
        # Ignora se for uma pasta
        if os.path.isdir(caminho_completo):
            continue
            
        # Extrai a extensão do arquivo
        extensao = arquivo.split('.')[-1].lower()
        pasta_destino = os.path.join(diretorio_alvo, extensao)
        
        # Cria a pasta caso não exista [cite: 359]
        if not os.path.exists(pasta_destino):
            os.makedirs(pasta_destino)
            
        # Move o arquivo [cite: 360]
        try:
            shutil.move(caminho_completo, os.path.join(pasta_destino, arquivo))
            print(f"Movido: {arquivo} -> Pasta {extensao}")
        except Exception as e:
            print(f"Erro ao mover {arquivo}: {e}")

if __name__ == "__main__":
    # Exemplo de uso
    organizar_arquivos("./pasta_baguncada")
