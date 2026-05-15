# SWAG_SIDE

Sistema de loja streetwear com:

- `backend/`: API Node.js + Express + Prisma + PostgreSQL.
- `front/`: loja principal em React + Vite.
- `swag-side-admin/`: painel administrativo em React para cadastrar, editar e excluir produtos.

## Requisitos

Instale antes de comecar:

- Node.js 18 ou superior
- npm
- Git
- PostgreSQL acessivel pela maquina

O PostgreSQL pode estar instalado direto na maquina, rodando em outra maquina da rede, em um servidor/cloud, ou em Docker. O importante e ter uma `DATABASE_URL` valida.

## 1. Clonar o projeto

```bash
git clone <URL_DO_REPOSITORIO>
cd SWAG_SIDE
```

## 2. Preparar o banco PostgreSQL

Crie um banco chamado `loja_roupas`, ou use outro nome e ajuste a `DATABASE_URL`.

Exemplo com PostgreSQL local:

```txt
host: localhost
porta: 5432
usuario: postgres
senha: postgres
banco: loja_roupas
schema: public
```

Exemplo de `DATABASE_URL`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/loja_roupas?schema=public"
```

Se o banco estiver em outra maquina, troque `localhost` pelo IP ou dominio:

```env
DATABASE_URL="postgresql://usuario:senha@IP_OU_HOST:5432/loja_roupas?schema=public"
```

### Opcional: PostgreSQL com Docker

Use apenas se a maquina nao tiver PostgreSQL instalado:

```bash
docker run --name swag-side-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=loja_roupas -p 5432:5432 -d postgres:16-alpine
```

Para iniciar depois:

```bash
docker start swag-side-postgres
```

## 3. Configurar e rodar o backend

Entre na pasta:

```bash
cd backend
```

Crie o arquivo `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/loja_roupas?schema=public"
```

Instale as dependencias:

```bash
npm install
```

Gere o Prisma Client:

```bash
npx prisma generate
```

Aplique as migrations no banco:

```bash
npx prisma migrate deploy
```

Rode a API:

```bash
npm run dev
```

A API deve ficar em:

```txt
http://localhost:3333
```

Teste no navegador:

```txt
http://localhost:3333/health
```

## 4. Rodar a loja principal

Em outro terminal:

```bash
cd front
npm install
npm run dev
```

A loja abre em:

```txt
http://localhost:5173
```

O `front/` usa o proxy do Vite para acessar:

- `http://localhost:3333/products`
- `http://localhost:3333/orders`

Se precisar apontar para outra API, crie `front/.env`:

```env
VITE_API_URL=http://localhost:3333
VITE_WHATSAPP_NUMBER=5592999999999
```

## 5. Rodar o painel admin

Em outro terminal:

```bash
cd swag-side-admin
npm install
npm start
```

O admin abre em:

```txt
http://localhost:3000
```

Se precisar apontar para outra API, crie `swag-side-admin/.env`:

```env
REACT_APP_API_URL=http://localhost:3333
```

## Ordem correta para rodar tudo

1. Garantir que o PostgreSQL esta rodando.
2. Rodar as migrations com Prisma.
3. Rodar o backend em `backend/`.
4. Rodar a loja em `front/`.
5. Rodar o admin em `swag-side-admin/`.

## Scripts uteis

Backend:

```bash
cd backend
npm run dev
npx prisma migrate deploy
npx prisma generate
```

Loja:

```bash
cd front
npm run dev
npm run build
```

Admin:

```bash
cd swag-side-admin
npm start
npm run build
```

## Problemas comuns

### Erro de conexao com banco

Se aparecer:

```txt
Can't reach database server at localhost:5432
```

Verifique:

- o PostgreSQL esta rodando?
- o host da `DATABASE_URL` esta correto?
- a porta `5432` esta aberta?
- o banco `loja_roupas` existe?

Para testar porta no Windows:

```powershell
Test-NetConnection localhost -Port 5432
```

### Erro de autenticacao

Se aparecer:

```txt
Authentication failed against database server
```

Confira usuario e senha na `DATABASE_URL`.

Se a senha tiver caracteres especiais, codifique na URL. Exemplo: `@` vira `%40`.

### Tabela nao existe

Se aparecer:

```txt
The table public.Product does not exist
```

ou:

```txt
The table public.Order does not exist
```

Rode dentro de `backend/`:

```bash
npx prisma migrate deploy
```

### Erro de CORS

Confirme se o backend esta rodando:

```txt
http://localhost:3333
```

O backend libera estas origens:

- `http://localhost:5173`
- `http://127.0.0.1:5173`
- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `http://localhost:3001`
- `http://127.0.0.1:3001`

Quando aparece CORS com status `null`, muitas vezes a API esta parada.

## Observacoes importantes

- Nao suba arquivos `.env` com senhas reais para o GitHub.
- Quem conecta no banco e o `backend/.env`.
- O `.env` do admin serve apenas para configurar a URL da API.
- O `.env` do front serve para configurar URL da API e numero do WhatsApp.
- Para producao, use um PostgreSQL hospedado e troque a `DATABASE_URL`.
