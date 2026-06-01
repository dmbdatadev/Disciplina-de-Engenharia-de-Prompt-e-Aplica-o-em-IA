# Projeto Módulo 3 – Low Code/No Code/Vibecode

## 📌 Desafio Escolhido
O desafio selecionado foi o desenvolvimento de um **Sistema de Triagem Inteligente de Currículos** (plataforma batizada de *NexHR.ia*). O problema central que buscamos resolver é o excesso de tempo gasto por profissionais de RH na leitura manual de currículos que frequentemente não possuem o perfil da vaga. 

A solução proposta é um fluxo de trabalho centralizado de recebimento de candidatos onde uma Inteligência Artificial atua diretamente na triagem: a IA lê o texto do currículo (mesmo de forma não estruturada), extrai as 5 principais habilidades do candidato e gera uma pontuação (*score* percentual) de compatibilidade exata com a descrição da vaga pretendida, salvando o parecer diretamente no *card* do candidato no sistema.

---

## 🖥️ Protótipo
- **Acesso à Aplicação:** O protótipo é um MVP 100% funcional, navegável e responsivo.
- **Como o protótipo funciona:** 
  1. **Autenticação e Hub:** O usuário inicia em uma tela de Login/Cadastro com design moderno (Glassmorphism), criando um perfil que é refletido no dashboard.
  2. **Dashboard de Vagas:** Visualização e criação de novas oportunidades de emprego.
  3. **Integração Vibecode (O Motor da IA):** Ao adicionar um candidato a uma vaga, o usuário conta com uma zona de *Drag & Drop* para arquivos textuais. A IA integrada interpreta os dados e retorna as habilidades e o *score* de aderência.
  4. **Pipeline Kanban:** Os candidatos triados viram "cards" que podem ser arrastados livremente (*Drag & Drop*) pelas etapas do processo seletivo (Novos, Em Análise, Entrevistas, Aprovados).
  5. **Comunicação e Integrações:** Tela de configuração com hub de atalhos para plataformas externas (LinkedIn, Catho, Empregare, Gupy) e função integrada para envio/recebimento simulado de e-mails para comunicação direta com os talentos.
> Coloque os arquivos de imagem ou PDF na pasta `/docs`. *(Nota: Adicionar os prints das telas do sistema nesta pasta do repositório).*

---

## ⚙️ Plataforma Utilizada
- **Nome da plataforma:** Gemini Canvas. 
- **Justificativa da escolha:** O Gemini Canvas foi selecionado para eliminar tarefas manuais e centralizar os fluxos de trabalho do RH de forma visual. A escolha por esse ecossistema visou comprovar que o desenvolvimento moderno permite transformar ideias complexas em soluções práticas sem barreiras técnicas.

---

## ✅ Vantagens Identificadas
Com base na aplicação prática e no conteúdo da disciplina, listamos as seguintes vantagens da abordagem adotada:
1. **Validação rápida de ideias:** Possibilidade de desenvolver e testar o MVP (*Minimum Viable Product*) da plataforma NexHR.ia em curtíssimo prazo.
2. **Automação de processos:** Capacidade de eliminar fluxos internos repetitivos (como a leitura humana inicial de currículos).
3. **Autonomia:** Permite que equipes não-técnicas (profissionais de RH, neste caso) possuam o controle do fluxo de dados.

---

## ⚠️ Limitações Encontradas
Durante a concepção técnica, detectamos limitações inerentes às arquiteturas Low/No Code:
1. **Escalabilidade:** Dificuldade em garantir performance caso a plataforma precise processar milhões de acessos e currículos simultâneos.
2. **Customização profunda limitada:** Restrições para implementar regras de negócio ou lógicas arquiteturais profundamente customizadas sem recorrer ao código tradicional.
3. **Dependência Estrutural:** Risco de ficar refém das políticas e precificações das plataformas terceiras.
4. **Falta de Compatibilidade Simultanea:** Risco de ficar incompativel com plataformas mobile.
5. **IA Generativa Limitada:** Plataforma de Low Code não compatível com o esperado previsto pelos criadores da plataforma.
---

## 📚 Reflexão Crítica
Para superar as barreiras de customização profunda, o grupo aplicou com sucesso o novo paradigma do **Vibecode**. Quando a interface visual (fluxo Kanban) atingiu seu limite ao tentar ler dados não estruturados de currículos, utilizamos Inteligência Artificial para gerar o "código leve" de análise (JSON estruturado com *scores* e *skills*). A eficácia com que os prompts de IA foram usados resolveu bloqueios visuais da ferramenta. Além disso, desenvolvemos o senso crítico para contornar restrições arquiteturais criando "mecanismos de *fallback*" (simulações de IA em caso de queda de API) garantindo que a aplicação seja sempre funcional.

---

## 👥 Colaboração
O projeto atendeu às regras de engajamento propostas (grupos de até 3 estudantes). A divisão de responsabilidades foi estruturada para garantir a organização lógica das ideias:
* **Daniel de Miranda (Arquitetura e Interface):** Responsável pela organização visual lógica do fluxo de dados (*Drag & Drop* no Kanban) e design do sistema.
* **João Victor (Engenharia de Prompt & Vibecode):** Focado na construção estrutural dos prompts que obrigaram a IA a devolver as informações mastigadas em formato estruturado, gerando as pontuações e resumos. (https://github.com/donratinho)

---

## 📝 Registro da Aula 
Atividade: Discussão crítica + mini-projeto de aplicação  
Local: Laboratório de informática 
Professor(a): Kadidja Valéria  

---

## 🚀 Próximos Passos
- **Melhorias sugeridas para o protótipo:** Implementar um extrator de texto de servidor para leitura nativa profunda de PDFs muito pesados ou rasurados, sem depender exclusivamente da colagem de texto.
- **Possíveis evoluções para o Projeto Final:** Expansão da IA para atuar não apenas como recrutadora de triagem, mas também gerando roteiros de entrevistas personalizados baseados nas deficiências detectadas no currículo de cada candidato aprovado na fase inicial.
