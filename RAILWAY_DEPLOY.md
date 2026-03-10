# Deploy Task Management App to Railway

This guide walks you through deploying your Spring Boot + Next.js app to Railway with **PostgreSQL** (real production database) and **session-based login**.

---

## Prerequisites

- [Railway account](https://railway.app) (free tier works)
- GitHub repo with your code pushed
- Docker (optional; Railway can build from source)

---

## Step 1: Create a Railway Project

1. Go to [railway.app/new](https://railway.app/new)
2. Click **Deploy from GitHub repo**
3. Select your repository and authorize Railway if needed
4. Railway will create a new project

---

## Step 2: Add PostgreSQL (Real-Time Database)

1. In your Railway project, click **+ New**
2. Select **Database** → **PostgreSQL**
3. Wait for PostgreSQL to deploy
4. Click on the PostgreSQL service → **Variables** tab
5. Note the variables: `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `DATABASE_URL`

---

## Step 3: Connect PostgreSQL to Your App

1. Click on your **Spring Boot service** (the one from GitHub)
2. Go to **Variables** tab
3. Click **+ New Variable** → **Add a Reference**
4. Select the **PostgreSQL** service
5. Add references for: `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

   Or use **Add All** to reference all PostgreSQL variables.

Your app's `application.properties` is already configured to use these env vars when present.

---

## Step 4: Configure Build & Deploy

Railway will auto-detect your Dockerfile. If you deploy from the **project root** (where `Dockerfile` lives):

- **Build**: Railway uses the Dockerfile (builds Next.js → copies to Spring Boot → builds JAR)
- **Start**: Runs `java -jar app.jar`

### Root Directory

If your repo root has both Next.js and `SpringBootApp/`, set:

- **Root Directory**: `/` (or leave empty)
- **Dockerfile Path**: `Dockerfile` (default)

---

## Step 5: Set Port (Optional)

Railway sets `PORT` automatically. The app is configured with `server.port=${PORT:8080}`, so no extra config is needed.

---

## Step 6: Generate Public URL

1. Click your Spring Boot service
2. Go to **Settings** → **Networking**
3. Click **Generate Domain**
4. Copy the URL (e.g. `https://your-app.up.railway.app`)

---

## Step 7: Verify Login & Database

1. Open your Railway URL
2. **Sign up** with a new account
3. **Log in** — session-based auth works because the frontend and API share the same origin
4. Create tasks — they are stored in Railway PostgreSQL

---

## Session & Login Notes

- **Same-origin**: The Next.js static app is served by Spring Boot, so `/api/auth` and the UI share the same domain. Cookies and sessions work without CORS issues.
- **Session storage**: By default, sessions are in-memory. For a single instance (Railway default), this is fine.
- **Scaling**: If you add more instances later, consider [Redis for session storage](https://docs.railway.app/databases/redis) or switching to JWT.

---

## Environment Variables Summary

| Variable   | Source        | Purpose                          |
|-----------|---------------|----------------------------------|
| `PGHOST`  | PostgreSQL    | Database host                    |
| `PGPORT`  | PostgreSQL    | Database port                    |
| `PGUSER`  | PostgreSQL    | Database user                    |
| `PGPASSWORD` | PostgreSQL | Database password                |
| `PGDATABASE` | PostgreSQL | Database name                    |
| `PORT`    | Railway       | HTTP port (set automatically)    |

---

## Troubleshooting

### Build fails

- Ensure `package-lock.json` exists (run `npm install` locally and commit)
- Check Railway build logs for Maven or npm errors

### Database connection error

- Confirm PostgreSQL variables are **referenced** (not copied) from the PostgreSQL service
- In Variables, you should see `${{Postgres.PGHOST}}` style references

### Login not persisting

- Ensure you use the same domain (no redirects between `http` and `https`)
- Check that cookies are allowed (SameSite=Lax is set)

### 404 on refresh

- Spring Boot serves the SPA from `/` — ensure `WebConfig` maps `/**` to static files

---

## Alternative: Deploy Without Dockerfile

If you prefer not to use Docker:

1. Set **Root Directory** to `SpringBootApp`
2. Run `npm run build:static` locally and commit the `static/` folder
3. Railway will detect Java/Maven and build the JAR
4. Add a **Build Command**: `mvn package -DskipTests`
5. Add **Start Command**: `java -jar target/*.jar`

Using the Dockerfile is recommended for a clean, reproducible build.
