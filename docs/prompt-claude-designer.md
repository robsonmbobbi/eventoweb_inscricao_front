# Prompt para o Claude Designer — Mocks EventoWeb Inscrição

> Copie o bloco abaixo (a partir de "Contexto do produto") para o Claude Designer. Ele descreve todas as telas, estados e regras visuais necessárias para gerar os mocks do front-end de inscrição do EventoWeb, que depois será implementado em React + TailwindCSS.

---

## Contexto do produto

Estou desenhando o front-end de um sistema de **inscrição para eventos** (EventoWeb). O usuário final é uma pessoa se inscrevendo (ou inscrevendo terceiros, como filhos) em um evento presencial. O fluxo é um wizard de várias etapas seguido de uma tela de "pedido" (carrinho) e finalização com pagamento. Público geral, não técnico, acessando principalmente pelo celular mas também pelo desktop — o design deve ser **responsivo, mobile-first**, com formulários longos organizados em passos claros e progress indicator visível.

Quero mocks de alta fidelidade para as telas abaixo, mantendo consistência visual entre elas (mesma paleta, tipografia, componentes de formulário, botões, cards, banners de alerta/erro/vazio). Sugira uma paleta e tipografia adequadas a um sistema institucional/comunitário (não corporativo-frio, não infantilizado) — pode usar uma cor primária de destaque para os comandos principais (ex.: "Inscrever-se", "Prosseguir", "Finalizar").

## Telas a produzir

### 1. Eventos Disponíveis (home)
- Grid/lista de cards de evento, cada um com: imagem de cartaz (proporção retrato, ex. A4/pôster), nome do evento, período de inscrição, período de realização, botão "Inscrever-se".
- Estado alternativo: **nenhum evento disponível** — ilustração amigável (ex. calendário vazio ou similar) + texto "Não há eventos disponíveis no momento" + volte mais tarde. Sem botão de ação.
- Estado de carregamento: skeleton dos cards.

### 2. Regulamento
- Título do evento, bloco de texto rolável simulando um regulamento (parágrafos de exemplo), checkbox "Li e aceito o regulamento", botão "Continuar" (desabilitado até marcar), link/botão "Voltar".

### 3. Informar CPF
- Tela simples e focada: campo único de CPF com máscara (000.000.000-00), botão "Prosseguir".
- Variante de erro: mensagem inline abaixo do campo ("Informe um CPF válido").
- Variante de erro por já inscrito: modal/alerta "Esta pessoa já está inscrita neste evento", com botão "Entendi" que limpa o campo.

### 4. Data de Nascimento
- Campo CPF preenchido e desabilitado (visualmente "read-only", cor mais neutra) + campo de Data de Nascimento (date picker), botão "Prosseguir", link "Voltar".
- O campo de Data de Nascimento é **sempre interativo/editável** — mesmo quando já vem preenchido, deve ter a aparência normal de um campo ativo (não usar o mesmo estilo "desabilitado" do CPF).
- Variante: campo de data já vem preenchido (pessoa reconhecida) vs. vazio (pessoa nova) — mostre as duas variantes, ambas com o campo de data editável.

### 5. Formulário de Inscrição
- Formulário mais longo — organize em seções com subtítulos: "Dados pessoais" (CPF e nascimento desabilitados no topo, nome, nome do crachá, sexo, e-mail, celular, cidade, UF), "Preferências" (dorme no evento, alergia a alimentos, diabético, vegetariano, usa adoçante — como checkboxes/toggles em grid), "Observações" (textarea).
- **Variante adulto**: seção extra "Instituições espíritas que frequenta" (texto livre).
- **Variante infantil**: seção extra "Responsáveis" com dois blocos "Responsável 1" (obrigatório) e "Responsável 2" (opcional), cada um com campo CPF + botão "Buscar" + nome preenchido automaticamente após busca bem-sucedida (read-only) + estado de erro "Não encontramos nenhuma inscrição com esse CPF para ser o responsável!".
- Rodapé fixo (sticky) com botões "Cancelar" (secundário) e "Salvar" (primário).

### 6. Pedido (carrinho + pagamento)
- Lista/tabela de inscrições já adicionadas: nome, tipo (badge "Infantil"/"Adulto"), valor estimado, ícone de status.
- Botão "Nova Inscrição" (adiciona outra pessoa ao mesmo pedido).
- Seletor de intenção: "Pagar agora" vs. "Solicitar desconto" vs. "Solicitar isenção" (ex.: segmented control ou radio cards).
- **Variante "Pagar agora"**: revelar seletor de forma de pagamento — cards "Pix" e "Cartão de Crédito", seleção única, **sem nenhum formulário de dados de cartão** (ao escolher "Cartão de Crédito", mostrar apenas um texto explicando que um link de pagamento será enviado após finalizar); seção "Dados do pagador" (nome, CPF, celular, e-mail) sempre visível nessa variante.
- **Variante "Solicitar desconto"/"Solicitar isenção"**: revelar campo de texto "Motivo" abaixo do seletor, sem exibir forma de pagamento nem dados do pagador.
- Total do pedido em destaque, recalculado conforme a forma de pagamento escolhida.
- Botão "Finalizar" em destaque.

### 7. Resultado / Confirmação
Produza as 3 variantes desta tela:
- **Pix**: QR code centralizado + código "copia e cola" em um campo com botão "Copiar" + status do pagamento (ex. badge "Aguardando pagamento").
- **Cartão de crédito (link de pagamento)**: campo com a URL do link de pagamento + botão "Copiar link" + texto informando que o link também foi enviado automaticamente por e-mail e WhatsApp para os dados informados + status do pagamento.
- **Desconto/Isenção solicitados**: ícone de "em análise" + mensagem "Sua solicitação será avaliada pela coordenação e o contato será feito em breve."
- Todas com botão final "Concluir" levando de volta à home.

## Diretrizes de estilo

- Tailwind-friendly: pense em componentes com espaçamentos e cantos consistentes (ex. `rounded-lg`, `shadow-sm`), fácil de traduzir para classes utilitárias.
- Formulários: labels sempre visíveis (não usar apenas placeholder), indicação clara de campo obrigatório (`*`), estados de erro com borda e texto vermelho abaixo do campo, estados de campo desabilitado visualmente distintos (fundo cinza claro).
- Botão primário: uma única cor de destaque consistente em todas as telas para a ação principal de avançar ("Prosseguir", "Salvar", "Finalizar").
- Componentes reaproveitáveis entre mocks: banner de alerta/erro, estado vazio, skeleton de carregamento, badge de tipo (Infantil/Adulto), progress indicator do wizard (mostrando em qual das etapas 3→4→5 o usuário está).
- Gere as telas em largura mobile (390px) **e** desktop (1280px) para as telas 1, 5 e 6, que são as mais densas em conteúdo; as demais podem ser só mobile.
