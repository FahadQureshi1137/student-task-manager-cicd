# 📚 Student Task Manager

A simple task management app built with **HTML + CSS + JS + PHP + MySQL**.
No Docker yet — this is the raw project you'll containerize step by step.

---

## Project Structure

```
student-task-manager/
├── index.html          ← Main frontend page
├── css/
│   └── style.css       ← All styles
├── js/
│   └── app.js          ← Frontend logic (fetch, render, forms)
├── php/
│   ├── config.php      ← Database connection settings
│   └── tasks.php       ← REST API (GET, POST, DELETE)
└── sql/
    └── database.sql    ← Database schema + sample data
```

---

## ⚙️ Requirements (Without Docker)

To run this project locally **without Docker**, you need:

| Tool | Purpose |
|------|---------|
| PHP 7.4+ | To run the backend API |
| MySQL 5.7+ | The database |
| A web server | Apache or Nginx (or PHP's built-in server) |

The easiest way is to use **XAMPP** or **WAMP** on Windows, or **MAMP** on Mac.

---

## 🚀 Setup Without Docker

### Step 1 — Start MySQL and import the database

1. Open your MySQL client (phpMyAdmin or terminal)
2. Run the SQL file:
   ```sql
   source /path/to/sql/database.sql
   ```
   Or import it via phpMyAdmin.

### Step 2 — Configure the database connection

Open `php/config.php` and update:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');     // your MySQL username
define('DB_PASS', '');         // your MySQL password
define('DB_NAME', 'taskmanager');
```

### Step 3 — Start the PHP server

```bash
cd student-task-manager
php -S localhost:8080
```

Then open http://localhost:8080 in your browser.

---

## What You'll Do With Docker (Next Steps)

Once you understand the project, you'll create:

- `Dockerfile`         — tells Docker how to build the PHP app container
- `docker-compose.yml` — defines and connects the PHP + MySQL containers
- `.env`               — stores environment variables (DB credentials etc.)

You'll containerize this so anyone can run it with just:
```bash
docker compose up
```

No more manual XAMPP/MySQL setup needed!
