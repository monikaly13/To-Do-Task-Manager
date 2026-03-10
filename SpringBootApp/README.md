## Spring Boot Task Management App – To-Do-Soon

Project: **To-Do-Soon**

A Spring Boot backend that powers a Next.js Task Management frontend. This service exposes a REST API for creating, reading, updating, and deleting tasks, and also serves the statically exported Next.js frontend.

---

### Tech Stack

- **Backend**: Java, Spring Boot, Spring Web, Spring Data JPA
- **Frontend**: Next.js (statically exported), React, TypeScript (optional)
- **Database**: H2 in-memory (development)
- **Build & Tools**: Maven, pnpm, IntelliJ IDEA
- **Hosting**: Railway (Java service)

---

### Live Deployment

- **Production URL (Railway)**: `https://your-railway-app-url.up.railway.app`  
  Replace this with your actual Railway deployment URL.

---

### Features

- **Task management API**: CRUD operations for tasks via REST endpoints.
- **Next.js integration**: Serves a statically exported Next.js frontend from Spring Boot.
- **H2 in-memory database**: Zero-setup development database with console access.
- **Maven-based build**: Standard Maven lifecycle for build, test, and run.
- **Configurable ports and DB**: Easily switch ports and databases via `application.properties`.

---

### Project Structure

```text
SpringBootApp/
├── src/
│   ├── main/
│   │   ├── java/com/example/taskapp/
│   │   │   ├── TaskManagementApplication.java   (Main app)
│   │   │   ├── config/
│   │   │   │   └── WebConfig.java              (Static file serving)
│   │   │   ├── controller/
│   │   │   │   └── TaskController.java         (REST API)
│   │   │   ├── model/
│   │   │   │   └── Task.java                   (Entity)
│   │   │   └── repository/
│   │   │       └── TaskRepository.java         (Database access)
│   │   └── resources/
│   │       ├── application.properties          (Configuration)
│   │       └── static/                         (Next.js build files go here)
│   └── test/
└── pom.xml                                     (Maven dependencies)
```

---

### Prerequisites

- **Java**: JDK 17+ (or the version configured in `pom.xml`)
- **Maven**: 3.8+ installed and on your `PATH`
- **Node.js + pnpm**: For building the Next.js frontend (in the frontend repo)

---

### Getting Started

This is the **quick local setup** for development.

#### 1. Build and export the Next.js frontend

In your Next.js project:

```bash
pnpm install
pnpm build
```

Make sure static export is enabled in `next.config.mjs`:

```javascript
export default {
  output: 'export',
  // ... rest of config
};
```

After the build completes, copy the contents of the `out` directory into this Spring Boot app:

```text
SpringBootApp/src/main/resources/static/
```

So that the final structure looks like:

```text
src/main/resources/static/index.html
src/main/resources/static/_next/...
# etc.
```

#### 2. Configure Spring Boot (optional)

Edit `src/main/resources/application.properties` as needed, for example:

```properties
server.port=8080

spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

spring.datasource.url=jdbc:h2:mem:taskdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update
```

You can also change the port if 8080 is already in use:

```properties
server.port=8090
```

#### 3. Run the application

**Using Maven (CLI):**

```bash
mvn spring-boot:run
```

**Using IntelliJ IDEA:**

- Open the `SpringBootApp` folder as a project.
- Wait for Maven to import dependencies.
- Open `TaskManagementApplication.java`.
- Click the green **Run** button or right-click → **Run 'TaskManagementApplication'**.

---

### Deploying to Railway (Backend)

This section describes a **typical** Railway deployment for the Spring Boot backend (your exact setup may vary slightly).

1. **Build the JAR locally**
   ```bash
   mvn clean package
   ```
   This produces `target/SpringBootApp-<version>.jar`.

2. **Ensure static frontend assets are included**
   - Before building, make sure the exported Next.js files are in `src/main/resources/static/` so they are packaged into the JAR.

3. **Create a new Railway project**
   - In Railway, create a **New Project** → **Deploy from GitHub repo** containing this Spring Boot project.

4. **Set Railway build & start commands (if needed)**
   - Build command (default Maven):
     ```bash
     mvn clean package
     ```
   - Start command:
     ```bash
     java -jar target/SpringBootApp-<version>.jar
     ```

5. **Configure environment variables (optional)**
   - For example, to override port or DB connection:
     - `SERVER_PORT` (or use `server.port` in `application.properties`)
     - JDBC URL and credentials if you switch from H2 to a managed DB.

