---
screen: foto-anotacao
status: ready-for-architecture
owner: Mantis
created: 2026-07-27
linked_scenarios: [S3]
linked_acs: [AC-05-1, AC-05-2, AC-05-3, AC-05-4]
---

# Foto-Anotação

## Purpose
Permitir que o dono tire foto do ambiente e adicione anotações simples (texto e setas) em cima da imagem, para substituir o desenho rabiscado no papel.

## Primary user action
Tirar foto (ou selecionar da galeria) e adicionar anotações.

## Layout (mobile portrait)

```
┌─────────────────────────────┐
│  ←  Anotar Foto    [Salvar] │  ← Header com back e salvar
├─────────────────────────────┤
│                              │
│  ┌───────────────────────┐  │
│  │                       │  │
│  │    [FOTO DO AMBIENTE] │  │
│  │         ↖ 2,40m       │  │
│  │         ↙ 0,60m       │  │
│  │    [Canto coluna →]   │  │
│  │                       │  │
│  └───────────────────────┘  │
│                              │
│  ─── Ferramentas ───        │
│  [T] [→] [🎨] [↩️] [🗑️]    │  ← Toolbar: texto, seta, cor, desfazer, limpar
│                              │
│  [📝 Adicionar Texto]       │
│  [➡️ Adicionar Seta]        │
│                              │
└─────────────────────────────┘
```

## Content (copy)

- Header: "Anotar Foto" + botão "Salvar"
- Área da foto: canvas interativo
- Toolbar: ícones para texto, seta, seletor de cor, desfazer, limpar tudo
- Botões flutuantes: "Adicionar Texto", "Adicionar Seta"

## Interactions

- **Abrir tela** → opção: "Tirar foto" ou "Escolher da galeria" (ActionSheet/BottomSheet).
- **Tocar na foto** → se modo texto: abre input flutuante para digitar; se modo seta: desenha seta a partir do ponto tocado.
- **Arrastar anotação** → reposiciona texto/seta na foto.
- **Toque longo em anotação** → menu: Editar / Excluir.
- **Tocar "Salvar"** → salva imagem com anotações (renderizada) no pedido → volta para `detalhes-pedido`.
- **Tocar "↩️ Desfazer"** → remove última anotação.
- **Tocar "🗑️ Limpar"** → confirmação "Limpar todas as anotações?" [Limpar] [Cancelar].

## States

- **Câmera:** Abre câmera nativa do Android; após foto, entra em modo anotação.
- **Galeria:** Abre seletor de imagens nativo.
- **Sem anotações:** Foto exibida pura; toolbar ativa.
- **Offline:** Salva localmente; funciona normalmente.

## Accessibility notes

- Touch target dos botões da toolbar: 48dp.
- Input de texto deve ter teclado completo visível.
- TalkBack: "Foto do ambiente. Toque para adicionar texto. Toque e segure para arrastar anotações existentes."
- Gestos de pinça (zoom) devem ser suportados na foto para anotações precisas.

## Metrics

- Event `foto_tirada`.
- Event `anotacao_texto_adicionada`.
- Event `anotacao_seta_adicionada`.
- Event `foto_anotacao_salva`.

## Open questions for Tony

- Anotações devem ser salvas como layer separado (JSON com coordenadas + texto) ou renderizadas em uma única imagem? Recomendação: renderizar em imagem única para simplicidade; salvar JSON original como metadado opcional.
- Canvas: usar react-native-skia, react-native-svg, ou componente nativo? Recomendação: react-native-svg para texto e paths simples.
- Zoom/pan na foto: react-native-image-zoom-viewer?
