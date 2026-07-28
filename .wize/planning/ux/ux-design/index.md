# UX Design — Index

> Mapa de todas as telas do app Marmu → cenários → critérios de aceitação do PRD.

## Screens

| Screen | File | Scenarios | PRD ACs |
|---|---|---|---|
| Dashboard | `dashboard.md` | S1, S5 | AC-01-1, AC-07-1, AC-07-2, AC-07-3 |
| Novo Orçamento | `novo-orcamento.md` | S1 | AC-01-1, AC-01-2, AC-01-3, AC-01-4, AC-01-5 |
| Selecionar Material | `selecionar-material.md` | S1 | AC-02-3 |
| Visualizar Orçamento | `visualizar-orcamento.md` | S1 | AC-01-6, AC-03-1, AC-03-2, AC-03-3 |
| Lista de Orçamentos | `lista-orcamentos.md` | S2, S4, S5 | AC-06-1, AC-06-2, AC-06-3 |
| Detalhes do Orçamento | `detalhes-orcamento.md` | S2, S4 | AC-06-3 |
| Converter em Pedido | `converter-pedido.md` | S2 | AC-04-1, AC-04-2 |
| Lista de Pedidos | `lista-pedidos.md` | S3, S5 | AC-07-1 |
| Detalhes do Pedido | `detalhes-pedido.md` | S3 | AC-04-3, AC-04-4, AC-05-1, AC-05-2, AC-05-3 |
| Foto-Anotação | `foto-anotacao.md` | S3 | AC-05-1, AC-05-2, AC-05-3, AC-05-4 |
| Tabela de Preços | `tabela-precos.md` | S1 | AC-02-1, AC-02-2 |

## Flows principais

### Flow 1: Orçamento no local (S1)
```
Dashboard → Novo Orçamento → Selecionar Material → Novo Orçamento → Visualizar Orçamento → Dashboard
                                       ↓
                              Tabela de Preços (se material não existe)
```

### Flow 2: Converter em pedido (S2)
```
Dashboard → Lista de Orçamentos → Detalhes do Orçamento → Converter em Pedido → Detalhes do Pedido
```

### Flow 3: Lembrete e foto (S3)
```
Notificação Push → Detalhes do Pedido → Foto-Anotação (adicionar/visualizar) → Detalhes do Pedido
```

### Flow 4: Reabrir orçamento antigo (S4)
```
Dashboard → Lista de Orçamentos → (Busca) → Detalhes do Orçamento → Visualizar/Reenviar
```

### Flow 5: Resumo mensal (S5)
```
Dashboard → (Card tapped) → Lista de Orçamentos / Lista de Pedidos
```

## Telas implícitas (não especificadas, necessárias para Tony)

- **Menu Drawer/Configurações:** acessível pelo hamburger no Dashboard. Contém: Tabela de Preços, LGPD/Exportar Dados, Sobre, Versão.
- **LGPD/Exportar Dados:** tela para exportar ou deletar dados do cliente (requisito de compliance).
- **Splash Screen:** logo Marmu + carregamento inicial do SQLite.

## Decisões de design pendentes

1. **Design System:** Ainda não existe `.wize/solutioning/design-system/`. Mantis recomenda Material Design 3 (Android nativo) para React Native.
2. **Tema:** Light mode único no MVP (dark mode v2). Cores sugeridas: primária #1976D2 (azul), surface #FFFFFF, erro #B00020.
3. **Ícones:** Material Icons ou Phosphor Icons (React Native compatible).
4. **Tipografia:** Roboto (padrão Android) ou sistema nativo.

## Hand-off para Tony

Todas as telas estão em `ready-for-architecture`. O momento de verdade (moment-of-truth) de cada cenário está claramente identificado nos fluxos acima. As telas mais críticas para o MVP são:

1. **Novo Orçamento** (S1 — core do valor)
2. **Visualizar Orçamento** (S1 — entrega do PDF/WhatsApp)
3. **Detalhes do Pedido** (S3 — foto-anotação + lembrete)
4. **Dashboard** (S5 — tela inicial)
