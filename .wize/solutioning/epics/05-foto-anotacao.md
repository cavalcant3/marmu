---
epic_id: 05-foto-anotacao
status: ready
owner: Tony Stark
linked_prd: E05
linked_architecture: apps/mobile/src/screens/FotoAnotacao.tsx, apps/mobile/src/screens/DetalhesPedido.tsx
trigger_map_row: T4
priority: 5
estimate: M
---

# Epic 05: Foto-Anotação do Projeto

## Outcome
Dono tira foto do ambiente, anota medidas e observações em cima da imagem. Instalador entende o projeto sem desenhos rabiscados. "Instagram particular da obra."

## Stories
- E05-S01: Integração com câmera e galeria do Android
- E05-S02: Canvas de anotações sobre foto (texto + setas)
- E05-S03: Salvar foto com anotações no SQLite + vincular ao pedido
- E05-S04: Visualização de foto-anotação em tela cheia no pedido
- E05-S05: Sincronização de fotos com backend (upload/download)

## Dependencies
- Epic 03 (pedidos criados)
- react-native-image-picker + react-native-svg configurados

## Success
- Foto tirada e anotada em ≤ 2 minutos
- Anotações visíveis em tela cheia no detalhes do pedido
- Foto salva localmente offline; sync quando online
- ≥ 80% dos pedidos têm foto-anotação
