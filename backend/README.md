# Backend SWAG SIDE

API REST para catalogo, autenticacao, pedidos, admin e uploads.

## Comandos

```powershell
npm.cmd install
npm.cmd run prisma:generate
npm.cmd run prisma:migrate
npm.cmd run seed
npm.cmd run dev
```

## Endpoints principais

- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`
- `GET /products`
- `GET /products/:id`
- `POST /products` Admin
- `PUT /products/:id` Admin
- `DELETE /products/:id` Admin
- `POST /orders`
- `GET /orders` Admin
- `GET /orders/:id` Admin
- `PATCH /orders/:id/status` Admin
- `POST /uploads/images` Admin

## Admin seed

- Email: `admin@swegside.com`
- Senha: `Admin@123456`
