# Book Store API

A REST API for an online bookstore, built with **Node.js, Express and MongoDB**: books, authors, users with JWT authentication and an admin role, password reset by email, and image upload.

## Features

- **Books and authors:** full CRUD. Reading is public; creating, updating and deleting need an admin.
- **Price filter:** `GET /api/books?minPrice=5&maxPrice=15`
- **Authors pagination:** `GET /api/authors?pageNumber=2`
- **Users:** register and log in (JWT); users can read, update and delete their own account, admins can manage everyone.
- **Validation:** every request body is checked with **Joi**, including a password complexity rule; the database schema has its own limits (Mongoose validators).
- **Password reset:** a one-time link that expires after 10 minutes, sent by email (nodemailer), with server-rendered pages (EJS).
- **Image upload:** admins can upload PNG, JPEG or WebP images (2 MB max) with multer.

## Tech stack

| Part | Tech |
|---|---|
| Server | Node.js, Express 4 |
| Database | MongoDB, Mongoose 8 |
| Auth | JSON Web Tokens, bcryptjs |
| Validation | Joi, joi-password-complexity |
| Security | helmet, CORS |
| Files and email | multer, nodemailer |
| Views | EJS (password reset pages) |

## Project structure

```
config/db.js          MongoDB connection (reads MONGO_URI)
models/               Mongoose schemas + Joi validation for each model
controllers/          the logic of each endpoint
routes/               URLs → controllers, with the auth middleware
middlewares/          JWT checks (user, owner or admin) and error handling
views/                EJS pages for the password reset flow
seeder.js, data.js    sample data
```

## API

Protected routes expect the JWT in a `token` header: `token: <your token>`.

| Method | Path | Access |
|---|---|---|
| POST | `/api/auth/register` | public |
| POST | `/api/auth/login` | public |
| GET | `/api/books` (`?minPrice=&maxPrice=`) | public |
| GET | `/api/books/:id` | public |
| POST / PUT / DELETE | `/api/books`, `/api/books/:id` | admin |
| GET | `/api/authors` (`?pageNumber=`) | public |
| GET | `/api/authors/:id` | public |
| POST / PUT / DELETE | `/api/authors`, `/api/authors/:id` | admin |
| GET | `/api/users` | admin |
| GET / PUT / DELETE | `/api/users/:id` | the user or an admin |
| GET / POST | `/password/forgot-password` | public |
| GET / POST | `/password/reset-password/:userId/:token` | public (valid link) |
| POST | `/api/upload` (form field `image`) | admin |

### Example

```bash
# log in
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Str0ng!Pass"}'

# create a book (admin token)
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" -H "token: <admin token>" \
  -d '{"title":"Palace Walk","author":"<authorId>","description":"The first novel of the Cairo Trilogy","price":10,"cover":"soft cover"}'
```

## How the password reset works

1. `POST /password/forgot-password` with an email. The answer is always the same, whether the email is registered or not, so the form can't be used to find out who has an account.
2. If the user exists, a link is **emailed** to them. It is signed with `JWT_SECRET_KEY + the current password hash` and expires in 10 minutes.
3. Because the signature includes the password hash, the link stops working as soon as the password changes: **it can only be used once**.
4. Without an email server (`SMTP_HOST` empty), the link is printed in the server console, for local development only.

## Run it

Needs Node.js 18+ and MongoDB (local or Atlas).

```bash
npm install
cp .env.example .env     # set MONGO_URI and a long random JWT_SECRET_KEY
npm run dev              # http://localhost:5000
```

There is no "create admin" endpoint on purpose: register a user, then set `isAdmin: true` on it in the database.

Sample data: `node seeder.js -import-author`, `node seeder.js -import`, `node seeder.js -remove`.

## Security fixes (November 2026)

A review of this project found and fixed these problems. Each one has its own commit:

- The MongoDB connection string, with its password, was written in the code. It now comes from `.env`.
- A route registered with `app.use('/')` answered **every** request, so the API routes were never reached.
- The password reset link was returned in the HTTP response, so anyone who knew an email could reset that account's password. It is now emailed.
- The upload endpoint accepted any file from anyone, and a file name containing `../` could write outside the `images` folder.
- Smaller bugs: the 404 handler crashed into a 500, creating an author always failed (a `fristName` typo), and login validation errors said "here".

## Known limitations

- No automated test suite yet. The fixes above were checked by running the API against a local MongoDB.
- Tokens have no expiry date, and they use a custom `token` header instead of the standard `Authorization: Bearer`.
- Uploaded images are stored on the server's disk; a real deployment would use object storage (for example S3).
