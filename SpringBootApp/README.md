# Spring Boot Task Management App

A Spring Boot application that serves your Next.js Task Management frontend.

## Project Structure

```
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

## Setup Instructions

### 1. Add Next.js Build Files

After building your Next.js app (`pnpm build`), copy the `out` folder contents to:
```
src/main/resources/static/
```

### 2. Update next.config.mjs (Next.js Project)

Make sure your Next.js project has static export enabled:
```javascript
export default {
  output: 'export',
  // ... rest of config
};
```

Then rebuild:
```bash
pnpm build
```

### 3. Open in IntelliJ

1. Open this `SpringBootApp` folder in IntelliJ IDEA
2. Let Maven import dependencies (may take a minute)

### 4. Run the Application

**In IntelliJ:**
- Open `src/main/java/com/example/taskapp/TaskManagementApplication.java`
- Click the green **Run** button next to the class name
- Or right-click → **Run 'TaskManagementApplication'**

**In Terminal:**
```bash
mvn spring-boot:run
```

### 5. Access the App

- **Frontend:** http://localhost:8080
- **API:** http://localhost:8080/api/tasks
- **H2 Console:** http://localhost:8080/h2-console

### 6. API Endpoints

- **GET** `/api/tasks` - Get all tasks
- **GET** `/api/tasks/{id}` - Get task by ID
- **POST** `/api/tasks` - Create new task
- **PUT** `/api/tasks/{id}` - Update task
- **DELETE** `/api/tasks/{id}` - Delete task

## Database

Currently uses **H2 in-memory database**. To use a different database (MySQL, PostgreSQL, etc.), update `pom.xml` and `application.properties`.

## Troubleshooting

- **Port 8080 already in use?** Change in `application.properties`: `server.port=8090`
- **Static files not loading?** Make sure Next.js build files are in `src/main/resources/static/`
- **API not working?** Check TaskController is properly configured and restart the app

---

Happy coding! 🚀
