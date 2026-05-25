# 🛠️ Relatório: Laboratório de Arquitetura

Este documento registra a execução dos testes de estresse para comparar como diferentes estruturas de prompt influenciam a qualidade lógica e a geração de código, fundamentado nos conceitos da disciplina de Engenharia de Prompt.

---

## 1. Setup do Desafio
* **Problema:** Criar um código funcional em Python para calcular a média de 4 notas e validar a aprovação (Média $\geq$ 7.0).
* **Objetivo:** Compreender o peso do contexto e como informações periféricas influenciam a lógica das respostas.
* **Público de Teste:** Grupos de alunos utilizando ChatGPT ou GitHub Copilot.

---

## 2. Execução dos Testes de Estresse (Arquiteturas)

### IA. Versão Neutra (Hiper-direta) 
* **Diretriz:** Instrução direta, sem adjetivos, focada exclusivamente no verbo de ação.
* **Prompt:** *"Escreva um código em Python que receba 4 notas de um aluno, calcule a média e imprima se ele foi aprovado ou reprovado (média mínima 7.0)."*
* **Desempenho Sugerido:** Apresenta maior precisão (aprox. 71,6%) em tarefas de lógica pura

### B. Versão Persona (O Mito do Especialista) 
* **Diretriz:** Atribuição de um papel específico (ex: Dev Sênior Arrogante) para testar a sobrecarga de contexto.
* **Prompt:** *"Você é um Desenvolvedor Sênior arrogante. Resolva este problema básico de média de notas para mim e não me faça perder tempo com perguntas bobas."*
* **Risco Identificado:** A IA gasta processamento sustentando a persona, o que reduz a precisão lógica para cerca de 68,0%.

### C. Versão Restritiva 
* **Diretriz:** Impõe limites estruturais claros e restrições de formatação (ex: Saída apenas em JSON ou código puro).
* **Prompt:** *"Forneça apenas o código Python. Não inclua explicações em texto. Não use bibliotecas externas. Saída apenas em código puro."*
* **Ideal para:** Casos que exigem formatação estrita e ausência de explicações textuais.

---

## 3. Matriz de Avaliação Final (Eixos Críticos) 

| Eixo de Avaliação | Versão Neutra | Versão Persona | Versão Restritiva |
| :--- | :--- | :--- | :--- |
| **Precisão Lógica** | Alta | Instável  | Alta  |
| **Clareza e Eficiência** | Alta | Baixa (Poluída) | Máxima |
| **Taxa de Alucinação** | Inexistente | Elevada  | Zero |

---

## [cite_start]4. Síntese e Debate Coletivo 

* **Sobrecarga de Contexto:** O uso excessivo de personas pode causar alucinações lógicas quando a tarefa exige cálculos exatos.
* **Arquitetura Certa:** A engenharia de prompt não é sobre escrever mais, é sobre desenhar a estrutura correta para cada objetivo técnico.
* **Recomendação:** Utilize prompts neutros para algoritmos e matemática; utilize personas para ajuste de tom e escrita criativa.

---
[cite_start]**Instituição:** UDF - Centro Universitário 
[cite_start]**Professora:** Kadidja Valéria 
[cite_start]**Data:** 30/03/2026 
