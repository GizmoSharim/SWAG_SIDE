# 🚀 SWAG_SIDE - Documentação do Backend

Este repositório contém o core da aplicação SWAG_SIDE, responsável pelo catálogo dinâmico (RF01) e persistência de pedidos (RF04).

---

## 🛰️ Guia de API (Endpoints)

### 1. Catálogo de Produtos (RF01)
[cite_start]Retorna os itens com descrição, preço e grade de tamanhos[cite: 5].
- **Método:** `GET`
- **URL:** `http://localhost:3333/products`

### 2. Registro de Pedidos (RF05)
[cite_start]Salva o checkout antes do redirecionamento para o WhatsApp[cite: 9].
- **Método:** `POST`
- **URL:** `http://localhost:3333/orders`
- **Payload Exemplo (JSON):**
```json
{
  "customerName": "Margarida Nayandra",
  "whatsapp": "92991234567",
  "total": 129.90,
  "items": [
    { "name": "Camisa Oversized Black", "price": 129.90, "size": "G" }
  ]
}
```
- **Status de Sucesso:** `201 Created`

---

## 🔄 Fluxo de Funcionamento (Workflow)

1. [cite_start]**Persistência (Fase 3):** O Frontend envia os dados para o `POST /orders`[cite: 40].
2. [cite_start]**Processamento:** O `OrderController` valida o JSON e utiliza o `PrismaClient` para salvar no banco[cite: 28, 30].
3. [cite_start]**Status padrão:** O pedido é criado com status `PENDING` conforme regra de negócio[cite: 81].

---

## 🧪 Planejamento de Testes (Amanhã - Fase 5)

[cite_start]Amanhã focaremos em validar as **Regras de Negócio (RN)** e garantir a robustez do MVP[cite: 47].

### Cenários Críticos:
- [cite_start]**RN01:** Validar se o item só entra no banco com tamanho selecionado[cite: 16].
- [cite_start]**RN03:** Validar a formatação da mensagem padrão do WhatsApp[cite: 18].
- [cite_start]**RNF01:** Testar o Lazy Loading das imagens no catálogo[cite: 12].

### Comandos de Manutenção:
Se alterar o `schema.prisma`, execute nesta ordem:
```bash
npx prisma generate
npx prisma db push
```

---
**Equipe:** Margarida (Dev), Geovanni (Colab), Lucas (Scrum), Iago e Marcos.