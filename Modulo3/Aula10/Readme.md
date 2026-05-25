# 📑 Relatório Consolidado: Engenharia de Prompt e Aplicações em IA
**Instituição:** UDF - Centro Universitário  
**Disciplina:** Engenharia de Prompt e Aplicações em IA  
**Unidades:** I, II e III

---

## 🏗️ Unidade I & II: Fundamentos e Programação Assistida

### 1. O Paradigma da Colaboração Humano-IA
A transição do desenvolvimento tradicional para o assistido define o humano como o **Tech Lead** e a IA como um parceiro incansável, porém júnior. O ciclo de trabalho baseia-se em:
* **Contextualizar & Sugerir:** A IA gera sugestões baseadas no código existente.
* **Avaliar Criticamente:** O humano valida a lógica, segurança e arquitetura.
* **Decidir & Integrar:** A responsabilidade final pelo commit é sempre do humano.

### 2. Arquitetura de Prompts e Precisão Lógica
Estudos indicam que o uso excessivo de "Personas" em tarefas de lógica pura pode reduzir a precisão de **71,6%** para **68,0%** devido à sobrecarga de contexto.
* **Prompts Neutros:** Ideais para cálculos e algoritmos exatos.
* **Prompts de Persona:** Úteis para ajuste de tom e escrita criativa.
* **Prompts Restritivos:** Garantem formatação estrita (ex: saídas apenas em JSON ou código puro).

---

## ⚡ Unidade III: Low Code e No Code

### 1. O Equilíbrio entre Flexibilidade e Produtividade
As plataformas visuais permitem o desenvolvimento acelerado sem a necessidade de escrever código do zero para funções padrão.
* **No Code:** 100% visual, ideal para usuários de negócios.
* **Low Code:** Reduz o código manual, mas permite injeção de scripts para customizações profundas.

### 2. O Fluxo de Desenvolvimento Moderno
1. **O Comando:** O desenvolvedor utiliza Engenharia de Prompt para descrever a necessidade.
2. **A Interpretação:** A LLM traduz a intenção semântica em lógica.
3. **A Geração:** A plataforma (ex: Bubble ou Make) renderiza a interface ou automação pronta para uso.

---

## 🛠️ Entregáveis Técnicos (Scripts de Automação)

### A. Validador de CPF (Python)
Implementação de lógica pura para validação de dígitos verificadores, evitando bibliotecas externas para garantir performance.

### B. Automação de Arquivos
Script para organização sistemática de diretórios com base na extensão dos arquivos (`os` e `shutil`).

### C. Integração com API (ViaCEP)
Consulta de endereços com tratamento de exceções (`try/except`) e formatação de payloads JSON para exibição legível.

---

## 📝 Análise Crítica Final
A IA é uma ferramenta poderosa para **velocidade e sintaxe**, autocompletando padrões repetitivos e sugerindo algoritmos otimizados. Contudo, ela falha em compreender **regras de negócio complexas** e pode introduzir vulnerabilidades de segurança se não houver supervisão humana constante. A Engenharia de Prompt é a habilidade de desenhar a arquitetura certa para a tarefa certa.
