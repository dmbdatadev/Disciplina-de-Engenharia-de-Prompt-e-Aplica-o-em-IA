def disparar_alerta(nivel, mensagem):
    """Função auxiliar gerada com suporte do Copilot[cite: 382]."""
    print(f"[ALERTA {nivel}]: {mensagem}")

def monitorar_sistema(valor_atual, limite_critico):
    """Lógica condicional modularizada[cite: 386]."""
    # Refatoração sugerida pela IA para tornar o código mais limpo [cite: 383, 387]
    if valor_atual > limite_critico:
        disparar_alerta("CRÍTICO", f"O valor {valor_atual} ultrapassou o limite de {limite_critico}!")
        return True
    
    print("Sistema operando em níveis normais.")
    return False

if __name__ == "__main__":
    # Teste de sucesso da lógica condicional [cite: 385]
    monitorar_sistema(valor_atual=95, limite_critico=90)