6. **Get the public URL**
   - After Railway deploys successfully, copy the public URL and update the **Live Deployment** section above.

### Accessing the Application

- **Frontend**: `http://localhost:8080`
- **Task API base URL**: `http://localhost:8080/api/tasks`
- **H2 console**: `http://localhost:8080/h2-console`  
  - JDBC URL will typically be `jdbc:h2:mem:taskdb`
  - User: `sa`, password: (empty) — unless you changed it in `application.properties`.

---

### API Overview

Base path: `http://localhost:8080/api/tasks`

- **GET** `/api/tasks`  
  **Description**: Fetch all tasks.

- **GET** `/api/tasks/{id}`  
  **Description**: Fetch a single task by its ID.

- **POST** `/api/tasks`  
  **Description**: Create a new task.  
  **Body (JSON example)**:
  ```json
  {
    "title": "Finish README",
    "description": "Write and commit the Spring Boot app README",
    "completed": false
  }
  ```

- **PUT** `/api/tasks/{id}`  
  **Description**: Update an existing task by ID.  
  **Body**: Same shape as the POST body.

- **DELETE** `/api/tasks/{id}`  
  **Description**: Delete a task by ID.

> The exact fields may vary slightly depending on your `Task` entity; adjust the examples to match your model.

---

### Database

By default, the application uses an **H2 in-memory database**, which:

- Requires **no external setup**.
- Stores data only for the lifetime of the application process.
- Provides a **web console** at `/h2-console` when enabled.

To switch to another database (e.g., MySQL, PostgreSQL):

1. **Add the JDBC driver** dependency to `pom.xml`.
2. **Update** `spring.datasource.*` properties in `application.properties`.
3. **Adjust** `spring.jpa.hibernate.ddl-auto` to match your migration strategy (e.g., `validate`, `update`, or use Flyway/Liquibase).

---

### Database Structure

The core domain model is a single `tasks` table used by the `Task` entity.

```text
+-------------------------+
|         tasks           |
+-------------------------+
| id           (BIGINT)   |  PK, auto-generated
| title        (VARCHAR)  |  short task name
| description  (TEXT)     |  detailed description (optional)
| completed    (BOOLEAN)  |  default: false
| created_at   (TIMESTAMP)|  creation time
| updated_at   (TIMESTAMP)|  last update time
+-------------------------+
```

If your `Task` entity differs slightly, adjust the column list above to match the actual fields and types.

---

### Building for Production

To create a runnable JAR:

```bash
mvn clean package
```

The artifact will be in:

```text
target/SpringBootApp-<version>.jar
```

Run it with:

```bash
java -jar target/SpringBootApp-<version>.jar
```

Ensure that your `static` directory contains the built Next.js assets before building the JAR.

---

### Troubleshooting

- **Port 8080 already in use**  
  Set a different port in `application.properties`:
  ```properties
  server.port=8090
  ```

- **Frontend not loading / 404**  
  - Confirm that your Next.js build ran successfully (`pnpm build`).
  - Make sure the contents of the `out` directory are copied into `src/main/resources/static/`.

- **API returns errors**  
  - Check logs in your IDE/terminal for stack traces.
  - Verify `TaskController`, `TaskRepository`, and `Task` mappings.
  - Ensure your JSON matches the `Task` fields.

- **H2 console not accessible**  
  - Ensure `spring.h2.console.enabled=true`.
  - Confirm the path (`/h2-console`) is correct.
  - Check the JDBC URL and credentials.

---

### Development Notes

- **Hot reload**: If you are using DevTools (`spring-boot-devtools`), code changes may reload automatically.
- **CORS / integration with separate frontend dev server**:  
  If you run Next.js independently on another port (e.g., 3000) during development, you may need CORS configuration on the Spring Boot side or a proxy in your frontend dev server.

---

### AI Assistance Disclosure

Portions of this project documentation (including this `README.md`) were drafted with the assistance of an AI coding assistant (OpenAI model via Cursor). The maintainer reviewed, edited, and accepted the final content. No proprietary or confidential data was intentionally provided to the AI system beyond the contents of this repository.

If you have concerns about AI-generated content or would like to rework any parts of this README manually, feel free to open an issue or submit a pull request.

---

### License

Specify your license here, for example:

- **MIT License** – see `LICENSE` file for details.

If no license is provided yet, consider adding one before publishing this repository publicly.