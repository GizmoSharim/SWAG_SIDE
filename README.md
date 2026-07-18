# SWAG SIDE

E-commerce streetwear com frontend React, API Node.js/Express, PostgreSQL e Prisma.

## Stack

- Frontend: React, React Router, Axios
- Backend: Node.js, Express, Prisma, PostgreSQL
- Auth: JWT, Refresh Token e Cookies HttpOnly
- Seguranca: Helmet, CORS configuravel, Rate Limit, Zod, tratamento centralizado de erros
- Upload: Cloudinary
- Deploy alvo: Vercel para frontend, Railway/Render para backend e PostgreSQL gerenciado

## Rodando localmente

Backend:

```powershell
cd backend
copy .env.example .env
npm.cmd install
npm.cmd run prisma:generate
npm.cmd run prisma:migrate
npm.cmd run seed
npm.cmd run dev
```

Frontend:

```powershell
cd swag-side-admin
copy .env.example .env
npm.cmd install
npm.cmd start
```

URLs:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3333`
- Healthcheck: `http://localhost:3333/health`

Admin seed:

- Email: `admin@swegside.com`
- Senha: `Admin@123456`

## Docker

```powershell
docker compose up --build
```

URLs com Docker:

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:3333`
- PostgreSQL: `localhost:5432`

## Variaveis obrigatorias

Backend:

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CORS_ORIGINS`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Frontend:

- `REACT_APP_API_URL`
- `REACT_APP_WHATSAPP_NUMBER`

## Deploy

Frontend na Vercel:

- Root directory: `swag-side-admin`
- Build command: `npm run build`
- Output: `build`
- Env: `REACT_APP_API_URL=https://sua-api.com`

Backend no Railway/Render:

- Root directory: `backend`
- Build: `npm install && npx prisma generate`
- Start: `npx prisma migrate deploy && node src/server.js`
- Configurar PostgreSQL e variáveis de ambiente.

Cloudinary:

- Criar cloud
- Configurar as três variáveis no backend
- O endpoint protegido `POST /uploads/images` aceita multipart com campo `images`
