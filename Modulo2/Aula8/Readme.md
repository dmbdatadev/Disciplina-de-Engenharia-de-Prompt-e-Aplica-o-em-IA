# Relatório de Prática: Programação Assistida (Unidade II)

Este documento registra a aplicação das competências de refatoração colaborativa e uso de ferramentas de IA (GitHub Copilot/Replit) conforme as diretrizes da Profª Kadidja Valéria.

## 1. O Novo Paradigma: Dev + IA
A colaboração evoluiu do *Pair Programming* tradicional ($Dev + Dev$) para um modelo onde o desenvolvedor atua como **Tech Lead** de um parceiro de IA. 

### Ciclo de Trabalho Aplicado:
1. **Contextualizar & Sugerir (IA):** Geração da lógica inicial via prompt.
2. **Avaliar Criticamente (Humano):** Revisão da lógica e segurança.
3. **Refatorar & Ajustar (H+IA):** Otimização iterativa.
4. **Decidir & Integrar (Humano):** Assunção da responsabilidade final pelo código.

---

## 2. Mini-Projeto Escolhido: API de Consulta de CEP (Nível Avançado)
O projeto consiste em realizar requisições HTTP para buscar endereços brasileiros, utilizando a IA para gerar o *boilerplate* REST e tratar payloads JSON.

### Estratégia de Engenharia de Prompt (Cheat Sheet):
* **Prompt Estruturado:** "Atue como um dev Python Sênior. Crie uma função modular para consultar a API ViaCEP. Trate erros de conexão e chaves ausentes no JSON (KeyError)".
* **Foco na Refatoração:** Substituição de loops manuais por métodos nativos e performáticos.

---

## 3. Conclusão e Limites da Automação
A prática demonstrou que a máquina entrega **velocidade e sintaxe**, mas falha em compreender as **regras de negócio e segurança** O humano permanece como o responsável pela assinatura final e arquitetura.
